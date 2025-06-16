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
        Fields: ['Name', 'destination', 'start_date', 'end_date', 'cover_image', 'created_at']
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
        fields: ['Name', 'destination', 'start_date', 'end_date', 'cover_image', 'created_at']
      }
      
      const response = await apperClient.getRecordById('trip', id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching trip with ID ${id}:`, error)
      throw error
    }
  },

  async create(tripData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: tripData.name,
          destination: tripData.destination,
          start_date: tripData.startDate,
          end_date: tripData.endDate,
          cover_image: tripData.coverImage,
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
      
      const updateData = {
        Id: parseInt(id)
      }
      
      if (data.name !== undefined) updateData.Name = data.name
      if (data.destination !== undefined) updateData.destination = data.destination
      if (data.startDate !== undefined) updateData.start_date = data.startDate
      if (data.endDate !== undefined) updateData.end_date = data.endDate
      if (data.coverImage !== undefined) updateData.cover_image = data.coverImage
      
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