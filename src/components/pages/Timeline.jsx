import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, differenceInDays, eachDayOfInterval } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import ActivityCard from '@/components/molecules/ActivityCard'
import EmptyState from '@/components/molecules/EmptyState'
import LoadingState from '@/components/molecules/LoadingState'
import ActivityModal from '@/components/organisms/ActivityModal'
import { tripService, activityService } from '@/services'

const Timeline = () => {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)

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
      setError(err.message || 'Failed to load trip data')
      toast.error('Failed to load trip data')
    } finally {
      setLoading(false)
    }
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
  }

  const handleEditActivity = (activity) => {
    setEditingActivity(activity)
    setIsActivityModalOpen(true)
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
    setIsActivityModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsActivityModalOpen(false)
    setEditingActivity(null)
  }

  const getAvailableDates = () => {
    if (!trip) return []
    
    try {
      const startDate = new Date(trip.startDate)
      const endDate = new Date(trip.endDate)
      
      return eachDayOfInterval({ start: startDate, end: endDate })
        .map(date => format(date, 'yyyy-MM-dd'))
    } catch (error) {
      return []
    }
  }

  const groupActivitiesByDate = () => {
    const grouped = {}
    const availableDates = getAvailableDates()
    
    // Initialize all dates
    availableDates.forEach(date => {
      grouped[date] = []
    })
    
    // Group activities by date
    activities.forEach(activity => {
      if (grouped[activity.date]) {
        grouped[activity.date].push(activity)
      }
    })
    
    // Sort activities within each date by time
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        if (!a.time) return 1
        if (!b.time) return -1
        return a.time.localeCompare(b.time)
      })
    })
    
    return grouped
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-surface-200 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-5 bg-surface-200 rounded animate-pulse w-64"></div>
          </div>
          <LoadingState type="timeline" count={5} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Timeline</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadTripData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!trip) return null

  const groupedActivities = groupActivitiesByDate()
  const hasActivities = activities.length > 0

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              {trip.name} Timeline
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
              <span className="flex items-center">
                <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                {differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1} days
              </span>
            </div>
          </div>
          
          <Button
            onClick={handleAddActivity}
            variant="gradient"
            size="lg"
            icon="Plus"
          >
            Add Activity
          </Button>
        </div>

        {/* Timeline */}
        {!hasActivities ? (
          <EmptyState
            icon="Calendar"
            title="No activities planned yet"
            description="Start building your itinerary by adding activities, flights, hotels, and restaurants to your timeline."
            actionLabel="Add First Activity"
            onAction={handleAddActivity}
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedActivities).map(([date, dayActivities]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                {/* Date Header */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full gradient-travel flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {format(new Date(date), 'd')}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-semibold text-gray-900">
                        {format(new Date(date), 'EEEE, MMMM d')}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Activities for this day */}
                <div className="ml-6 border-l-2 border-surface-200 pl-6 space-y-4">
                  {dayActivities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ApperIcon name="Calendar" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No activities planned for this day</p>
                      <button
                        onClick={handleAddActivity}
                        className="mt-2 text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        Add activity
                      </button>
                    </div>
                  ) : (
                    dayActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ActivityCard
                          activity={activity}
                          onEdit={handleEditActivity}
                          onDelete={handleDeleteActivity}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Activity Modal */}
        <ActivityModal
          isOpen={isActivityModalOpen}
          onClose={handleCloseModal}
          tripId={tripId}
          activity={editingActivity}
          onActivitySaved={handleActivitySaved}
          availableDates={getAvailableDates()}
        />
      </div>
    </div>
  )
}

export default Timeline