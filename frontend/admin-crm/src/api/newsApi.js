import { apiClient } from './client'

export const newsApi = {
  async list (params) {
    const { data } = await apiClient.get('/news', { params })
    return data
  },
  async create (payload) {
    const { data } = await apiClient.post('/news', payload)
    return data
  },
  async update (id, payload) {
    const { data } = await apiClient.put(`/news/${id}`, payload)
    return data
  },
  async remove (id) {
    await apiClient.delete(`/news/${id}`)
  },
  async uploadImage (formData) {
    // Send FormData for Multer to intercept
    const { data } = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  }
}