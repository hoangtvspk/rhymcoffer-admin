import type {
	ArtistRequest,
	ArtistResponse,
	BaseResponse,
	TrackResponse,
} from '../types/api'
import api from './api'

export const artistService = {
	getAll: async (): Promise<ArtistResponse[]> => {
		const response =
			await api.get<BaseResponse<ArtistResponse[]>>('/admin/artists')
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getById: async (id: number): Promise<ArtistResponse> => {
		const response = await api.get<BaseResponse<ArtistResponse>>(
			`/admin/artists/${id}`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	search: async (name: string): Promise<ArtistResponse[]> => {
		const response = await api.get<BaseResponse<ArtistResponse[]>>(
			'/admin/artists/search',
			{
				params: {name},
			}
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	create: async (data: ArtistRequest): Promise<ArtistResponse> => {
		const response = await api.post<BaseResponse<ArtistResponse>>(
			'/admin/artists',
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	update: async (id: number, data: ArtistRequest): Promise<ArtistResponse> => {
		const response = await api.put<BaseResponse<ArtistResponse>>(
			`/admin/artists/${id}`,
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	delete: async (id: number): Promise<void> => {
		const response = await api.delete<BaseResponse<null>>(
			`/admin/artists/${id}`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	getPopular: async (minPopularity?: number): Promise<ArtistResponse[]> => {
		const response = await api.get<BaseResponse<ArtistResponse[]>>(
			'/admin/artists/popular',
			{
				params: {minPopularity},
			}
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	follow: async (artistId: number): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/artists/${artistId}/follow`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	unfollow: async (artistId: number): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/artists/${artistId}/unfollow`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	addTracks: async (id: number, trackIds: number[]): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/artists/${id}/tracks`,
			trackIds
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	removeTracks: async (id: number, trackIds: number[]): Promise<void> => {
		const response = await api.delete<BaseResponse<null>>(
			`/admin/artists/${id}/tracks`,
			{data: trackIds}
		)
		if (!response.data.success) throw new Error(response.data.message)
	},
}
