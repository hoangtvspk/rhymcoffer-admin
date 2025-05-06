import axios from 'axios'
import type {
	UserRequest,
	UserResponse,
	TrackRequest,
	TrackResponse,
	PlaylistRequest,
	PlaylistResponse,
	ArtistRequest,
	ArtistResponse,
	AlbumRequest,
	AlbumResponse,
	AuthenticationRequest,
	AuthenticationResponse,
	RegisterRequest,
	BaseResponse,
} from '../types/api'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}` // No 'Bearer ' prefix
	}
	return config
})

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
}

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
