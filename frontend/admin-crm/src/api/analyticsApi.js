import { apiClient } from './client'

export const analyticsApi = {
  async overview () {
    const { data } = await apiClient.get('/analytics/overview')
    return data
  }
}
