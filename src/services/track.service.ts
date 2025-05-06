import type {TrackRequest, TrackResponse, BaseResponse} from '../types/api'
import api from './api'

export const trackService = {
	getAll: async (): Promise<TrackResponse[]> => {
		const response =
			await api.get<BaseResponse<TrackResponse[]>>('/admin/tracks')
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getById: async (id: number): Promise<TrackResponse> => {
		const response = await api.get<BaseResponse<TrackResponse>>(
			`/admin/tracks/${id}`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	search: async (name: string): Promise<TrackResponse[]> => {
		const response = await api.get<BaseResponse<TrackResponse[]>>(
			'/admin/tracks/search',
			{
				params: {name},
			}
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	create: async (data: TrackRequest): Promise<TrackResponse> => {
		const response = await api.post<BaseResponse<TrackResponse>>(
			'/admin/tracks',
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	update: async (id: number, data: TrackRequest): Promise<TrackResponse> => {
		const response = await api.put<BaseResponse<TrackResponse>>(
			`/admin/tracks/${id}`,
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	delete: async (id: number): Promise<void> => {
		const response = await api.delete<BaseResponse<null>>(`/admin/tracks/${id}`)
		if (!response.data.success) throw new Error(response.data.message)
	},

	getSaved: async (): Promise<TrackResponse[]> => {
		const response = await api.get<BaseResponse<TrackResponse[]>>(
			'/admin/tracks/saved'
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getPopular: async (minPopularity?: number): Promise<TrackResponse[]> => {
		const response = await api.get<BaseResponse<TrackResponse[]>>(
			'/admin/tracks/popular',
			{
				params: {minPopularity},
			}
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getByArtist: async (artistId: number): Promise<TrackResponse[]> => {
		const response = await api.get<BaseResponse<TrackResponse[]>>(
			`/admin/tracks/artist/${artistId}`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getByAlbum: async (albumId: number): Promise<TrackResponse[]> => {
		const response = await api.get<BaseResponse<TrackResponse[]>>(
			`/admin/tracks/album/${albumId}`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	save: async (trackId: number): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/tracks/${trackId}/save`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	unsave: async (trackId: number): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/tracks/${trackId}/unsave`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},
}
