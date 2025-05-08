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
	DatePicker,
} from 'antd'
import {PlusOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import {albumService} from '@/services'
import type {AlbumRequest, AlbumResponse} from '@/types/api'
import dayjs from 'dayjs'

export const AlbumsView = () => {
	const [albums, setAlbums] = useState<AlbumResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [editingAlbum, setEditingAlbum] = useState<AlbumResponse | null>(null)
	const [form] = Form.useForm()

	useEffect(() => {
		fetchAlbums()
	}, [])

	const fetchAlbums = async () => {
		try {
			setLoading(true)
			const data = await albumService.getAll()
			setAlbums(data)
		} catch (error) {
			message.error('Failed to fetch albums')
		} finally {
			setLoading(false)
		}
	}

	const handleCreate = async (values: AlbumRequest) => {
		try {
			await albumService.create({
				...values,
				releaseDate: values.releaseDate
					? dayjs(values.releaseDate).format('YYYY-MM-DD')
					: undefined,
			})
			message.success('Album created successfully')
			setModalVisible(false)
			form.resetFields()
			fetchAlbums()
		} catch (error) {
			message.error('Failed to create album')
		}
	}

	const handleUpdate = async (values: AlbumRequest) => {
		if (!editingAlbum) return
		try {
			await albumService.update(editingAlbum.id, {
				...values,
				releaseDate: values.releaseDate
					? dayjs(values.releaseDate).format('YYYY-MM-DD')
					: undefined,
			})
			message.success('Album updated successfully')
			setModalVisible(false)
			setEditingAlbum(null)
			form.resetFields()
			fetchAlbums()
		} catch (error) {
			message.error('Failed to update album')
		}
	}

	const handleDelete = async (id: number) => {
		try {
			await albumService.delete(id)
			message.success('Album deleted successfully')
			fetchAlbums()
		} catch (error) {
			message.error('Failed to delete album')
		}
	}

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Release Date',
			dataIndex: 'releaseDate',
			key: 'releaseDate',
		},
		{
			title: 'Album Type',
			dataIndex: 'albumType',
			key: 'albumType',
		},
		{
			title: 'Popularity',
			dataIndex: 'popularity',
			key: 'popularity',
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: any, record: AlbumResponse) => (
				<Space>
					<Button
						type='primary'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingAlbum(record)
							form.setFieldsValue({
								...record,
								releaseDate: record.releaseDate
									? dayjs(record.releaseDate)
									: null,
							})
							setModalVisible(true)
						}}
					>
						Edit
					</Button>
					<Popconfirm
						title='Are you sure you want to delete this album?'
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
				title='Albums'
				extra={
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingAlbum(null)
							form.resetFields()
							setModalVisible(true)
						}}
					>
						Add Album
					</Button>
				}
			>
				<Table
					columns={columns}
					dataSource={albums}
					loading={loading}
					rowKey='id'
					pagination={{pageSize: 10}}
				/>
			</Card>

			<Modal
				title={editingAlbum ? 'Edit Album' : 'Add Album'}
				open={modalVisible}
				onCancel={() => {
					setModalVisible(false)
					setEditingAlbum(null)
					form.resetFields()
				}}
				footer={null}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={editingAlbum ? handleUpdate : handleCreate}
				>
					<Form.Item
						name='name'
						label='Name'
						rules={[{required: true, message: 'Please input album name!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item name='releaseDate' label='Release Date'>
						<DatePicker style={{width: '100%'}} format='YYYY-MM-DD' />
					</Form.Item>

					<Form.Item name='albumType' label='Album Type'>
						<Input />
					</Form.Item>

					<Form.Item name='popularity' label='Popularity'>
						<InputNumber min={0} max={100} />
					</Form.Item>

					<Form.Item name='description' label='Description'>
						<Input.TextArea />
					</Form.Item>

					<Form.Item name='imageUrl' label='Image URL'>
						<Input />
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit'>
							{editingAlbum ? 'Update' : 'Create'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
