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
	Switch,
} from 'antd'
import {PlusOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import {trackService} from '../services/api'
import type {TrackRequest, TrackResponse} from '../types/api'

export const Tracks = () => {
	const [tracks, setTracks] = useState<TrackResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [editingTrack, setEditingTrack] = useState<TrackResponse | null>(null)
	const [form] = Form.useForm()

	useEffect(() => {
		fetchTracks()
	}, [])

	const fetchTracks = async () => {
		try {
			setLoading(true)
			const data = await trackService.getAll()
			setTracks(data)
		} catch (error) {
			message.error('Failed to fetch tracks')
		} finally {
			setLoading(false)
		}
	}

	const handleCreate = async (values: TrackRequest) => {
		try {
			await trackService.create(values)
			message.success('Track created successfully')
			setModalVisible(false)
			form.resetFields()
			fetchTracks()
		} catch (error) {
			message.error('Failed to create track')
		}
	}

	const handleUpdate = async (values: TrackRequest) => {
		if (!editingTrack) return
		try {
			await trackService.update(editingTrack.id, values)
			message.success('Track updated successfully')
			setModalVisible(false)
			setEditingTrack(null)
			form.resetFields()
			fetchTracks()
		} catch (error) {
			message.error('Failed to update track')
		}
	}

	const handleDelete = async (id: number) => {
		try {
			await trackService.delete(id)
			message.success('Track deleted successfully')
			fetchTracks()
		} catch (error) {
			message.error('Failed to delete track')
		}
	}

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Duration (ms)',
			dataIndex: 'durationMs',
			key: 'durationMs',
		},
		{
			title: 'Popularity',
			dataIndex: 'popularity',
			key: 'popularity',
		},
		{
			title: 'Explicit',
			dataIndex: 'explicit',
			key: 'explicit',
			render: (explicit: boolean) => (explicit ? 'Yes' : 'No'),
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: any, record: TrackResponse) => (
				<Space>
					<Button
						type='primary'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingTrack(record)
							form.setFieldsValue(record)
							setModalVisible(true)
						}}
					>
						Edit
					</Button>
					<Popconfirm
						title='Are you sure you want to delete this track?'
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
				title='Tracks'
				extra={
					<Button
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setEditingTrack(null)
							form.resetFields()
							setModalVisible(true)
						}}
					>
						Add Track
					</Button>
				}
			>
				<Table
					columns={columns}
					dataSource={tracks}
					loading={loading}
					rowKey='id'
					pagination={{pageSize: 10}}
				/>
			</Card>

			<Modal
				title={editingTrack ? 'Edit Track' : 'Add Track'}
				open={modalVisible}
				onCancel={() => {
					setModalVisible(false)
					setEditingTrack(null)
					form.resetFields()
				}}
				footer={null}
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={editingTrack ? handleUpdate : handleCreate}
				>
					<Form.Item
						name='name'
						label='Name'
						rules={[{required: true, message: 'Please input track name!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item name='durationMs' label='Duration (ms)'>
						<InputNumber min={0} />
					</Form.Item>

					<Form.Item name='popularity' label='Popularity'>
						<InputNumber min={0} max={100} />
					</Form.Item>

					<Form.Item name='explicit' label='Explicit' valuePropName='checked'>
						<Switch />
					</Form.Item>

					<Form.Item name='isrc' label='ISRC'>
						<Input />
					</Form.Item>

					<Form.Item name='trackNumber' label='Track Number'>
						<Input />
					</Form.Item>

					<Form.Item name='previewUrl' label='Preview URL'>
						<Input />
					</Form.Item>

					<Form.Item name='imageUrl' label='Image URL'>
						<Input />
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit'>
							{editingTrack ? 'Update' : 'Create'}
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	)
}
