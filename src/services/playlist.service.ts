import type {
	PlaylistRequest,
	PlaylistResponse,
	BaseResponse,
} from '../types/api'
import api from './api'

export const playlistService = {
	getAll: async (): Promise<PlaylistResponse[]> => {
		const response =
			await api.get<BaseResponse<PlaylistResponse[]>>('/admin/playlists')
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getById: async (id: number): Promise<PlaylistResponse> => {
		const response = await api.get<BaseResponse<PlaylistResponse>>(
			`/admin/playlists/${id}`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	search: async (name: string): Promise<PlaylistResponse[]> => {
		const response = await api.get<BaseResponse<PlaylistResponse[]>>(
			'/admin/playlists/search',
			{
				params: {name},
			}
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	create: async (data: PlaylistRequest): Promise<PlaylistResponse> => {
		const response = await api.post<BaseResponse<PlaylistResponse>>(
			'/admin/playlists',
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	update: async (
		id: number,
		data: PlaylistRequest
	): Promise<PlaylistResponse> => {
		const response = await api.put<BaseResponse<PlaylistResponse>>(
			`/admin/playlists/${id}`,
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	delete: async (id: number): Promise<void> => {
		const response = await api.delete<BaseResponse<null>>(
			`/admin/playlists/${id}`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	getPublic: async (): Promise<PlaylistResponse[]> => {
		const response = await api.get<BaseResponse<PlaylistResponse[]>>(
			'/admin/playlists/public'
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getByOwner: async (): Promise<PlaylistResponse[]> => {
		const response = await api.get<BaseResponse<PlaylistResponse[]>>(
			'/admin/playlists/owner'
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getFollowed: async (): Promise<PlaylistResponse[]> => {
		const response = await api.get<BaseResponse<PlaylistResponse[]>>(
			'/admin/playlists/followed'
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getCollaborative: async (): Promise<PlaylistResponse[]> => {
		const response = await api.get<BaseResponse<PlaylistResponse[]>>(
			'/admin/playlists/collaborative'
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	follow: async (playlistId: number): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/playlists/${playlistId}/follow`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	unfollow: async (playlistId: number): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/playlists/${playlistId}/unfollow`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	addTrack: async (playlistId: number, trackId: number): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/playlists/${playlistId}/tracks/${trackId}`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	removeTrack: async (playlistId: number, trackId: number): Promise<void> => {
		const response = await api.delete<BaseResponse<null>>(
			`/admin/playlists/${playlistId}/tracks/${trackId}`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},
}
