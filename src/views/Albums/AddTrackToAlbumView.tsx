import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {Card, Table, Button, message} from 'antd'
import {trackService} from '@/services/track.service'
import {albumService} from '@/services/album.service'
import type {TrackResponse} from '@/types/api'

export const AddTrackToAlbumView = () => {
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
				const allTracks = await trackService.getAll()
				const album = await albumService.getById(parseInt(id))
				const albumTrackIds = album.tracks.map((t: any) => t.id)
				setTracks(allTracks.filter((t) => !albumTrackIds.includes(t.id)))
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
			await albumService.addTracks(parseInt(id), selectedRowKeys as number[])
			message.success('Tracks added successfully')
			navigate(`/albums/${id}`)
		} catch (error) {
			message.error('Failed to add tracks')
		} finally {
			setLoading(false)
		}
	}

	const columns = [
		{title: 'Name', dataIndex: 'name', key: 'name'},
		{title: 'Popularity', dataIndex: 'popularity', key: 'popularity'},
		{title: 'Duration (ms)', dataIndex: 'durationMs', key: 'durationMs'},
		{title: 'Track Number', dataIndex: 'trackNumber', key: 'trackNumber'},
	]

	return (
		<Card title='Add Existing Tracks to Album'>
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
