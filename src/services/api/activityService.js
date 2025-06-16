import activitiesData from '../mockData/activities.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let activities = [...activitiesData]

const activityService = {
  async getAll() {
    await delay(300)
    return [...activities]
  },

  async getByTripId(tripId) {
    await delay(200)
    return activities.filter(a => a.tripId === tripId).map(a => ({ ...a }))
  },

  async getById(id) {
    await delay(200)
    const activity = activities.find(a => a.id === id)
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { ...activity }
  },

  async create(activityData) {
    await delay(400)
    const newActivity = {
      ...activityData,
      id: Date.now().toString()
    }
    activities.push(newActivity)
    return { ...newActivity }
  },

  async update(id, data) {
    await delay(300)
    const index = activities.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    activities[index] = { ...activities[index], ...data }
    return { ...activities[index] }
  },

  async delete(id) {
    await delay(250)
    const index = activities.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    activities.splice(index, 1)
    return true
  },

  async reorder(tripId, reorderedActivities) {
    await delay(300)
    // Remove old activities for this trip
    activities = activities.filter(a => a.tripId !== tripId)
    // Add reordered activities
    activities.push(...reorderedActivities)
    return reorderedActivities.map(a => ({ ...a }))
  }
}

export default activityService