import {trackService} from '@/services'
import {Modal, Form, Input, InputNumber, Switch, Button, Tag} from 'antd'
import {useEffect, useState} from 'react'
import SelectAlbumModal from './SelectAlbumModal'
import SelectArtistsModal from './SelectArtistsModal'
import {albumService} from '../../../services/album.service'
import {artistService} from '../../../services/artist.service'
import type {
	AlbumResponse,
	ArtistResponse,
	TrackResponse,
} from '../../../types/api'

const UpdateTrack = ({
	visible,
	onCancel,
	onSuccess,
	trackId,
}: {
	visible: boolean
	onCancel: () => void
	onSuccess: () => void
	trackId: number | null
}) => {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [fetching, setFetching] = useState(false)
	const [albumModalVisible, setAlbumModalVisible] = useState(false)
	const [artistsModalVisible, setArtistsModalVisible] = useState(false)
	const [selectedAlbum, setSelectedAlbum] = useState<AlbumResponse | null>(null)
	const [selectedArtists, setSelectedArtists] = useState<ArtistResponse[]>([])

	useEffect(() => {
		const fetchTrackAndRelated = async () => {
			if (visible && trackId) {
				setFetching(true)
				try {
					const track: TrackResponse = await trackService.getById(trackId)
					setSelectedAlbum(track.album || null)
					setSelectedArtists(track.artists || [])
					form.setFieldsValue(track)
					// Fetch album if albumId exists
				} finally {
					setFetching(false)
				}
			} else {
				form.resetFields()
				setSelectedAlbum(null)
				setSelectedArtists([])
			}
		}
		fetchTrackAndRelated()
	}, [visible, trackId, form])

	const handleUpdate = async (values: any) => {
		if (!trackId) return
		setLoading(true)
		try {
			await trackService.update(trackId, {
				...values,
				albumId: selectedAlbum?.id,
				artistIds: selectedArtists.map((a) => a.id),
			})
			form.resetFields()
			setSelectedAlbum(null)
			setSelectedArtists([])
			onSuccess()
		} catch (e) {
			// handle error (show notification, etc)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Modal
				title='Edit Track'
				open={visible}
				onCancel={() => {
					onCancel()
					form.resetFields()
					setSelectedAlbum(null)
					setSelectedArtists([])
				}}
				footer={null}
			>
				<Form form={form} layout='vertical' onFinish={handleUpdate}>
					<Form.Item
						name='name'
						label='Name'
						rules={[{required: true, message: 'Please input track name!'}]}
					>
						<Input />
					</Form.Item>
					<Form.Item name='durationMs' label='Duration (ms)'>
						<InputNumber min={0} />
					</Form.Item>
					<Form.Item name='popularity' label='Popularity'>
						<InputNumber min={0} max={100} />
					</Form.Item>
					<Form.Item name='explicit' label='Explicit' valuePropName='checked'>
						<Switch />
					</Form.Item>
					<Form.Item name='isrc' label='ISRC'>
						<Input />
					</Form.Item>
					<Form.Item name='trackNumber' label='Track Number'>
						<Input />
					</Form.Item>
					<Form.Item name='trackUrl' label='Track URL'>
						<Input />
					</Form.Item>
					<Form.Item name='imageUrl' label='Image URL'>
						<Input />
					</Form.Item>

					<Form.Item label='Album'>
						<Button onClick={() => setAlbumModalVisible(true)}>
							{selectedAlbum ? 'Change Album' : 'Select Album'}
						</Button>
						{selectedAlbum && (
							<Tag style={{marginLeft: 8}}>{selectedAlbum.name}</Tag>
						)}
					</Form.Item>

					<Form.Item label='Artists'>
						<Button onClick={() => setArtistsModalVisible(true)}>
							{selectedArtists.length > 0 ? 'Change Artists' : 'Select Artists'}
						</Button>
						{selectedArtists.map((artist) => (
							<Tag key={artist.id} style={{marginLeft: 8}}>
								{artist.name}
							</Tag>
						))}
					</Form.Item>

					<Form.Item>
						<Button
							type='primary'
							htmlType='submit'
							loading={loading || fetching}
						>
							Update
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			<SelectAlbumModal
				visible={albumModalVisible}
				onCancel={() => setAlbumModalVisible(false)}
				onSelect={(album) => {
					setSelectedAlbum(album)
					setAlbumModalVisible(false)
				}}
			/>
			<SelectArtistsModal
				visible={artistsModalVisible}
				onCancel={() => setArtistsModalVisible(false)}
				onSelect={(artists) => {
					setSelectedArtists(artists)
					setArtistsModalVisible(false)
				}}
				selectedIds={selectedArtists.map((a) => a.id)}
			/>
		</>
	)
}

export default UpdateTrack
