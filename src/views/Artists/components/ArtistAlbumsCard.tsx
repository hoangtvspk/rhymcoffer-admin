import {artistService} from '@/services/artist.service'
import type {AlbumResponse} from '@/types/api'
import {Button, Card, Image, Table, message} from 'antd'
import {ColumnType} from 'antd/es/table'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {RemoveAlbumsModal} from './modals/ArtistAlbumsModals'

interface ArtistAlbumsCardProps {
	artistId: number
	albums: AlbumResponse[]
	refetchData: () => void
}

export const ArtistAlbumsCard = ({
	artistId,
	albums,
	refetchData: refetchAlbums,
}: ArtistAlbumsCardProps) => {
	const navigate = useNavigate()
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
	const [removing, setRemoving] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [albumsToRemove, setAlbumsToRemove] = useState<AlbumResponse[]>([])

	const showRemoveModal = (albums: AlbumResponse[]) => {
		setAlbumsToRemove(albums)
		setModalVisible(true)
	}

	const handleRemoveAlbums = async () => {
		setRemoving(true)
		try {
			await artistService.removeAlbums(
				artistId,
				albumsToRemove.map((a) => a.id)
			)
			message.success('Album(s) removed from artist')
			setSelectedRowKeys([])
			setModalVisible(false)
			refetchAlbums()
		} catch (error) {
			message.error('Failed to remove album(s)')
		} finally {
			setRemoving(false)
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
			title: 'Action',
			key: 'action',
			align: 'center',
			width: 200,
			render: (_: any, record: AlbumResponse) => (
				<Button danger size='small' onClick={() => showRemoveModal([record])}>
					Remove
				</Button>
			),
		},
	]

	return (
		<Card title='Albums'>
			<div className='flex justify-end mb-4'>
				<Button
					type='primary'
					onClick={() => navigate(`/artists/${artistId}/add-albums`)}
				>
					Add Albums
				</Button>
			</div>

			<Table
				rowSelection={{
					selectedRowKeys,
					onChange: setSelectedRowKeys,
				}}
				columns={columns}
				dataSource={albums}
				rowKey='id'
				pagination={false}
				size='small'
			/>
			<RemoveAlbumsModal
				open={modalVisible}
				onOk={handleRemoveAlbums}
				onCancel={() => setModalVisible(false)}
				confirmLoading={removing}
				albumsToRemove={albumsToRemove}
			/>

			{selectedRowKeys.length > 0 && (
				<div className='mt-2'>
					<Button
						danger
						onClick={() => {
							const selectedAlbums = albums.filter((a) =>
								selectedRowKeys.includes(a.id)
							)
							showRemoveModal(selectedAlbums)
						}}
					>
						Remove Selected
					</Button>
				</div>
			)}
		</Card>
	)
}
