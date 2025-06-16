import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { tripService } from '@/services'

const CreateTripModal = ({ isOpen, onClose, onTripCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    coverImage: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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
    
    if (!formData.name.trim()) newErrors.name = 'Trip name is required'
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const tripData = {
        ...formData,
        coverImage: formData.coverImage || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`
      }
      
      const newTrip = await tripService.create(tripData)
      toast.success('Trip created successfully!')
      onTripCreated(newTrip)
      onClose()
      
      // Reset form
      setFormData({
        name: '',
        destination: '',
        startDate: '',
        endDate: '',
        coverImage: ''
      })
    } catch (error) {
      toast.error('Failed to create trip')
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
                  <div className="w-10 h-10 rounded-lg gradient-travel flex items-center justify-center">
                    <ApperIcon name="Plus" className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-display font-semibold text-gray-900">
                    Create New Trip
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
                <Input
                  label="Trip Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="e.g., Tokyo Adventure"
                  icon="MapPin"
                />
                
                <Input
                  label="Destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  error={errors.destination}
                  placeholder="e.g., Tokyo, Japan"
                  icon="Globe"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    error={errors.startDate}
                    icon="Calendar"
                  />
                  
                  <Input
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    error={errors.endDate}
                    icon="Calendar"
                  />
                </div>
                
                <Input
                  label="Cover Image URL (Optional)"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  icon="Camera"
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
                    Create Trip
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

export default CreateTripModal