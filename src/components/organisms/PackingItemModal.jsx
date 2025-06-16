import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { packingService } from '@/services'

const PackingItemModal = ({ isOpen, onClose, tripId, category, onItemSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '1',
    category: category || 'other'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        quantity: '1',
        category: category || 'other'
      })
      setErrors({})
    }
  }, [isOpen, category])

  const categories = [
    { value: 'clothing', label: 'Clothing', icon: 'Shirt' },
    { value: 'toiletries', label: 'Toiletries', icon: 'Droplets' },
    { value: 'documents', label: 'Documents', icon: 'FileText' },
    { value: 'electronics', label: 'Electronics', icon: 'Smartphone' },
    { value: 'accessories', label: 'Accessories', icon: 'Watch' },
    { value: 'medications', label: 'Medications', icon: 'Pill' },
    { value: 'other', label: 'Other', icon: 'Package' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Item name is required'
    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      newErrors.quantity = 'Quantity must be at least 1'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const itemData = {
        ...formData,
        tripId,
        quantity: parseInt(formData.quantity)
      }
      
      const savedItem = await packingService.create(itemData)
      toast.success('Packing item added successfully!')
      onItemSaved(savedItem)
      onClose()
    } catch (error) {
      toast.error('Failed to add packing item')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setErrors({})
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-surface-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <ApperIcon name="Plus" className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-display font-semibold text-gray-900">
                    Add Packing Item
                  </h2>
                </div>
                
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                          formData.category === cat.value
                            ? 'border-accent bg-accent/5 text-accent'
                            : 'border-surface-200 hover:border-surface-300 text-gray-600'
                        }`}
                      >
                        <ApperIcon name={cat.icon} className="w-4 h-4" />
                        <span className="text-sm font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <Input
                  label="Item Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="e.g., T-shirts"
                  icon="Package"
                />
                
                <Input
                  label="Quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  error={errors.quantity}
                  icon="Hash"
                />
                
                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="gradient"
                    loading={loading}
                    icon="Plus"
                  >
                    Add Item
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PackingItemModal