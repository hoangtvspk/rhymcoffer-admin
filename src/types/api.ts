export interface UserRequest {
	username: string
	email: string
	password: string
	displayName?: string
	bio?: string
	imageUrl?: string
}

export interface UserResponse {
	id: number
	username: string
	email: string
	displayName?: string
	bio?: string
	imageUrl?: string
	playlistIds: number[]
	savedTrackIds: number[]
	savedAlbumIds: number[]
	followedArtistIds: number[]
	followerIds: number[]
	followingIds: number[]
	createdAt: string
	updatedAt: string
}

export interface TrackRequest {
	name: string
	imageUrl?: string
	durationMs?: number
	popularity?: number
	trackUrl?: string
	trackNumber?: string
	explicit?: boolean
	isrc?: string
	albumId?: number
	artistIds?: number[]
}

export interface TrackResponse {
	id: number
	name: string
	imageUrl?: string
	durationMs?: number
	popularity?: number
	trackUrl?: string
	trackNumber?: string
	explicit?: boolean
	isrc?: string
	albumId?: number
	artistIds: number[]
	playlistIds: number[]
	savedByUserIds: number[]
	createdAt: string
	updatedAt: string
}

export interface PlaylistRequest {
	name: string
	description?: string
	imageUrl?: string
	isPublic?: boolean
	collaborative?: boolean
	trackIds?: number[]
}

export interface PlaylistResponse {
	id: number
	name: string
	description?: string
	imageUrl?: string
	isPublic: boolean
	collaborative: boolean
	ownerId: number
	trackIds: number[]
	followerIds: number[]
	createdAt: string
	updatedAt: string
}

export interface ArtistRequest {
	name: string
	imageUrl?: string
	description?: string
	popularity?: number
}

export interface ArtistResponse {
	id: number
	name: string
	imageUrl?: string
	description?: string
	popularity?: number
	trackIds: number[]
	albumIds: number[]
	followerIds: number[]
	createdAt: string
	updatedAt: string
}

export interface AlbumRequest {
	name: string
	imageUrl?: string
	description?: string
	popularity?: number
	releaseDate?: string
	albumType?: string
	artistIds?: number[]
}

export interface AlbumResponse {
	id: number
	name: string
	imageUrl?: string
	description?: string
	popularity?: number
	releaseDate?: string
	albumType?: string
	artistIds: number[]
	trackIds: number[]
	followerIds: number[]
	createdAt: string
	updatedAt: string
}

export interface AuthenticationRequest {
	username: string
	password: string
}

export interface AuthenticationResponse {
	accessToken: string
	refreshToken: string
	username: string
	displayName?: string
	email: string
}

export interface RegisterRequest {
	username: string
	email: string
	password: string
	displayName?: string
	country?: string
}

export interface BaseResponse<T> {
	statusCode: number
	message: string
	data: T
	success: boolean
}
