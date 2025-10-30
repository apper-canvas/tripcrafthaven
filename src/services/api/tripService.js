import { toast } from 'react-toastify'

const tripService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "destination"}},
          {"field": {"Name": "start_date"}},
          {"field": {"Name": "end_date"}},
          {"field": {"Name": "cover_image"}},
          {"field": {"Name": "created_at"}}
        ]
      }
      
      const response = await apperClient.fetchRecords('trip', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching trips:", error)
      throw error
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "destination"}},
          {"field": {"Name": "start_date"}},
          {"field": {"Name": "end_date"}},
          {"field": {"Name": "cover_image"}},
          {"field": {"Name": "created_at"}}
        ]
      }
      
      const response = await apperClient.getRecordById('trip', id, params)
      
if (!response.success) {
        console.error(response.message)
        // Check if this is a "record not found" error
        if (response.message && response.message.toLowerCase().includes('record does not exist')) {
          throw new Error(`Trip with ID ${id} was not found. It may have been deleted or you may not have permission to access it.`)
        }
        throw new Error(response.message)
      }
      
      // Additional check for empty response data
      if (!response.data) {
        throw new Error(`Trip with ID ${id} was not found or returned empty data.`)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching trip with ID ${id}:`, error)
      // Re-throw with preserved error message for UI components
      throw error
    }
  },

// Validation utility functions
  validateFieldLengths(data, isUpdate = false) {
    const fieldLimits = {
      name: 255,
      destination: 255,
      cover_image: 255
    }
    
    const errors = []
    
    for (const [field, limit] of Object.entries(fieldLimits)) {
      const value = data[field]
      if (value !== undefined && value !== null && typeof value === 'string' && value.length > limit) {
        errors.push(`Field '${field}' exceeds maximum length of ${limit} characters (current: ${value.length})`)
      }
    }
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join('; ')}`)
    }
  },

  shortenUrl(url) {
    if (!url || typeof url !== 'string') return url
    
    // If URL is within limit, return as-is
    if (url.length <= 255) return url
    
    // Try to extract domain and path for a shorter version
    try {
      const urlObj = new URL(url)
      const shortened = `${urlObj.origin}${urlObj.pathname}`
      
      if (shortened.length <= 255) {
        return shortened
      }
      
      // If still too long, use domain only
      if (urlObj.origin.length <= 255) {
        return urlObj.origin
      }
    } catch (e) {
      // Invalid URL, fall back to placeholder
    }
    
    // Final fallback to a placeholder image URL
    return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400'
  },

  async create(tripData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Validate field lengths before processing
      const validationData = {
        name: tripData.name,
        destination: tripData.destination,
        cover_image: tripData.coverImage
      }
      
      this.validateFieldLengths(validationData)
      
      // Process cover_image URL if needed
      const processedCoverImage = this.shortenUrl(tripData.coverImage)
      
      const params = {
        records: [{
          Name: tripData.name,
          destination: tripData.destination,
          start_date: tripData.startDate,
          end_date: tripData.endDate,
          cover_image: processedCoverImage,
          created_at: new Date().toISOString()
        }]
      }
      
      const response = await apperClient.createRecord('trip', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create trip:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to create trip')
        }
        
        return response.results[0].data
      }
      
      throw new Error('No results returned')
    } catch (error) {
      console.error("Error creating trip:", error)
      throw error
    }
  },

async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Validate field lengths for fields being updated
      const validationData = {
        name: data.name,
        destination: data.destination,
        cover_image: data.coverImage
      }
      
      this.validateFieldLengths(validationData, true)
      
      const updateData = {
        Id: parseInt(id)
      }
      
      if (data.name !== undefined) updateData.Name = data.name
      if (data.destination !== undefined) updateData.destination = data.destination
      if (data.startDate !== undefined) updateData.start_date = data.startDate
      if (data.endDate !== undefined) updateData.end_date = data.endDate
      if (data.coverImage !== undefined) {
        updateData.cover_image = this.shortenUrl(data.coverImage)
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('trip', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update trip:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to update trip')
        }
        
        return response.results[0].data
      }
      
      throw new Error('No results returned')
    } catch (error) {
      console.error("Error updating trip:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('trip', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete trip:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to delete trip')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      console.error("Error deleting trip:", error)
      throw error
    }
  }
}

export default tripService