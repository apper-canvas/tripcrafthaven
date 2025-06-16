import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import EmptyState from '@/components/molecules/EmptyState'
import LoadingState from '@/components/molecules/LoadingState'
import ActivityModal from '@/components/organisms/ActivityModal'
import { tripService, activityService } from '@/services'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

const Calendar = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [view, setView] = useState('month')

  useEffect(() => {
    if (tripId) {
      loadTripData()
    }
  }, [tripId])

  const loadTripData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tripData, activitiesData] = await Promise.all([
        tripService.getById(tripId),
        activityService.getByTripId(tripId)
      ])
      setTrip(tripData)
      setActivities(activitiesData)
    } catch (err) {
      const errorMessage = err.message || 'Failed to load trip data'
      
      if (errorMessage.includes('Record does not exist')) {
        toast.error('Trip not found. Redirecting to My Trips...')
        navigate('/trips')
        return
      }
      
      setError(errorMessage)
      toast.error('Failed to load trip data')
    } finally {
      setLoading(false)
    }
  }

  const calendarEvents = useMemo(() => {
    return activities.map(activity => {
      const activityDate = new Date(activity.date)
      
      // Handle time if available
      let startTime = activityDate
      let endTime = new Date(activityDate)
      
      if (activity.time) {
        const [hours, minutes] = activity.time.split(':').map(Number)
        startTime = new Date(activityDate)
        startTime.setHours(hours, minutes || 0)
        
        endTime = new Date(startTime)
        if (activity.duration) {
          endTime.setMinutes(endTime.getMinutes() + activity.duration)
        } else {
          endTime.setHours(endTime.getHours() + 1) // Default 1 hour
        }
      } else {
        // All day event
        endTime.setDate(endTime.getDate() + 1)
      }

      return {
        id: activity.id,
        title: activity.title || activity.name,
        start: startTime,
        end: endTime,
        allDay: !activity.time,
        resource: activity
      }
    })
  }, [activities])

  const handleSelectSlot = ({ start }) => {
    if (!trip) return
    
    const tripStart = new Date(trip.startDate)
    const tripEnd = new Date(trip.endDate)
    
    // Check if selected date is within trip dates
    if (start < tripStart || start > tripEnd) {
      toast.warning('Please select a date within your trip period')
      return
    }
    
    setSelectedDate(format(start, 'yyyy-MM-dd'))
    setEditingActivity(null)
    setIsActivityModalOpen(true)
  }

  const handleSelectEvent = (event) => {
    setEditingActivity(event.resource)
    setIsActivityModalOpen(true)
  }

  const handleActivitySaved = (savedActivity) => {
    if (editingActivity) {
      setActivities(prev => prev.map(activity => 
        activity.id === savedActivity.id ? savedActivity : activity
      ))
    } else {
      setActivities(prev => [...prev, savedActivity])
    }
    setEditingActivity(null)
    setSelectedDate(null)
  }

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return
    
    try {
      await activityService.delete(activityId)
      setActivities(prev => prev.filter(activity => activity.id !== activityId))
      toast.success('Activity deleted successfully')
    } catch (error) {
      toast.error('Failed to delete activity')
    }
  }

  const handleAddActivity = () => {
    setEditingActivity(null)
    setSelectedDate(null)
    setIsActivityModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsActivityModalOpen(false)
    setEditingActivity(null)
    setSelectedDate(null)
  }

  const getAvailableDates = () => {
    if (!trip) return []
    
    try {
      const startDate = new Date(trip.startDate)
      const endDate = new Date(trip.endDate)
      const dates = []
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(format(new Date(d), 'yyyy-MM-dd'))
      }
      
      return dates
    } catch (error) {
      return []
    }
  }

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: '#3b82f6',
      borderRadius: '6px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      fontSize: '12px',
      padding: '2px 4px'
    }

    // Color code by activity type if available
    if (event.resource.type) {
      switch (event.resource.type.toLowerCase()) {
        case 'flight':
          style.backgroundColor = '#ef4444'
          break
        case 'hotel':
          style.backgroundColor = '#8b5cf6'
          break
        case 'restaurant':
          style.backgroundColor = '#f59e0b'
          break
        case 'activity':
          style.backgroundColor = '#10b981'
          break
        default:
          style.backgroundColor = '#3b82f6'
      }
    }

    return { style }
  }

  const CustomToolbar = ({ onNavigate, onView, view: currentView, date }) => {
    const goToBack = () => onNavigate('PREV')
    const goToNext = () => onNavigate('NEXT')
    const goToToday = () => onNavigate('TODAY')
    
    const monthLabel = moment(date).format('MMMM YYYY')

    return (
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-surface-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-display font-semibold text-gray-900">
            {monthLabel}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToBack}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="ChevronLeft" className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex rounded-lg border border-surface-200 overflow-hidden">
            {['month', 'week', 'day'].map((viewName) => (
              <button
                key={viewName}
                onClick={() => onView(viewName)}
                className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  currentView === viewName
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-surface-50'
                }`}
              >
                {viewName}
              </button>
            ))}
          </div>
          
          <Button
            onClick={handleAddActivity}
            variant="gradient"
            size="sm"
            icon="Plus"
          >
            Add Activity
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-surface-200 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-5 bg-surface-200 rounded animate-pulse w-64"></div>
          </div>
          <LoadingState type="calendar" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Calendar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadTripData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!trip) return null

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              {trip.name} Calendar
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span className="flex items-center">
                <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                {trip.destination}
              </span>
              <span className="flex items-center">
                <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        {activities.length === 0 ? (
          <EmptyState
            icon="Calendar"
            title="No activities scheduled"
            description="Start planning your trip by adding activities to your calendar. Click on any date to get started."
            actionLabel="Add First Activity"
            onAction={handleAddActivity}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden"
          >
            <style jsx global>{`
              .rbc-calendar {
                font-family: inherit;
              }
              .rbc-header {
                background-color: #f8fafc;
                padding: 12px 8px;
                font-weight: 600;
                color: #374151;
                border-bottom: 1px solid #e5e7eb;
              }
              .rbc-month-view {
                border: none;
              }
              .rbc-date-cell {
                padding: 8px;
              }
              .rbc-today {
                background-color: #fef3c7;
              }
              .rbc-off-range-bg {
                background-color: #f9fafb;
              }
              .rbc-event {
                font-size: 12px;
                padding: 2px 4px;
                margin: 1px 0;
              }
              .rbc-toolbar {
                display: none;
              }
            `}</style>
            
            <BigCalendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600, padding: '20px' }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable
              views={['month', 'week', 'day']}
              view={view}
              onView={setView}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CustomToolbar
              }}
              min={new Date(0, 0, 0, 6, 0, 0)} // 6 AM
              max={new Date(0, 0, 0, 23, 59, 59)} // 11:59 PM
            />
          </motion.div>
        )}

        {/* Activity Modal */}
        <ActivityModal
          isOpen={isActivityModalOpen}
          onClose={handleCloseModal}
          tripId={tripId}
          activity={editingActivity}
          onActivitySaved={handleActivitySaved}
          availableDates={getAvailableDates()}
          defaultDate={selectedDate}
        />
      </div>
    </div>
  )
}

export default Calendar