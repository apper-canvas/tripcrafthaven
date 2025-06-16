import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const getActivityIcon = (type) => {
    const icons = {
      flight: 'Plane',
      hotel: 'Building2',
      restaurant: 'Utensils',
      sightseeing: 'Camera',
      transport: 'Car',
      activity: 'MapPin'
    }
    return icons[type] || 'MapPin'
  }
  
  const getActivityColor = (type) => {
    const colors = {
      flight: 'primary',
      hotel: 'secondary',
      restaurant: 'accent',
      sightseeing: 'success',
      transport: 'warning',
      activity: 'default'
    }
    return colors[type] || 'default'
  }
  
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-surface-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Timeline Dot */}
          <div className="flex-shrink-0 mt-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              getActivityColor(activity.type) === 'primary' ? 'bg-primary/10' :
              getActivityColor(activity.type) === 'secondary' ? 'bg-secondary/10' :
              getActivityColor(activity.type) === 'accent' ? 'bg-accent/10' :
              getActivityColor(activity.type) === 'success' ? 'bg-success/10' :
              getActivityColor(activity.type) === 'warning' ? 'bg-warning/10' :
              'bg-surface-100'
            }`}>
              <ApperIcon 
                name={getActivityIcon(activity.type)} 
                className={`w-4 h-4 ${
                  getActivityColor(activity.type) === 'primary' ? 'text-primary' :
                  getActivityColor(activity.type) === 'secondary' ? 'text-secondary' :
                  getActivityColor(activity.type) === 'accent' ? 'text-accent' :
                  getActivityColor(activity.type) === 'success' ? 'text-success' :
                  getActivityColor(activity.type) === 'warning' ? 'text-warning' :
                  'text-surface-600'
                }`} 
              />
            </div>
          </div>
          
          {/* Activity Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
              <Badge variant={getActivityColor(activity.type)} size="xs">
                {activity.type}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                {activity.time}
              </span>
              
              {activity.duration > 0 && (
                <span className="flex items-center">
                  <ApperIcon name="Timer" className="w-4 h-4 mr-1" />
                  {formatDuration(activity.duration)}
                </span>
              )}
              
              {activity.location && (
                <span className="flex items-center">
                  <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                  {activity.location}
                </span>
              )}
            </div>
            
            {activity.notes && (
              <p className="text-sm text-gray-500 break-words">{activity.notes}</p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onEdit(activity)}
            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="p-1.5 text-gray-400 hover:text-error hover:bg-error/5 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ActivityCard