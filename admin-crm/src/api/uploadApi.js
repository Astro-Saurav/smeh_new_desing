import { apiClient } from './client'

export const uploadApi = {
  async uploadImage (payload) {
    const { data } = await apiClient.post('/upload', payload)
    return data
  }
}
