import {useState, useEffect} from 'react'
import {Button, Card, Table, message, Space, Popconfirm, Image} from 'antd'
import {PlusOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import {trackService} from '../../services'
import type {TrackResponse} from '../../types/api'
import AddTrack from './components/AddTrack'
import UpdateTrack from './components/UpdateTrack'
import {ColumnType} from 'antd/es/table'

const TracksView = () => {
	const [tracks, setTracks] = useState<TrackResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [addModalVisible, setAddModalVisible] = useState(false)
	const [updateModalVisible, setUpdateModalVisible] = useState(false)
	const [editingTrackId, setEditingTrackId] = useState<number | null>(null)

	useEffect(() => {
		fetchTracks()
	}, [])

	const fetchTracks = async () => {
		try {
			setLoading(true)
			const data = await trackService.get({
				page: 0,
				size: 10,
			})
			setTracks(data)
		} catch (error) {
			message.error('Failed to fetch tracks')
		} finally {
			setLoading(false)
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

	const columns: ColumnType<TrackResponse>[] = [
		{
			title: 'Id',
			dataIndex: 'id',
			key: 'id',
			align: 'center',
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: 'Image',
			dataIndex: 'image',
			key: 'image',
			align: 'center',
			render: (_, record: TrackResponse) => (
				<div>
					<Image
						src={
							'https://vcdn1-vnexpress.vnecdn.net/2022/02/09/jisoo-5753-1632298728-1417-1644390050.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=2go4rNn55C2cgKQ_YlbNlQ'
						}
						alt={record.name}
						width={100}
						height={100}
						className='rounded-2xl object-cover'
					/>
				</div>
			),
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
			align: 'center',
			className: 'w-[200px]',
			render: (_: any, record: TrackResponse) => (
				<Space>
					<Button
						type='primary'
						icon={<EditOutlined />}
						onClick={() => {
							setEditingTrackId(record.id)
							setUpdateModalVisible(true)
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
						onClick={() => setAddModalVisible(true)}
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
					pagination={{pageSize: 10, align: 'center'}}
				/>
			</Card>
			<AddTrack
				visible={addModalVisible}
				onCancel={() => setAddModalVisible(false)}
				onSuccess={() => {
					setAddModalVisible(false)
					fetchTracks()
				}}
			/>
			<UpdateTrack
				visible={updateModalVisible}
				onCancel={() => {
					setUpdateModalVisible(false)
					setEditingTrackId(null)
				}}
				onSuccess={() => {
					setUpdateModalVisible(false)
					setEditingTrackId(null)
					fetchTracks()
				}}
				trackId={editingTrackId}
			/>
		</div>
	)
}

export default TracksView
