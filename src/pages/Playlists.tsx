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
	Switch,
} from 'antd'
import {PlusOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import {playlistService} from '../services'
import type {PlaylistRequest, PlaylistResponse} from '../types/api'

export const Playlists = () => {
	const [playlists, setPlaylists] = useState<PlaylistResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [editingPlaylist, setEditingPlaylist] =
		useState<PlaylistResponse | null>(null)
	const [form] = Form.useForm()

	useEffect(() => {
		fetchPlaylists()
	}, [])

	const fetchPlaylists = async () => {
		try {
			setLoading(true)
			const data = await playlistService.getAll()
			setPlaylists(data)
		} catch (error) {
			message.error('Failed to fetch playlists')
		} finally {
			setLoading(false)
		}
	}

	const handleCreate = async (values: PlaylistRequest) => {
		try {
			await playlistService.create(values)
			message.success('Playlist created successfully')
			setModalVisible(false)
			form.resetFields()
			fetchPlaylists()
		} catch (error) {
			message.error('Failed to create playlist')
		}
	}

	const handleUpdate = async (values: PlaylistRequest) => {
		if (!editingPlaylist) return
		try {
			await playlistService.update(editingPlaylist.id, values)
			message.success('Playlist updated successfully')
			setModalVisible(false)
			setEditingPlaylist(null)
			form.resetFields()
			fetchPlaylists()
		} catch (error) {
			message.error('Failed to update playlist')
		}
	}

	const handleDelete = async (id: number) => {
		try {
			await playlistService.delete(id)
			message.success('Playlist deleted successfully')
			fetchPlaylists()
		} catch (error) {
			message.error('Failed to delete playlist')
		}
	}

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Public',
			dataIndex: 'isPublic',
			key: 'isPublic',
			render: (isPublic: boolean) => (isPublic ? 'Yes' : 'No'),
		},
		{
			title: 'Collaborative',
			dataIndex: 'collaborative',
			key: 'collaborative',
			render: (collaborative: boolean) => (collaborative ? 'Yes' : 'No'),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: any, record: PlaylistResponse) => (
				<Space>
					<Button
						type='primary'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingPlaylist(record)
							form.setFieldsValue(record)
							setModalVisible(true)
						}}
					>
						Edit
					</Button>
					<Popconfirm
						title='Are you sure you want to delete this playlist?'
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
				title='Playlists'
				extra={
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingPlaylist(null)
							form.resetFields()
							setModalVisible(true)
						}}
					>
						Add Playlist
					</Button>
				}
			>
				<Table
					columns={columns}
					dataSource={playlists}
					loading={loading}
					rowKey='id'
					pagination={{pageSize: 10}}
				/>
			</Card>

			<Modal
				title={editingPlaylist ? 'Edit Playlist' : 'Add Playlist'}
				open={modalVisible}
				onCancel={() => {
					setModalVisible(false)
					setEditingPlaylist(null)
					form.resetFields()
				}}
				footer={null}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={editingPlaylist ? handleUpdate : handleCreate}
				>
					<Form.Item
						name='name'
						label='Name'
						rules={[{required: true, message: 'Please input playlist name!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item name='description' label='Description'>
						<Input.TextArea />
					</Form.Item>

					<Form.Item name='imageUrl' label='Image URL'>
						<Input />
					</Form.Item>

					<Form.Item name='isPublic' label='Public' valuePropName='checked'>
						<Switch />
					</Form.Item>

					<Form.Item
						name='collaborative'
						label='Collaborative'
						valuePropName='checked'
					>
						<Switch />
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit'>
							{editingPlaylist ? 'Update' : 'Create'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
