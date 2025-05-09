import {createBrowserRouter} from 'react-router-dom'
import {MainLayout} from '../layouts/MainLayout'
import {Login} from '../pages/Auth/Login'
import {ProtectedRoute} from '../components/ProtectedRoute'
import {Users} from '@/pages/Users/Users'
import {Tracks} from '@/pages/Tracks/Tracks'
import {Playlists} from '@/pages/Playlists/Playlists'
import {Artists} from '@/pages/Artists/Artists'
import {Albums} from '@/pages/Albums/Albums'
import {EditAlbum} from '@/pages/Albums/EditAlbum'
import {AddTrackToAlbum} from '@/pages/AddTrackToAlbum'

export const router = createBrowserRouter([
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<MainLayout />
			</ProtectedRoute>
		),
		children: [
			{
				path: 'users',
				element: (
					<ProtectedRoute>
						<Users />
					</ProtectedRoute>
				),
			},
			{
				path: 'tracks',
				element: (
					<ProtectedRoute>
						<Tracks />
					</ProtectedRoute>
				),
			},
			{
				path: 'playlists',
				element: (
					<ProtectedRoute>
						<Playlists />
					</ProtectedRoute>
				),
			},
			{
				path: 'artists',
				element: (
					<ProtectedRoute>
						<Artists />
					</ProtectedRoute>
				),
			},
			{
				path: 'albums',
				element: (
					<ProtectedRoute>
						<Albums />
					</ProtectedRoute>
				),
			},
			{
				path: 'albums/:id',
				element: (
					<ProtectedRoute>
						<EditAlbum />
					</ProtectedRoute>
				),
			},
			{
				path: 'albums/:id/add-track',
				element: (
					<ProtectedRoute>
						<AddTrackToAlbum />
					</ProtectedRoute>
				),
			},
		],
	},
])
