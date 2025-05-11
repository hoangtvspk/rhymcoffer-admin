import {artistService} from '@/services/artist.service'
import {trackService} from '@/services/track.service'
import type {
	ArtistRequest,
	ArtistResponse,
	TrackResponse,
	AlbumResponse,
} from '@/types/api'
import {Card, Form, message} from 'antd'
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {ArtistTracksCard} from './components/ArtistTracksCard'
import {EditArtistForm} from './components/EditArtistForm'
import {ArtistAlbumsCard} from './components/ArtistAlbumsCard'
export const EditArtistView = () => {
	const {id} = useParams<{id: string}>()
	const navigate = useNavigate()
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [artist, setArtist] = useState<ArtistResponse | null>(null)
	const [albums, setAlbums] = useState<AlbumResponse[]>([])
	const [tracks, setTracks] = useState<TrackResponse[]>([])

	const fetchArtist = async () => {
		if (!id) return
		setLoading(true)
		try {
			const data = await artistService.getById(parseInt(id))
			setArtist(data)
			form.setFieldsValue(data)
		} catch (error) {
			message.error('Failed to fetch artist')
			navigate('/artists')
		} finally {
			setLoading(false)
		}
	}

	const fetchTracks = async () => {
		if (!id) return
		setLoading(true)
		try {
			const data = await trackService.get({
				page: 0,
				size: 10,
				artistId: parseInt(id),
			})
			setTracks(data)
		} catch (error) {
			message.error('Failed to fetch tracks')
		} finally {
			setLoading(false)
		}
	}

	const fetchAlbums = async () => {
		if (!id) return
		setLoading(true)
		try {
			const data = await artistService.getAlbums(parseInt(id))
			setAlbums(data)
		} catch (error) {
			message.error('Failed to fetch albums')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchArtist()
		fetchTracks()
		fetchAlbums()
	}, [id, form, navigate])

	const handleUpdate = async (values: ArtistRequest) => {
		if (!id) return
		setLoading(true)
		try {
			await artistService.update(parseInt(id), values)
			message.success('Artist updated successfully')
			navigate('/artists')
		} catch (error) {
			message.error('Failed to update artist')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='flex flex-col gap-4'>
			<Card title='Edit Artist'>
				<EditArtistForm
					artist={artist}
					loading={loading}
					form={form}
					onUpdate={handleUpdate}
				/>
			</Card>
			{id && (
				<ArtistTracksCard
					artistId={parseInt(id)}
					tracks={tracks}
					refetchData={fetchTracks}
				/>
			)}
			{id && (
				<ArtistAlbumsCard
					artistId={parseInt(id)}
					albums={albums}
					refetchData={fetchAlbums}
				/>
			)}
		</div>
	)
}
