import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { activityService } from '@/services'

const ActivityModal = ({ isOpen, onClose, tripId, activity, onActivitySaved, availableDates }) => {
  const [formData, setFormData] = useState({
    type: 'sightseeing',
    title: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const isEditing = !!activity

  useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type,
        title: activity.title,
        date: activity.date,
        time: activity.time,
        duration: activity.duration.toString(),
        location: activity.location || '',
        notes: activity.notes || ''
      })
    } else {
      setFormData({
        type: 'sightseeing',
        title: '',
        date: availableDates?.[0] || '',
        time: '',
        duration: '',
        location: '',
        notes: ''
      })
    }
    setErrors({})
  }, [activity, availableDates, isOpen])

  const activityTypes = [
    { value: 'flight', label: 'Flight', icon: 'Plane' },
    { value: 'hotel', label: 'Hotel', icon: 'Building2' },
    { value: 'restaurant', label: 'Restaurant', icon: 'Utensils' },
    { value: 'sightseeing', label: 'Sightseeing', icon: 'Camera' },
    { value: 'transport', label: 'Transport', icon: 'Car' },
    { value: 'activity', label: 'Activity', icon: 'MapPin' }
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
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.time) newErrors.time = 'Time is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const activityData = {
        ...formData,
        tripId,
        duration: parseInt(formData.duration) || 0
      }
      
      let savedActivity
      if (isEditing) {
        savedActivity = await activityService.update(activity.id, activityData)
        toast.success('Activity updated successfully!')
      } else {
        savedActivity = await activityService.create(activityData)
        toast.success('Activity added successfully!')
      }
      
      onActivitySaved(savedActivity)
      onClose()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} activity`)
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
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-surface-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <ApperIcon name={isEditing ? "Edit2" : "Plus"} className="w-5 h-5 text-secondary" />
                  </div>
                  <h2 className="text-xl font-display font-semibold text-gray-900">
                    {isEditing ? 'Edit Activity' : 'Add Activity'}
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
                {/* Activity Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Activity Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {activityTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                          formData.type === type.value
                            ? 'border-secondary bg-secondary/5 text-secondary'
                            : 'border-surface-200 hover:border-surface-300 text-gray-600'
                        }`}
                      >
                        <ApperIcon name={type.icon} className="w-5 h-5" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  placeholder="e.g., Visit Senso-ji Temple"
                  icon="Type"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <select
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent ${
                        errors.date ? 'border-error focus:ring-error' : ''
                      }`}
                    >
                      <option value="">Select date</option>
                      {availableDates?.map(date => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                    {errors.date && (
                      <p className="text-sm text-error">{errors.date}</p>
                    )}
                  </div>
                  
                  <Input
                    label="Time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    error={errors.time}
                    icon="Clock"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Duration (minutes)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="60"
                    icon="Timer"
                  />
                  
                  <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Asakusa"
                    icon="MapPin"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent placeholder-gray-400"
                    placeholder="Additional notes or reminders..."
                  />
                </div>
                
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
                    icon={isEditing ? "Save" : "Plus"}
                  >
                    {isEditing ? 'Update Activity' : 'Add Activity'}
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

export default ActivityModal