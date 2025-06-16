import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import PackingCategory from '@/components/molecules/PackingCategory'
import EmptyState from '@/components/molecules/EmptyState'
import LoadingState from '@/components/molecules/LoadingState'
import PackingItemModal from '@/components/organisms/PackingItemModal'
import { tripService, packingService } from '@/services'

const Packing = () => {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [packingItems, setPackingItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    if (tripId) {
      loadTripData()
    }
  }, [tripId])

  const loadTripData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tripData, packingData] = await Promise.all([
        tripService.getById(tripId),
        packingService.getByTripId(tripId)
      ])
      setTrip(tripData)
      setPackingItems(packingData)
    } catch (err) {
      setError(err.message || 'Failed to load packing data')
      toast.error('Failed to load packing data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleItem = async (itemId) => {
    try {
      const updatedItem = await packingService.togglePacked(itemId)
      setPackingItems(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ))
      
      if (updatedItem.packed) {
        toast.success('Item packed! ✅')
      } else {
        toast.info('Item unpacked')
      }
    } catch (error) {
      toast.error('Failed to update item')
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    
    try {
      await packingService.delete(itemId)
      setPackingItems(prev => prev.filter(item => item.id !== itemId))
      toast.success('Item deleted successfully')
    } catch (error) {
      toast.error('Failed to delete item')
    }
  }

  const handleAddItem = (category) => {
    setSelectedCategory(category)
    setIsItemModalOpen(true)
  }

  const handleItemSaved = (savedItem) => {
    setPackingItems(prev => [...prev, savedItem])
    setSelectedCategory('')
  }

  const handleCloseModal = () => {
    setIsItemModalOpen(false)
    setSelectedCategory('')
  }

  const groupItemsByCategory = () => {
    const grouped = {}
    
    packingItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    
    return grouped
  }

  const getPackingStats = () => {
    const totalItems = packingItems.length
    const packedItems = packingItems.filter(item => item.packed).length
    const progress = totalItems > 0 ? (packedItems / totalItems) * 100 : 0
    
    return { totalItems, packedItems, progress }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-surface-200 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-5 bg-surface-200 rounded animate-pulse w-64"></div>
          </div>
          <LoadingState type="packing" count={4} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Packing List</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadTripData} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!trip) return null

  const groupedItems = groupItemsByCategory()
  const { totalItems, packedItems, progress } = getPackingStats()
  const hasItems = totalItems > 0

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Packing List
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
          
          <Button
            onClick={() => handleAddItem('other')}
            variant="gradient"
            size="lg"
            icon="Plus"
          >
            Add Item
          </Button>
        </div>

        {/* Progress Overview */}
        {hasItems && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-display font-semibold text-gray-900">
                  Packing Progress
                </h2>
                <p className="text-gray-600">
                  {packedItems} of {totalItems} items packed
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold gradient-travel bg-clip-text text-transparent">
                  {Math.round(progress)}%
                </div>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
            
            <div className="w-full bg-surface-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-3 rounded-full gradient-travel"
              />
            </div>
          </motion.div>
        )}

        {/* Packing Categories */}
        {!hasItems ? (
          <EmptyState
            icon="Package"
            title="No items in your packing list yet"
            description="Start organizing your packing by adding items to different categories. Stay organized and never forget anything important for your trip."
            actionLabel="Add First Item"
            onAction={() => handleAddItem('other')}
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PackingCategory
                  category={category}
                  items={items}
                  onToggleItem={handleToggleItem}
                  onDeleteItem={handleDeleteItem}
                  onAddItem={handleAddItem}
                />
              </motion.div>
            ))}
            
            {/* Add Category Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <button
                onClick={() => handleAddItem('other')}
                className="inline-flex items-center px-6 py-3 border-2 border-dashed border-surface-300 rounded-xl text-gray-600 hover:border-primary hover:text-primary transition-all duration-200"
              >
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                Add more items
              </button>
            </motion.div>
          </div>
        )}

        {/* Packing Item Modal */}
        <PackingItemModal
          isOpen={isItemModalOpen}
          onClose={handleCloseModal}
          tripId={tripId}
          category={selectedCategory}
          onItemSaved={handleItemSaved}
        />
      </div>
    </div>
  )
}

export default Packing