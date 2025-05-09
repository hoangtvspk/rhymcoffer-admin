import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {
	Card,
	Form,
	Input,
	InputNumber,
	DatePicker,
	Button,
	message,
	Divider,
} from 'antd'
import {albumService} from '@/services'
import type {AlbumRequest, AlbumResponse, TrackResponse} from '@/types/api'
import dayjs from 'dayjs'
import {AlbumTracksTable} from './components/AlbumTracksTable'

export const EditAlbumView = () => {
	const {id} = useParams<{id: string}>()
	const navigate = useNavigate()
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [tracks, setTracks] = useState<TrackResponse[]>([])

	const fetchAlbum = async () => {
		if (!id) return
		try {
			setLoading(true)
			const data = await albumService.getById(parseInt(id))
			form.setFieldsValue({
				...data,
				releaseDate: data.releaseDate ? dayjs(data.releaseDate) : null,
			})
			setTracks([...data.tracks])
		} catch (error) {
			message.error('Failed to fetch album')
			navigate('/albums')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAlbum()
	}, [id, form, navigate])

	const handleUpdate = async (values: AlbumRequest) => {
		if (!id) return
		try {
			await albumService.update(parseInt(id), {
				...values,
				releaseDate: values.releaseDate
					? dayjs(values.releaseDate).format('YYYY-MM-DD')
					: undefined,
			})
			message.success('Album updated successfully')
			navigate('/albums')
		} catch (error) {
			message.error('Failed to update album')
		}
	}

	return (
		<div className='flex flex-col gap-4'>
			<Card title='Edit Album' loading={loading}>
				<Form form={form} layout='vertical' onFinish={handleUpdate}>
					<Form.Item
						name='name'
						label='Name'
						rules={[{required: true, message: 'Please input album name!'}]}
					>
						<Input />
					</Form.Item>

					<Form.Item name='releaseDate' label='Release Date'>
						<DatePicker style={{width: '100%'}} format='YYYY-MM-DD' />
					</Form.Item>

					<Form.Item name='albumType' label='Album Type'>
						<Input />
					</Form.Item>

					<Form.Item name='popularity' label='Popularity'>
						<InputNumber min={0} max={100} />
					</Form.Item>

					<Form.Item name='description' label='Description'>
						<Input.TextArea />
					</Form.Item>

					<Form.Item name='imageUrl' label='Image URL'>
						<Input />
					</Form.Item>

					<Form.Item>
						<Button type='primary' htmlType='submit'>
							Update
						</Button>
					</Form.Item>
				</Form>

				<Divider orientation='left'>Tracks</Divider>
			</Card>
			<Card title='Tracks'>
				<div className='flex justify-end mb-4'>
					<Button
						type='primary'
						onClick={() => navigate(`/albums/${id}/add-track`)}
					>
						Add Tracks
					</Button>
				</div>
				<AlbumTracksTable
					albumId={parseInt(id!)}
					tracks={tracks}
					onTracksRemoved={fetchAlbum}
				/>
			</Card>
		</div>
	)
}
