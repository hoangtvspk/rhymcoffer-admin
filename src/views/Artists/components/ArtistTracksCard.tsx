import {useEffect, useState} from 'react'
import {Card, Button, Table, message, Image} from 'antd'
import {useNavigate} from 'react-router-dom'
import {artistService} from '@/services/artist.service'
import type {TrackResponse} from '@/types/api'
import {RemoveTracksModal} from './modals/ArtistTracksModals'
import {ColumnType} from 'antd/es/table'

interface ArtistTracksCardProps {
	artistId: number
	tracks: TrackResponse[]
	refetchData: () => void
}

export const ArtistTracksCard = ({
	artistId,
	tracks,
	refetchData: refetchTracks,
}: ArtistTracksCardProps) => {
	const navigate = useNavigate()
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
			await artistService.removeTracks(
				artistId,
				tracksToRemove.map((t) => t.id)
			)
			message.success('Track(s) removed from artist')
			setSelectedRowKeys([])
			setModalVisible(false)
			refetchTracks()
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
		{
			title: 'Popularity',
			dataIndex: 'popularity',
			key: 'popularity',
			align: 'center',
		},
		{
			title: 'Duration (ms)',
			dataIndex: 'durationMs',
			key: 'durationMs',
			align: 'center',
		},
		{
			title: 'Track Number',
			dataIndex: 'trackNumber',
			key: 'trackNumber',
			align: 'center',
		},
		{
			title: 'Action',
			key: 'action',
			align: 'center',
			width: 200,
			render: (_: any, record: TrackResponse) => (
				<Button danger size='small' onClick={() => showRemoveModal([record])}>
					Remove
				</Button>
			),
		},
	]

	return (
		<Card title='Tracks'>
			<div className='flex justify-end mb-4'>
				<Button
					type='primary'
					onClick={() => navigate(`/artists/${artistId}/add-tracks`)}
				>
					Add Tracks
				</Button>
			</div>

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
			<RemoveTracksModal
				open={modalVisible}
				onOk={handleRemoveTracks}
				onCancel={() => setModalVisible(false)}
				confirmLoading={removing}
				tracksToRemove={tracksToRemove}
			/>

			{selectedRowKeys.length > 0 && (
				<div className='mt-2'>
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
		</Card>
	)
}
