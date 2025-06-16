import { motion } from 'framer-motion'

const LoadingState = ({ count = 3, type = 'card' }) => {
  const skeletonCards = Array.from({ length: count }, (_, i) => i)
  
  if (type === 'timeline') {
    return (
      <div className="space-y-6">
        {skeletonCards.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-surface-200"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-surface-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded animate-pulse w-1/2"></div>
                <div className="h-3 bg-surface-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
  
  if (type === 'packing') {
    return (
      <div className="space-y-6">
        {skeletonCards.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-surface-200"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-surface-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-200 rounded animate-pulse w-1/3"></div>
                <div className="h-3 bg-surface-200 rounded animate-pulse w-1/4"></div>
              </div>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-3 p-3">
                  <div className="w-5 h-5 bg-surface-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-surface-200 rounded animate-pulse flex-1"></div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
  
  // Default card type
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletonCards.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="h-48 bg-surface-200 animate-pulse"></div>
          <div className="p-6 space-y-3">
            <div className="h-4 bg-surface-200 rounded animate-pulse w-3/4"></div>
            <div className="h-3 bg-surface-200 rounded animate-pulse w-1/2"></div>
            <div className="h-10 bg-surface-200 rounded animate-pulse w-full mt-4"></div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default LoadingState