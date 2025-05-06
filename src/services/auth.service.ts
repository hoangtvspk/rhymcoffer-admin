import type {
	AuthenticationRequest,
	AuthenticationResponse,
	RegisterRequest,
	BaseResponse,
} from '../types/api'
import api from './api'

export const authService = {
	login: async (
		data: AuthenticationRequest
	): Promise<AuthenticationResponse> => {
		const response = await api.post<BaseResponse<AuthenticationResponse>>(
			'/auth/login',
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	register: async (data: RegisterRequest): Promise<AuthenticationResponse> => {
		const response = await api.post<BaseResponse<AuthenticationResponse>>(
			'/auth/register',
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},
}
