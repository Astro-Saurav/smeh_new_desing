import { apiClient } from './client'

export const categoriesApi = {
  async list () {
    const { data } = await apiClient.get('/categories')
    return data
  },
  async remove (id) {
    const { data } = await apiClient.delete(`/categories/${id}`)
    return data
  },
  async create (payload) {
    const { data } = await apiClient.post('/categories', payload)
    return data
  }
}
