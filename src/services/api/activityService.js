import { toast } from 'react-toastify'

const activityService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'trip_id', 'type', 'title', 'date', 'time', 'duration', 'location', 'notes']
      }
      
      const response = await apperClient.fetchRecords('Activity1', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching activities:", error)
      throw error
    }
  },

  async getByTripId(tripId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'trip_id', 'type', 'title', 'date', 'time', 'duration', 'location', 'notes'],
        where: [{
          FieldName: 'trip_id',
          Operator: 'ExactMatch',
          Values: [parseInt(tripId)]
        }]
      }
      
      const response = await apperClient.fetchRecords('Activity1', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching activities for trip:", error)
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
        fields: ['Name', 'trip_id', 'type', 'title', 'date', 'time', 'duration', 'location', 'notes']
      }
      
      const response = await apperClient.getRecordById('Activity1', id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching activity with ID ${id}:`, error)
      throw error
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: activityData.title,
          trip_id: parseInt(activityData.tripId),
          type: activityData.type,
          title: activityData.title,
          date: activityData.date,
          time: activityData.time,
          duration: activityData.duration || 0,
          location: activityData.location || '',
          notes: activityData.notes || ''
        }]
      }
      
      const response = await apperClient.createRecord('Activity1', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create activity:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to create activity')
        }
        
        return response.results[0].data
      }
      
      throw new Error('No results returned')
    } catch (error) {
      console.error("Error creating activity:", error)
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
      
      if (data.title !== undefined) {
        updateData.Name = data.title
        updateData.title = data.title
      }
      if (data.tripId !== undefined) updateData.trip_id = parseInt(data.tripId)
      if (data.type !== undefined) updateData.type = data.type
      if (data.date !== undefined) updateData.date = data.date
      if (data.time !== undefined) updateData.time = data.time
      if (data.duration !== undefined) updateData.duration = data.duration
      if (data.location !== undefined) updateData.location = data.location
      if (data.notes !== undefined) updateData.notes = data.notes
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('Activity1', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update activity:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to update activity')
        }
        
        return response.results[0].data
      }
      
      throw new Error('No results returned')
    } catch (error) {
      console.error("Error updating activity:", error)
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
      
      const response = await apperClient.deleteRecord('Activity1', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete activity:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to delete activity')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      console.error("Error deleting activity:", error)
      throw error
    }
  },

  async reorder(tripId, reorderedActivities) {
    try {
      // For now, just return the reordered activities
      // More complex reordering logic could be implemented here
      return reorderedActivities
    } catch (error) {
      console.error("Error reordering activities:", error)
      throw error
    }
  }
}

export default activityService