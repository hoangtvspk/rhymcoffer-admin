import {artistService} from '@/services/artist.service'
import {trackService} from '@/services/track.service'
import type {ArtistRequest, ArtistResponse, TrackResponse} from '@/types/api'
import {Card, Form, message} from 'antd'
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {ArtistTracksCard} from './components/ArtistTracksCard'
import {EditArtistForm} from './components/EditArtistForm'

export const EditArtistView = () => {
	const {id} = useParams<{id: string}>()
	const navigate = useNavigate()
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [artist, setArtist] = useState<ArtistResponse | null>(null)

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

	useEffect(() => {
		fetchArtist()
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
					tracks={artist?.tracks || []}
					refetchData={fetchArtist}
				/>
			)}
			<Card title='Albums'>
				{/* Albums table and add/remove logic goes here */}
				<div>Albums management for artist {id}</div>
			</Card>
		</div>
	)
}
