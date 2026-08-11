import { apiClient } from './client'

export const editorialApi = {
  async listRoles () {
    const { data } = await apiClient.get('/editorial')
    return data
  },
  async createRole (payload) {
    const { data } = await apiClient.post('/editorial/roles', payload)
    return data
  },
  async updateRole (id, payload) {
    const { data } = await apiClient.put(`/editorial/roles/${id}`, payload)
    return data
  },
  async removeRole (id) {
    const { data } = await apiClient.delete(`/editorial/roles/${id}`)
    return data
  },
  async createMember (payload) {
    const { data } = await apiClient.post('/editorial/members', payload)
    return data
  },
  async updateMember (id, payload) {
    const { data } = await apiClient.put(`/editorial/members/${id}`, payload)
    return data
  },
  async removeMember (id) {
    const { data } = await apiClient.delete(`/editorial/members/${id}`)
    return data
  }
}
