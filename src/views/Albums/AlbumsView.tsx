import {useState, useEffect} from 'react'
import {Button, Card, Table, message, Space, Popconfirm, Image} from 'antd'
import {PlusOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import {albumService} from '@/services'
import type {AlbumResponse} from '@/types/api'
import {useNavigate} from 'react-router-dom'
import {CreateAlbumModal} from './components/CreateAlbumModal'
import {ColumnType} from 'antd/es/table'

export const AlbumsView = () => {
	const [albums, setAlbums] = useState<AlbumResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [selectedAlbums, setSelectedAlbums] = useState<AlbumResponse[]>([])
	const navigate = useNavigate()

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

	const handleDelete = async (id: number) => {
		try {
			await albumService.delete(id)
			message.success('Album deleted successfully')
			fetchAlbums()
		} catch (error) {
			message.error('Failed to delete album')
		}
	}

	const columns: ColumnType<AlbumResponse>[] = [
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
			render: (_, record: AlbumResponse) => (
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
			title: 'Release Date',
			dataIndex: 'releaseDate',
			key: 'releaseDate',
			align: 'center',
		},
		{
			title: 'Album Type',
			dataIndex: 'albumType',
			key: 'albumType',
			align: 'center',
		},
		{
			title: 'Popularity',
			dataIndex: 'popularity',
			key: 'popularity',
			align: 'center',
		},
		{
			title: 'Actions',
			key: 'actions',
			align: 'center',
			className: 'w-[200px]',
			render: (_: any, record: AlbumResponse) => (
				<Space>
					<Button
						type='primary'
						icon={<EditOutlined />}
						onClick={() => navigate(`/albums/${record.id}`)}
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
						onClick={() => setModalVisible(true)}
					>
						Add Album
					</Button>
				}
			>
				<Table
					columns={columns}
					rowSelection={{
						selectedRowKeys: selectedAlbums.map((album) => album.id),
						onChange: (_, selectedTracks) => setSelectedAlbums(selectedTracks),
					}}
					dataSource={albums}
					loading={loading}
					rowKey='id'
					pagination={{pageSize: 10}}
				/>
			</Card>

			<CreateAlbumModal
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				onSuccess={() => {
					setModalVisible(false)
					fetchAlbums()
				}}
			/>
		</div>
	)
}
