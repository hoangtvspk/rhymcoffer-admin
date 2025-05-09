import type {
	AlbumRequest,
	AlbumResponse,
	TrackResponse,
	BaseResponse,
} from '../types/api'
import api from './api'

export const albumService = {
	getAll: async (): Promise<AlbumResponse[]> => {
		const response =
			await api.get<BaseResponse<AlbumResponse[]>>('/admin/albums')
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getById: async (id: number): Promise<AlbumResponse> => {
		const response = await api.get<BaseResponse<AlbumResponse>>(
			`/admin/albums/${id}`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	search: async (name: string): Promise<AlbumResponse[]> => {
		const response = await api.get<BaseResponse<AlbumResponse[]>>(
			'/admin/albums/search',
			{
				params: {name},
			}
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	create: async (data: AlbumRequest): Promise<AlbumResponse> => {
		const response = await api.post<BaseResponse<AlbumResponse>>(
			'/admin/albums',
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	update: async (id: number, data: AlbumRequest): Promise<AlbumResponse> => {
		const response = await api.put<BaseResponse<AlbumResponse>>(
			`/admin/albums/${id}`,
			data
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	delete: async (id: number): Promise<void> => {
		const response = await api.delete<BaseResponse<null>>(`/admin/albums/${id}`)
		if (!response.data.success) throw new Error(response.data.message)
	},

	getTracks: async (id: number): Promise<TrackResponse[]> => {
		const response = await api.get<BaseResponse<TrackResponse[]>>(
			`/admin/albums/${id}/tracks`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	addTracks: async (id: number, trackIds: number[]): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/albums/${id}/add-tracks`,
			trackIds
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	removeTracks: async (id: number, trackIds: number[]): Promise<void> => {
		const response = await api.delete<BaseResponse<null>>(
			`/admin/albums/${id}/tracks`,
			{data: trackIds}
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	getNewReleases: async (date: string): Promise<AlbumResponse[]> => {
		const response = await api.get<BaseResponse<AlbumResponse[]>>(
			'/admin/albums/new-releases',
			{
				params: {date},
			}
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	getByArtist: async (artistId: number): Promise<AlbumResponse[]> => {
		const response = await api.get<BaseResponse<AlbumResponse[]>>(
			`/admin/albums/artist/${artistId}`
		)
		if (!response.data.success) throw new Error(response.data.message)
		return response.data.data
	},

	save: async (albumId: number): Promise<void> => {
		const response = await api.post<BaseResponse<null>>(
			`/admin/albums/${albumId}/save`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},

	unsave: async (albumId: number): Promise<void> => {
		const response = await api.delete<BaseResponse<null>>(
			`/admin/albums/${albumId}/save`
		)
		if (!response.data.success) throw new Error(response.data.message)
	},
}
