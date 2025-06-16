import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 4,
          ease: 'easeInOut'
        }}
        className="mb-6"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-surface-100 flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-surface-400" />
        </div>
      </motion.div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="gradient"
          size="lg"
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default EmptyState