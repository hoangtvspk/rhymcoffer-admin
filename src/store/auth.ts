import {create} from 'zustand'
import type {
	AuthenticationRequest,
	AuthenticationResponse,
	RegisterRequest,
} from '../types/api'
import Cookies from 'js-cookie'
import {authService} from '@/services'

interface AuthState {
	user: AuthenticationResponse | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
	login: (data: AuthenticationRequest) => Promise<void>
	register: (data: RegisterRequest) => Promise<void>
	logout: () => void
	clearError: () => void
	checkAuth: () => void
}

const isTokenExpired = (token: string): boolean => {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]))
		return payload.exp * 1000 < Date.now()
	} catch {
		return true
	}
}

const setAuthCookie = (token: string) => {
	// Set cookie with secure flags
	Cookies.set('auth_token', token, {
		expires: 7, // 7 days
		secure: true, // Only sent over HTTPS
		sameSite: 'strict', // Protect against CSRF
		path: '/', // Available across the site
	})
}

const removeAuthCookie = () => {
	Cookies.remove('auth_token', {
		secure: true,
		sameSite: 'strict',
		path: '/',
	})
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: Cookies.get('auth_token') ? true : false,
	isLoading: false,
	error: null,

	login: async (data: AuthenticationRequest) => {
		try {
			set({isLoading: true, error: null})
			const response = await authService.login(data)
			console.log(response.accessToken)
			setAuthCookie(response.accessToken)
			set({user: response, isAuthenticated: true, isLoading: false})
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'An error occurred during login',
				isLoading: false,
			})
		}
	},

	register: async (data: RegisterRequest) => {
		try {
			set({isLoading: true, error: null})
			const response = await authService.register(data)
			setAuthCookie(response.accessToken)
			set({user: response, isAuthenticated: true, isLoading: false})
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'An error occurred during registration',
				isLoading: false,
			})
		}
	},

	logout: () => {
		removeAuthCookie()
		set({user: null, isAuthenticated: false})
	},

	clearError: () => {
		set({error: null})
	},

	checkAuth: () => {
		const token = Cookies.get('auth_token')
		if (!token || isTokenExpired(token)) {
			console.log('Token expired or invalid')
			removeAuthCookie()
			set({user: null, isAuthenticated: false})
			return false
		}
		return true
	},
}))
