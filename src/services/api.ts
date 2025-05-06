import axios from 'axios'
import {useAuthStore} from '../store/auth'
import Cookies from 'js-cookie'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
	const token = Cookies.get('auth_token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Handle response errors and token expiration
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token expired or invalid
			useAuthStore.getState().logout()
		}
		return Promise.reject(error)
	}
)

export default api
