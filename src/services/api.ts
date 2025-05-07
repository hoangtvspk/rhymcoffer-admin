import axios from 'axios'
import {useAuthStore} from '../store/auth'
import Cookies from 'js-cookie'
import {authService} from './auth.service'

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

// Handle response errors and token expiration with refresh logic
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error)
		} else {
			prom.resolve(token)
		}
	})
	failedQueue = []
}

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise(function (resolve, reject) {
					failedQueue.push({resolve, reject})
				})
					.then(() => api(originalRequest))
					.catch((err) => Promise.reject(err))
			}

			originalRequest._retry = true
			isRefreshing = true

			try {
				await authService.refresh()
				processQueue(null)
				isRefreshing = false
				return api(originalRequest)
			} catch (err) {
				processQueue(err, null)
				isRefreshing = false
				useAuthStore.getState().logout()
				return Promise.reject(err)
			}
		}
		return Promise.reject(error)
	}
)

export default api
