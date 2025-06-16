import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const PackingItem = ({ item, onToggle, onDelete, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
        item.packed 
          ? 'bg-success/5 border-success/20' 
          : 'bg-white border-surface-200 hover:border-surface-300'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(item.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            item.packed
              ? 'bg-success border-success text-white'
              : 'border-surface-300 hover:border-primary'
          }`}
        >
          {item.packed && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <ApperIcon name="Check" className="w-3 h-3" />
            </motion.div>
          )}
        </motion.button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className={`font-medium transition-all duration-200 ${
              item.packed ? 'text-success line-through' : 'text-gray-900'
            }`}>
              {item.name}
            </span>
            
            {item.quantity > 1 && (
              <span className="text-xs text-gray-500 bg-surface-100 px-2 py-0.5 rounded-full">
                {item.quantity}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={() => onDelete(item.id)}
        className="p-1.5 text-gray-400 hover:text-error hover:bg-error/5 rounded-lg transition-colors ml-2"
      >
        <ApperIcon name="Trash2" className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export default PackingItem