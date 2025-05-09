import {useState} from 'react'
import {Table, Button, Modal, message, Image} from 'antd'
import type {TrackResponse} from '@/types/api'
import {albumService} from '@/services/album.service'
import {ColumnType} from 'antd/es/table'
interface AlbumTracksTableProps {
	albumId: number
	tracks: TrackResponse[]
	onTracksRemoved: () => void
}

export const AlbumTracksTable = ({
	albumId,
	tracks,
	onTracksRemoved,
}: AlbumTracksTableProps) => {
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
	const [removing, setRemoving] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [tracksToRemove, setTracksToRemove] = useState<TrackResponse[]>([])

	const showRemoveModal = (tracks: TrackResponse[]) => {
		setTracksToRemove(tracks)
		setModalVisible(true)
	}

	const handleRemoveTracks = async () => {
		setRemoving(true)
		try {
			await albumService.removeTracks(
				albumId,
				tracksToRemove.map((t) => t.id)
			)
			message.success('Track(s) removed successfully')
			setSelectedRowKeys([])
			setModalVisible(false)
			onTracksRemoved()
		} catch (error) {
			message.error('Failed to remove track(s)')
		} finally {
			setRemoving(false)
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
		{title: 'Popularity', dataIndex: 'popularity', key: 'popularity'},
		{title: 'Duration (ms)', dataIndex: 'durationMs', key: 'durationMs'},
		{title: 'Track Number', dataIndex: 'trackNumber', key: 'trackNumber'},
		{
			title: 'Action',
			key: 'action',
			render: (_: any, record: TrackResponse) => (
				<Button danger size='small' onClick={() => showRemoveModal([record])}>
					Remove
				</Button>
			),
		},
	]

	return (
		<>
			{selectedRowKeys.length > 0 && (
				<div className='mb-2'>
					<Button
						danger
						onClick={() => {
							const selectedTracks = tracks.filter((t) =>
								selectedRowKeys.includes(t.id)
							)
							showRemoveModal(selectedTracks)
						}}
					>
						Remove Selected
					</Button>
				</div>
			)}
			<Table
				rowSelection={{
					selectedRowKeys,
					onChange: setSelectedRowKeys,
				}}
				columns={columns}
				dataSource={tracks}
				rowKey='id'
				pagination={false}
				size='small'
			/>
			<Modal
				open={modalVisible}
				title='Remove Tracks'
				onOk={handleRemoveTracks}
				onCancel={() => setModalVisible(false)}
				okText='Remove'
				okType='danger'
				confirmLoading={removing}
			>
				Are you sure you want to remove the following track(s) from this album?
				<ul className='mt-2'>
					{tracksToRemove.map((t) => (
						<li key={t.id}>- {t.name}</li>
					))}
				</ul>
			</Modal>
		</>
	)
}
