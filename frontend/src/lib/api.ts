import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post((import.meta.env.VITE_API_URL || '/api') + '/auth/token/refresh/', {
            refresh: refreshToken,
          })
          const { access } = response.data
          localStorage.setItem('access_token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth
export const authAPI = {
  register: (data: any) => api.post('/auth/register/', data),
  login: (data: any) => api.post('/auth/login/', data),
  logout: (refresh: string) => api.post('/auth/logout/', { refresh }),
  me: () => api.get('/auth/me/'),
  updateProfile: (data: any) => api.patch('/auth/profile/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data: any) => api.put('/auth/change-password/', data),
}

// Tutors
export const tutorsAPI = {
  list: (params?: any) => api.get('/tutors/', { params }),
  get: (id: number) => api.get(`/tutors/${id}/`),
  myProfile: () => api.get('/tutors/my-profile/'),
  saveProfile: (data: any) => api.post('/tutors/my-profile/', data),
  getSubjects: () => api.get('/tutors/subjects/'),
  getCities: () => api.get('/tutors/cities/'),
  getReviews: (tutorId: number) => api.get(`/tutors/${tutorId}/reviews/`),
  addReview: (tutorId: number, data: any) => api.post(`/tutors/${tutorId}/reviews/`, data),
  getAvailability: () => api.get('/tutors/my-availability/'),
  addAvailability: (data: any) => api.post('/tutors/my-availability/', data),
}

// Bookings
export const bookingsAPI = {
  list: () => api.get('/bookings/'),
  create: (data: any) => api.post('/bookings/', data),
  get: (id: number) => api.get(`/bookings/${id}/`),
  updateStatus: (id: number, data: any) => api.post(`/bookings/${id}/status/`, data),
  getSlots: (tutorId: number, date: string) =>
    api.get(`/bookings/tutor/${tutorId}/slots/`, { params: { date } }),
}

// Messaging
export const messagingAPI = {
  getConversations: () => api.get('/messages/conversations/'),
  startConversation: (userId: number) =>
    api.post('/messages/conversations/start/', { user_id: userId }),
  getMessages: (convId: number) => api.get(`/messages/conversations/${convId}/messages/`),
  sendMessage: (convId: number, content: string) =>
    api.post(`/messages/conversations/${convId}/messages/`, { content }),
}

export default api
