import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, differenceInDays, isBefore, isAfter } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import LoadingState from '@/components/molecules/LoadingState'
import { tripService, activityService, packingService } from '@/services'

const Overview = () => {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [activities, setActivities] = useState([])
  const [packingItems, setPackingItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (tripId) {
      loadTripData()
    }
  }, [tripId])

  const loadTripData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tripData, activitiesData, packingData] = await Promise.all([
        tripService.getById(tripId),
        activityService.getByTripId(tripId),
        packingService.getByTripId(tripId)
      ])
      setTrip(tripData)
      setActivities(activitiesData)
      setPackingItems(packingData)
    } catch (err) {
      setError(err.message || 'Failed to load trip overview')
      toast.error('Failed to load trip overview')
    } finally {
      setLoading(false)
    }
  }

  const getTripStatus = () => {
    if (!trip) return { status: 'unknown', label: 'Unknown', color: 'default' }
    
    const now = new Date()
    const startDate = new Date(trip.startDate)
    const endDate = new Date(trip.endDate)
    
    if (isBefore(now, startDate)) {
      return { status: 'upcoming', label: 'Upcoming', color: 'primary' }
    } else if (isAfter(now, endDate)) {
      return { status: 'completed', label: 'Completed', color: 'success' }
    } else {
      return { status: 'active', label: 'Active', color: 'accent' }
    }
  }

  const getPackingStats = () => {
    const totalItems = packingItems.length
    const packedItems = packingItems.filter(item => item.packed).length
    const progress = totalItems > 0 ? (packedItems / totalItems) * 100 : 0
    
    return { totalItems, packedItems, progress }
  }

  const getActivityStats = () => {
    const activityTypes = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1
      return acc
    }, {})
    
    return {
      total: activities.length,
      byType: activityTypes
    }
  }

  const getUpcomingActivities = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return activities
      .filter(activity => activity.date >= today)
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        if (dateCompare !== 0) return dateCompare
        return (a.time || '').localeCompare(b.time || '')
      })
      .slice(0, 3)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-surface-200 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-5 bg-surface-200 rounded animate-pulse w-64"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-surface-200">
                <div className="h-4 bg-surface-200 rounded animate-pulse w-3/4 mb-4"></div>
                <div className="h-8 bg-surface-200 rounded animate-pulse w-1/2 mb-2"></div>
                <div className="h-3 bg-surface-200 rounded animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto text-center py-12">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Overview</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadTripData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!trip) return null

  const tripStatus = getTripStatus()
  const packingStats = getPackingStats()
  const activityStats = getActivityStats()
  const upcomingActivities = getUpcomingActivities()
  const tripDuration = differenceInDays(new Date(trip.endDate), new Date(trip.startDate)) + 1

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-display font-bold text-gray-900">
                {trip.name}
              </h1>
              <Badge variant={tripStatus.color} size="md">
                {tripStatus.label}
              </Badge>
            </div>
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
                {tripDuration} days
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Trip Duration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-gray-900">Trip Duration</h3>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {tripDuration}
            </div>
            <p className="text-gray-600">days</p>
          </motion.div>

          {/* Activities Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-gray-900">Activities</h3>
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <ApperIcon name="MapPin" className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {activityStats.total}
            </div>
            <p className="text-gray-600">planned</p>
          </motion.div>

          {/* Packing Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-gray-900">Packing</h3>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ApperIcon name="Package" className="w-5 h-5 text-accent" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {Math.round(packingStats.progress)}%
            </div>
            <p className="text-gray-600">
              {packingStats.packedItems} of {packingStats.totalItems} items
            </p>
            
            <div className="mt-3 w-full bg-surface-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${packingStats.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-2 rounded-full bg-accent"
              />
            </div>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Upcoming Activities
              </h2>
              <ApperIcon name="Clock" className="w-5 h-5 text-gray-400" />
            </div>
            
            {upcomingActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No upcoming activities</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <ApperIcon 
                        name={activity.type === 'flight' ? 'Plane' : 
                              activity.type === 'hotel' ? 'Building2' :
                              activity.type === 'restaurant' ? 'Utensils' :
                              activity.type === 'sightseeing' ? 'Camera' : 'MapPin'} 
                        className="w-4 h-4 text-secondary" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(activity.date), 'MMM d')}
                        {activity.time && ` at ${activity.time}`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Activity Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-surface-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Activity Breakdown
              </h2>
              <ApperIcon name="BarChart3" className="w-5 h-5 text-gray-400" />
            </div>
            
            {Object.keys(activityStats.byType).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="BarChart3" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No activities added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(activityStats.byType).map(([type, count], index) => (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <ApperIcon 
                        name={type === 'flight' ? 'Plane' : 
                              type === 'hotel' ? 'Building2' :
                              type === 'restaurant' ? 'Utensils' :
                              type === 'sightseeing' ? 'Camera' :
                              type === 'transport' ? 'Car' : 'MapPin'} 
                        className="w-4 h-4 text-gray-600" 
                      />
                      <span className="font-medium text-gray-900 capitalize">{type}</span>
                    </div>
                    <Badge variant="default" size="sm">{count}</Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Overview