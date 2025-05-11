import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Card, Table, Button, message, Image} from 'antd'
import {trackService} from '@/services/track.service'
import {artistService} from '@/services/artist.service'
import type {TrackResponse} from '@/types/api'
import {ColumnType} from 'antd/es/table'

export const AddTracksToArtistView = () => {
	const {id} = useParams<{id: string}>()
	const navigate = useNavigate()
	const [tracks, setTracks] = useState<TrackResponse[]>([])
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const fetchTracks = async () => {
			if (!id) return
			setLoading(true)
			try {
				const allTracks = await trackService.get({
					page: 0,
					size: 10,
				})
				const tracks = await trackService.get({
					page: 0,
					size: 10,
					artistId: parseInt(id),
				})
				setTracks(allTracks.filter((t) => !tracks.some((at) => at.id === t.id)))
			} catch (error) {
				message.error('Failed to fetch tracks')
			} finally {
				setLoading(false)
			}
		}
		fetchTracks()
	}, [id])

	const handleAddTracks = async () => {
		if (!id || selectedRowKeys.length === 0) return
		setLoading(true)
		try {
			await artistService.addTracks(parseInt(id), selectedRowKeys as number[])
			message.success('Tracks added successfully')
			navigate(`/artists/${id}`)
		} catch (error) {
			message.error('Failed to add tracks')
		} finally {
			setLoading(false)
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
						rootClassName='rounded-2xl'
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
	]

	return (
		<Card title='Add Existing Tracks to Artist'>
			<Table
				rowSelection={{
					selectedRowKeys,
					onChange: setSelectedRowKeys,
				}}
				columns={columns}
				dataSource={tracks}
				rowKey='id'
				loading={loading}
				pagination={{pageSize: 10}}
			/>
			<Button
				type='primary'
				onClick={handleAddTracks}
				disabled={selectedRowKeys.length === 0}
				loading={loading}
				className='mt-4'
			>
				Add Selected Tracks
			</Button>
		</Card>
	)
}
