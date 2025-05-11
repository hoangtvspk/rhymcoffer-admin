import {Layout, Menu} from 'antd'
import {Link, useLocation, Outlet} from 'react-router-dom'
import {
	UserOutlined,
	PlayCircleOutlined,
	PlaySquareOutlined,
	TeamOutlined,
	AppstoreOutlined,
	LogoutOutlined,
} from '@ant-design/icons'
import {useAuthStore} from '../store/auth'

const {Header, Sider, Content} = Layout

export const MainLayout: React.FC = () => {
	const location = useLocation()
	const {logout} = useAuthStore()

	const menuItems = [
		{
			key: '/users',
			icon: <UserOutlined />,
			label: <Link to='/users'>Users</Link>,
		},
		{
			key: '/tracks',
			icon: <PlayCircleOutlined />,
			label: <Link to='/tracks'>Tracks</Link>,
		},
		{
			key: '/playlists',
			icon: <PlaySquareOutlined />,
			label: <Link to='/playlists'>Playlists</Link>,
		},
		{
			key: '/artists',
			icon: <TeamOutlined />,
			label: <Link to='/artists'>Artists</Link>,
		},
		{
			key: '/albums',
			icon: <AppstoreOutlined />,
			label: <Link to='/albums'>Albums</Link>,
		},
	]

	return (
		<Layout className='h-[100dvh] overflow-hidden'>
			<Sider width={200} className='!bg-white'>
				<div className='h-16 flex items-center justify-center'>
					<h1 className='text-xl font-bold'>Rhymcoffer Admin</h1>
				</div>
				<Menu
					mode='inline'
					selectedKeys={[location.pathname]}
					items={menuItems}
					className='border-r-0 bg-white'
				/>
			</Sider>
			<Layout className='h-full overflow-hidden'>
				<Header className='!bg-white flex items-center justify-between px-6'>
					<div className='text-lg font-semibold'>
						{menuItems.find((item) => item.key === location.pathname)?.label}
					</div>
					<div className='flex items-center gap-4'>
						<button
							onClick={logout}
							className='flex items-center gap-2 text-red-500 hover:text-red-600'
						>
							<LogoutOutlined />
							<span>Logout</span>
						</button>
					</div>
				</Header>
				<Content className='p-6 bg-gray-50 h-full flex flex-col overflow-auto'>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	)
}
