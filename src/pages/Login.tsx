import {Button, Card, Form, Input, message} from 'antd'
import {useNavigate, useLocation} from 'react-router-dom'
import {useAuthStore} from '../store/auth'
import type {AuthenticationRequest} from '../types/api'

export const Login = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const {login, isLoading, error, clearError} = useAuthStore()

	const onFinish = async (values: AuthenticationRequest) => {
		try {
			await login(values)
			const from =
				(location.state as {from?: {pathname: string}})?.from?.pathname || '/'
			navigate(from, {replace: true})
		} catch (error) {
			message.error('Login failed. Please check your credentials.')
		}
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<Card className='w-full max-w-md'>
				<h1 className='text-2xl font-bold text-center mb-6'>
					Login to Rhymcoffer Admin
				</h1>
				<Form
					name='login'
					initialValues={{remember: true}}
					onFinish={onFinish}
					layout='vertical'
					size='large'
				>
					<Form.Item
						label='Username'
						name='username'
						rules={[{required: true, message: 'Please input your username!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label='Password'
						name='password'
						rules={[{required: true, message: 'Please input your password!'}]}
					>
						<Input.Password />
					</Form.Item>

					{error && (
						<div className='mb-4 text-red-500 text-center'>{error}</div>
					)}

					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							className='w-full'
							loading={isLoading}
						>
							Log in
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	)
}
