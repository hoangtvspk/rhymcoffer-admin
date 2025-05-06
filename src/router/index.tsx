import {createBrowserRouter} from 'react-router-dom'
import {MainLayout} from '../layouts/MainLayout'
import {Login} from '../pages/Login'
import {ProtectedRoute} from '../components/ProtectedRoute'
import {Users} from '@/pages/Users'
import {Tracks} from '@/pages/Tracks'
import {Playlists} from '@/pages/Playlists'
import {Artists} from '@/pages/Artists'
import {Albums} from '@/pages/Albums'
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
		],
	},
])
