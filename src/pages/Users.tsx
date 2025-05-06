import {useState, useEffect} from 'react'
import {
	Button,
	Card,
	Table,
	Modal,
	Form,
	Input,
	message,
	Space,
	Popconfirm,
} from 'antd'
import {PlusOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import {userService} from '../services'
import type {UserRequest, UserResponse} from '../types/api'

export const Users = () => {
	const [users, setUsers] = useState<UserResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [editingUser, setEditingUser] = useState<UserResponse | null>(null)
	const [form] = Form.useForm()

	useEffect(() => {
		fetchUsers()
	}, [])

	const fetchUsers = async () => {
		try {
			setLoading(true)
			const data = await userService.getAll()
			setUsers(data)
		} catch (error) {
			message.error('Failed to fetch users')
		} finally {
			setLoading(false)
		}
	}

	const handleCreate = async (values: UserRequest) => {
		try {
			await userService.create(values)
			message.success('User created successfully')
			setModalVisible(false)
			form.resetFields()
			fetchUsers()
		} catch (error) {
			message.error('Failed to create user')
		}
	}

	const handleUpdate = async (values: UserRequest) => {
		if (!editingUser) return
		try {
			await userService.update(editingUser.id, values)
			message.success('User updated successfully')
			setModalVisible(false)
			setEditingUser(null)
			form.resetFields()
			fetchUsers()
		} catch (error) {
			message.error('Failed to update user')
		}
	}

	const handleDelete = async (id: number) => {
		try {
			await userService.delete(id)
			message.success('User deleted successfully')
			fetchUsers()
		} catch (error) {
			message.error('Failed to delete user')
		}
	}

	const columns = [
		{
			title: 'Username',
			dataIndex: 'username',
			key: 'username',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Display Name',
			dataIndex: 'displayName',
			key: 'displayName',
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: any, record: UserResponse) => (
				<Space>
					<Button
						type='primary'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingUser(record)
							form.setFieldsValue(record)
							setModalVisible(true)
						}}
					>
						Edit
					</Button>
					<Popconfirm
						title='Are you sure you want to delete this user?'
						onConfirm={() => handleDelete(record.id)}
						okText='Yes'
						cancelText='No'
					>
						<Button type='primary' danger icon={<DeleteOutlined />}>
							Delete
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	]

	return (
		<div>
			<Card
				title='Users'
				extra={
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingUser(null)
							form.resetFields()
							setModalVisible(true)
						}}
					>
						Add User
					</Button>
				}
			>
				<Table
					columns={columns}
					dataSource={users}
					loading={loading}
					rowKey='id'
					pagination={{pageSize: 10}}
				/>
			</Card>

			<Modal
				title={editingUser ? 'Edit User' : 'Add User'}
				open={modalVisible}
				onCancel={() => {
					setModalVisible(false)
					setEditingUser(null)
					form.resetFields()
				}}
				footer={null}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={editingUser ? handleUpdate : handleCreate}
				>
					<Form.Item
						name='username'
						label='Username'
						rules={[{required: true, message: 'Please input username!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='email'
						label='Email'
						rules={[
							{required: true, message: 'Please input email!'},
							{type: 'email', message: 'Please input a valid email!'},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='password'
						label='Password'
						rules={[
							{required: !editingUser, message: 'Please input password!'},
							{min: 6, message: 'Password must be at least 6 characters!'},
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item name='displayName' label='Display Name'>
						<Input />
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit'>
							{editingUser ? 'Update' : 'Create'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
