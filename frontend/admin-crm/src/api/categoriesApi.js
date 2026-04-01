import { apiClient } from './client'

export const categoriesApi = {
  async list () {
    const { data } = await apiClient.get('/categories')
    return data
  },
  async create (payload) {
    const { data } = await apiClient.post('/categories', payload)
    return data
  }
}
