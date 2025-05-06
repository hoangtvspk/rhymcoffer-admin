import type {UserRequest, UserResponse, BaseResponse} from '../types/api'
import api from './api'

export const userService = {
	getAll: async (): Promise<UserResponse[]> => {
		const response = await api.get<BaseResponse<UserResponse[]>>('/admin/users')
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getById: async (id: number): Promise<UserResponse> => {
		const response = await api.get<BaseResponse<UserResponse>>(
			`/admin/users/${id}`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getByUsername: async (username: string): Promise<UserResponse> => {
		const response = await api.get<BaseResponse<UserResponse>>(
			`/admin/users/username/${username}`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	search: async (query: string): Promise<UserResponse[]> => {
		const response = await api.get<BaseResponse<UserResponse[]>>(
			'/admin/users/search',
			{
				params: {query},
			}
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	create: async (data: UserRequest): Promise<UserResponse> => {
		const response = await api.post<BaseResponse<UserResponse>>(
			'/admin/users',
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	update: async (id: number, data: UserRequest): Promise<UserResponse> => {
		const response = await api.put<BaseResponse<UserResponse>>(
			`/admin/users/${id}`,
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	delete: async (id: number): Promise<void> => {
		const response = await api.delete<BaseResponse<null>>(`/admin/users/${id}`)
		if (!response.data.success) throw new Error(response.data.message)
	},

	getFollowers: async (id: number): Promise<UserResponse[]> => {
		const response = await api.get<BaseResponse<UserResponse[]>>(
			`/admin/users/${id}/followers`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getFollowing: async (id: number): Promise<UserResponse[]> => {
		const response = await api.get<BaseResponse<UserResponse[]>>(
			`/admin/users/${id}/following`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	follow: async (id: number): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/users/${id}/follow`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	unfollow: async (id: number): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/users/${id}/unfollow`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},
}
