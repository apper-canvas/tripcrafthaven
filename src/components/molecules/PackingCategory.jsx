import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import PackingItem from './PackingItem'

const PackingCategory = ({ 
  category, 
  items, 
  onToggleItem, 
  onDeleteItem, 
  onAddItem 
}) => {
  const getCategoryIcon = (category) => {
    const icons = {
      clothing: 'Shirt',
      toiletries: 'Droplets',
      documents: 'FileText',
      electronics: 'Smartphone',
      accessories: 'Watch',
      medications: 'Pill',
      other: 'Package'
    }
    return icons[category] || 'Package'
  }
  
  const getCategoryColor = (category) => {
    const colors = {
      clothing: 'primary',
      toiletries: 'secondary',
      documents: 'accent',
      electronics: 'success',
      accessories: 'warning',
      medications: 'error',
      other: 'default'
    }
    return colors[category] || 'default'
  }
  
  const packedCount = items.filter(item => item.packed).length
  const totalCount = items.length
  const progressPercentage = totalCount > 0 ? (packedCount / totalCount) * 100 : 0
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden"
    >
      {/* Category Header */}
      <div className="p-4 border-b border-surface-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              getCategoryColor(category) === 'primary' ? 'bg-primary/10' :
              getCategoryColor(category) === 'secondary' ? 'bg-secondary/10' :
              getCategoryColor(category) === 'accent' ? 'bg-accent/10' :
              getCategoryColor(category) === 'success' ? 'bg-success/10' :
              getCategoryColor(category) === 'warning' ? 'bg-warning/10' :
              getCategoryColor(category) === 'error' ? 'bg-error/10' :
              'bg-surface-100'
            }`}>
              <ApperIcon 
                name={getCategoryIcon(category)} 
                className={`w-5 h-5 ${
                  getCategoryColor(category) === 'primary' ? 'text-primary' :
                  getCategoryColor(category) === 'secondary' ? 'text-secondary' :
                  getCategoryColor(category) === 'accent' ? 'text-accent' :
                  getCategoryColor(category) === 'success' ? 'text-success' :
                  getCategoryColor(category) === 'warning' ? 'text-warning' :
                  getCategoryColor(category) === 'error' ? 'text-error' :
                  'text-surface-600'
                }`} 
              />
            </div>
            
            <div>
              <h3 className="font-display font-semibold text-gray-900 capitalize">
                {category}
              </h3>
              <p className="text-sm text-gray-600">
                {packedCount} of {totalCount} packed
              </p>
            </div>
          </div>
          
          <button
            onClick={() => onAddItem(category)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-2 rounded-full ${
                getCategoryColor(category) === 'primary' ? 'bg-primary' :
                getCategoryColor(category) === 'secondary' ? 'bg-secondary' :
                getCategoryColor(category) === 'accent' ? 'bg-accent' :
                getCategoryColor(category) === 'success' ? 'bg-success' :
                getCategoryColor(category) === 'warning' ? 'bg-warning' :
                getCategoryColor(category) === 'error' ? 'bg-error' :
                'bg-surface-500'
              }`}
            />
          </div>
        </div>
      </div>
      
      {/* Items List */}
      <div className="p-4 space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Package" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No items in this category</p>
            <button
              onClick={() => onAddItem(category)}
              className="mt-2 text-sm text-primary hover:text-primary/80 font-medium"
            >
              Add your first item
            </button>
          </div>
        ) : (
          items.map((item, index) => (
            <PackingItem
              key={item.id}
              item={item}
              onToggle={onToggleItem}
              onDelete={onDeleteItem}
              delay={index * 0.05}
            />
          ))
        )}
      </div>
    </motion.div>
  )
}

export default PackingCategory