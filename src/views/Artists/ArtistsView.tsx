import {useState, useEffect} from 'react'
import {
	Button,
	Card,
	Table,
	message,
	Space,
	Popconfirm,
	InputNumber,
	Image,
} from 'antd'
import {PlusOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons'
import type {ArtistRequest, ArtistResponse} from '@/types/api'
import {artistService} from '@/services'
import {CreateArtistModal} from './components/CreateArtistModal'
import {useNavigate} from 'react-router-dom'
import {ColumnType} from 'antd/es/table'

export const ArtistsView = () => {
	const [artists, setArtists] = useState<ArtistResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const navigate = useNavigate()

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

	const handleDelete = async (id: number) => {
		try {
			await artistService.delete(id)
			message.success('Artist deleted successfully')
			fetchArtists()
		} catch (error) {
			message.error('Failed to delete artist')
		}
	}

	const columns: ColumnType<ArtistResponse>[] = [
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
			render: (_, record: ArtistResponse) => (
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
			title: 'Popularity',
			dataIndex: 'popularity',
			key: 'popularity',
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: any, record: ArtistResponse) => (
				<Space>
					<Button
						type='primary'
						icon={<EditOutlined />}
						onClick={() => navigate(`/artists/${record.id}`)}
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
						onClick={() => setModalVisible(true)}
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

			<CreateArtistModal
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				onSuccess={() => {
					setModalVisible(false)
					fetchArtists()
				}}
			/>
		</div>
	)
}
