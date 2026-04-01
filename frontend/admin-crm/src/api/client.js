import axios from 'axios'

let accessToken = null
let refreshInFlight = null
let authApi = null

export function attachAuthApi (api) {
  authApi = api
}

export function setAccessToken (token) {
  accessToken = token
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
})

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest || originalRequest.__isRetryRequest) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && authApi?.refresh) {
      if (!refreshInFlight) {
        refreshInFlight = authApi.refresh()
          .finally(() => {
            refreshInFlight = null
          })
      }

      try {
        await refreshInFlight
        originalRequest.__isRetryRequest = true

        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        return await apiClient.request(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
