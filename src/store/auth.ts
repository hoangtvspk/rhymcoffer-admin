import {create} from 'zustand'
import {authService} from '../services/api'
import type {
	AuthenticationRequest,
	AuthenticationResponse,
	RegisterRequest,
} from '../types/api'

interface AuthState {
	user: AuthenticationResponse | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
	login: (data: AuthenticationRequest) => Promise<void>
	register: (data: RegisterRequest) => Promise<void>
	logout: () => void
	clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,

	login: async (data: AuthenticationRequest) => {
		try {
			set({isLoading: true, error: null})
			const response = await authService.login(data)
			localStorage.setItem('token', response.token)
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
			localStorage.setItem('token', response.token)
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
		localStorage.removeItem('token')
		set({user: null, isAuthenticated: false})
	},

	clearError: () => {
		set({error: null})
	},
}))
