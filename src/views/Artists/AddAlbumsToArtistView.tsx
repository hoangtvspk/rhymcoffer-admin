import {albumService} from '@/services/album.service'
import {artistService} from '@/services/artist.service'
import type {AlbumResponse} from '@/types/api'
import {Button, Card, message, Table} from 'antd'
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

export const AddAlbumsToArtistView = () => {
	const {id} = useParams<{id: string}>()
	const navigate = useNavigate()
	const [albums, setAlbums] = useState<AlbumResponse[]>([])
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const fetchTracks = async () => {
			if (!id) return
			setLoading(true)
			try {
				const allAlbums = await albumService.getAll()
				const albums = await artistService.getAlbums(parseInt(id))
				setAlbums(allAlbums.filter((a) => !albums.some((aa) => aa.id === a.id)))
			} catch (error) {
				message.error('Failed to fetch albums')
			} finally {
				setLoading(false)
			}
		}
		fetchTracks()
	}, [id])

	const handleAddAlbums = async () => {
		if (!id || selectedRowKeys.length === 0) return
		setLoading(true)
		try {
			await artistService.addAlbums(parseInt(id), selectedRowKeys as number[])
			message.success('Albums added successfully')
			navigate(`/artists/${id}`)
		} catch (error) {
			message.error('Failed to add tracks')
		} finally {
			setLoading(false)
		}
	}

	const columns = [
		{title: 'Name', dataIndex: 'name', key: 'name'},
		{title: 'Popularity', dataIndex: 'popularity', key: 'popularity'},
		{title: 'Release Date', dataIndex: 'releaseDate', key: 'releaseDate'},
		{title: 'Album Type', dataIndex: 'albumType', key: 'albumType'},
	]

	return (
		<Card title='Add Existing Tracks to Artist'>
			<Table
				rowSelection={{
					selectedRowKeys,
					onChange: setSelectedRowKeys,
				}}
				columns={columns}
				dataSource={albums}
				rowKey='id'
				loading={loading}
				pagination={{pageSize: 10}}
			/>
			<Button
				type='primary'
				onClick={handleAddAlbums}
				disabled={selectedRowKeys.length === 0}
				loading={loading}
				className='mt-4'
			>
				Add Selected Albums
			</Button>
		</Card>
	)
}
