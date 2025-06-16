import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const TripCard = ({ trip }) => {
  const navigate = useNavigate()
  
  const handleViewTrip = () => {
    navigate(`/trip/${trip.id}/timeline`)
  }
  
const formatDateRange = (startDate, endDate) => {
    // Validate input dates
    if (!startDate || !endDate) {
      return 'Date not available'
    }
    
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      // Check if dates are valid
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Invalid date'
      }
      
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`
      } else {
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
      }
    } catch (error) {
      console.error('Error formatting date range:', error)
      return 'Date format error'
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 gradient-overlay opacity-60"></div>
        
        {/* Trip Name Overlay */}
        <div className="absolute inset-0 flex items-end p-6">
          <div className="text-white">
            <h3 className="text-xl font-display font-bold mb-1">{trip.name}</h3>
            <p className="text-white/90 flex items-center">
              <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
              {trip.destination}
            </p>
          </div>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
<span className="text-xs">
              {(() => {
                try {
                  if (!trip.start_date || !trip.end_date) return '0 days'
                  const start = new Date(trip.start_date)
                  const end = new Date(trip.end_date)
                  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '0 days'
                  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + ' days'
                } catch (error) {
                  return '0 days'
                }
              })()}
            </span>
          </div>
        </div>
        
        <Button
          onClick={handleViewTrip}
          variant="gradient"
          size="md"
          className="w-full"
          icon="ArrowRight"
          iconPosition="right"
        >
          View Trip
        </Button>
      </div>
    </motion.div>
  )
}

export default TripCard