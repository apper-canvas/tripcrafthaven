import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import TripCard from '@/components/molecules/TripCard'
import EmptyState from '@/components/molecules/EmptyState'
import LoadingState from '@/components/molecules/LoadingState'
import CreateTripModal from '@/components/organisms/CreateTripModal'
import { tripService } from '@/services'

const MyTrips = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    loadTrips()
  }, [])

  const loadTrips = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await tripService.getAll()
      setTrips(result)
    } catch (err) {
      setError(err.message || 'Failed to load trips')
      toast.error('Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  const handleTripCreated = (newTrip) => {
    setTrips(prev => [...prev, newTrip])
  }

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return
    
    try {
      await tripService.delete(tripId)
      setTrips(prev => prev.filter(trip => trip.id !== tripId))
      toast.success('Trip deleted successfully')
    } catch (error) {
      toast.error('Failed to delete trip')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-surface-200 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-5 bg-surface-200 rounded animate-pulse w-64"></div>
          </div>
          <LoadingState count={6} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Trips</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadTrips} variant="primary">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              My Trips
            </h1>
            <p className="text-gray-600">
              {trips.length === 0 
                ? 'Start planning your next adventure' 
                : `You have ${trips.length} trip${trips.length === 1 ? '' : 's'} planned`
              }
            </p>
          </div>
          
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="gradient"
            size="lg"
            icon="Plus"
          >
            Create Trip
          </Button>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <EmptyState
            icon="MapPin"
            title="No trips yet"
            description="Create your first trip to start planning your next adventure. Add destinations, build itineraries, and organize your packing list all in one place."
            actionLabel="Create Your First Trip"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TripCard trip={trip} onDelete={handleDeleteTrip} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Create Trip Modal */}
        <CreateTripModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTripCreated={handleTripCreated}
        />
      </div>
    </div>
  )
}

export default MyTrips