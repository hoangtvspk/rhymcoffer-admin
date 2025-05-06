import {RouterProvider} from 'react-router-dom'
import {router} from './router'
import AppProvider from './providers/AppProvider'
import './i18n/i18n'
import {useEffect} from 'react'
import {useAuthStore} from './store/auth'

function App() {
	useEffect(() => {
		useAuthStore.getState().checkAuth()
	}, [])

	return (
		<AppProvider>
			<RouterProvider router={router} />
		</AppProvider>
	)
}

export default App
