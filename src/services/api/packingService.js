import packingData from '../mockData/packing.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let packingItems = [...packingData]

const packingService = {
  async getAll() {
    await delay(300)
    return [...packingItems]
  },

  async getByTripId(tripId) {
    await delay(200)
    return packingItems.filter(p => p.tripId === tripId).map(p => ({ ...p }))
  },

  async getById(id) {
    await delay(200)
    const item = packingItems.find(p => p.id === id)
    if (!item) {
      throw new Error('Packing item not found')
    }
    return { ...item }
  },

  async create(itemData) {
    await delay(400)
    const newItem = {
      ...itemData,
      id: Date.now().toString(),
      packed: false
    }
    packingItems.push(newItem)
    return { ...newItem }
  },

  async update(id, data) {
    await delay(300)
    const index = packingItems.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Packing item not found')
    }
    packingItems[index] = { ...packingItems[index], ...data }
    return { ...packingItems[index] }
  },

  async delete(id) {
    await delay(250)
    const index = packingItems.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Packing item not found')
    }
    packingItems.splice(index, 1)
    return true
  },

  async togglePacked(id) {
    await delay(200)
    const index = packingItems.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Packing item not found')
    }
    packingItems[index].packed = !packingItems[index].packed
    return { ...packingItems[index] }
  }
}

export default packingService