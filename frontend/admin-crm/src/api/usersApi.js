import { apiClient } from './client'

export const usersApi = {
  async list () {
    const { data } = await apiClient.get('/users')
    return data
  },
  async remove (id) {
    await apiClient.delete(`/users/${id}`)
  }
}
