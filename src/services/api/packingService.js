import { toast } from 'react-toastify'

const packingService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        Fields: ['Name', 'trip_id', 'category', 'quantity', 'packed']
      }
      
      const response = await apperClient.fetchRecords('packing_item', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching packing items:", error)
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
        Fields: ['Name', 'trip_id', 'category', 'quantity', 'packed'],
        where: [{
          FieldName: 'trip_id',
          Operator: 'ExactMatch',
          Values: [parseInt(tripId)]
        }]
      }
      
      const response = await apperClient.fetchRecords('packing_item', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching packing items for trip:", error)
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
        fields: ['Name', 'trip_id', 'category', 'quantity', 'packed']
      }
      
      const response = await apperClient.getRecordById('packing_item', id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching packing item with ID ${id}:`, error)
      throw error
    }
  },

  async create(itemData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [{
          Name: itemData.name,
          trip_id: parseInt(itemData.tripId),
          category: itemData.category,
          quantity: itemData.quantity,
          packed: false
        }]
      }
      
      const response = await apperClient.createRecord('packing_item', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create packing item:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to create packing item')
        }
        
        return response.results[0].data
      }
      
      throw new Error('No results returned')
    } catch (error) {
      console.error("Error creating packing item:", error)
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
      if (data.tripId !== undefined) updateData.trip_id = parseInt(data.tripId)
      if (data.category !== undefined) updateData.category = data.category
      if (data.quantity !== undefined) updateData.quantity = data.quantity
      if (data.packed !== undefined) updateData.packed = data.packed
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('packing_item', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update packing item:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to update packing item')
        }
        
        return response.results[0].data
      }
      
      throw new Error('No results returned')
    } catch (error) {
      console.error("Error updating packing item:", error)
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
      
      const response = await apperClient.deleteRecord('packing_item', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete packing item:${JSON.stringify(failedRecords)}`)
          throw new Error('Failed to delete packing item')
        }
        
        return true
      }
      
      return true
    } catch (error) {
      console.error("Error deleting packing item:", error)
      throw error
    }
  },

  async togglePacked(id) {
    try {
      // First get the current item
      const currentItem = await this.getById(id)
      
      // Update with toggled packed status
      return await this.update(id, { packed: !currentItem.packed })
    } catch (error) {
      console.error("Error toggling packed status:", error)
      throw error
    }
  }
}

export default packingService