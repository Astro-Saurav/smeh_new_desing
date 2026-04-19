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
  async uploadImage ({ base64Data, fileName, mimeType }) {
    // Send JSON — strip the data URI prefix here to avoid corruption
    const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data
    const { data } = await apiClient.post('/upload', { base64Data: cleanBase64, fileName, mimeType })
    return data
  }
}