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
	InputNumber,
	Select,
} from 'antd'
import {PlusOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import {artistService} from '../services/api'
import type {ArtistRequest, ArtistResponse} from '../types/api'

export const Artists = () => {
	const [artists, setArtists] = useState<ArtistResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [editingArtist, setEditingArtist] = useState<ArtistResponse | null>(
		null
	)
	const [form] = Form.useForm()

	useEffect(() => {
		fetchArtists()
	}, [])

	const fetchArtists = async () => {
		try {
			setLoading(true)
			const data = await artistService.getAll()
			setArtists(data)
		} catch (error) {
			message.error('Failed to fetch artists')
		} finally {
			setLoading(false)
		}
	}

	const handleCreate = async (values: ArtistRequest) => {
		try {
			await artistService.create(values)
			message.success('Artist created successfully')
			setModalVisible(false)
			form.resetFields()
			fetchArtists()
		} catch (error) {
			message.error('Failed to create artist')
		}
	}

	const handleUpdate = async (values: ArtistRequest) => {
		if (!editingArtist) return
		try {
			await artistService.update(editingArtist.id, values)
			message.success('Artist updated successfully')
			setModalVisible(false)
			setEditingArtist(null)
			form.resetFields()
			fetchArtists()
		} catch (error) {
			message.error('Failed to update artist')
		}
	}

	const handleDelete = async (id: number) => {
		try {
			await artistService.delete(id)
			message.success('Artist deleted successfully')
			fetchArtists()
		} catch (error) {
			message.error('Failed to delete artist')
		}
	}

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Popularity',
			dataIndex: 'popularity',
			key: 'popularity',
		},
		{
			title: 'Genres',
			dataIndex: 'genres',
			key: 'genres',
			render: (genres: string[]) => genres.join(', '),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: any, record: ArtistResponse) => (
				<Space>
					<Button
						type='primary'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingArtist(record)
							form.setFieldsValue(record)
							setModalVisible(true)
						}}
					>
						Edit
					</Button>
					<Popconfirm
						title='Are you sure you want to delete this artist?'
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
				title='Artists'
				extra={
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingArtist(null)
							form.resetFields()
							setModalVisible(true)
						}}
					>
						Add Artist
					</Button>
				}
			>
				<Table
					columns={columns}
					dataSource={artists}
					loading={loading}
					rowKey='id'
					pagination={{pageSize: 10}}
				/>
			</Card>

			<Modal
				title={editingArtist ? 'Edit Artist' : 'Add Artist'}
				open={modalVisible}
				onCancel={() => {
					setModalVisible(false)
					setEditingArtist(null)
					form.resetFields()
				}}
				footer={null}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={editingArtist ? handleUpdate : handleCreate}
				>
					<Form.Item
						name='name'
						label='Name'
						rules={[{required: true, message: 'Please input artist name!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item name='popularity' label='Popularity'>
						<InputNumber min={0} max={100} />
					</Form.Item>

					<Form.Item name='genres' label='Genres'>
						<Select
							mode='tags'
							style={{width: '100%'}}
							placeholder='Select genres'
							options={[]}
						/>
					</Form.Item>

					<Form.Item name='description' label='Description'>
						<Input.TextArea />
					</Form.Item>

					<Form.Item name='imageUrl' label='Image URL'>
						<Input />
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit'>
							{editingArtist ? 'Update' : 'Create'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
