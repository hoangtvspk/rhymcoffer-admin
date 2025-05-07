import {trackService} from '@/services'
import {Modal, Form, Input, InputNumber, Switch, Button, Tag} from 'antd'
import {useEffect, useState} from 'react'
import SelectAlbumModal from './SelectAlbumModal'
import SelectArtistsModal from './SelectArtistsModal'
import {albumService} from '../../../services/album.service'
import {artistService} from '../../../services/artist.service'
import type {AlbumResponse, ArtistResponse} from '../../../types/api'

const AddTrack = ({
	visible,
	onCancel,
	onSuccess,
	initialAlbumId,
	initialArtistIds,
}: {
	visible: boolean
	onCancel: () => void
	onSuccess: () => void
	initialAlbumId?: number
	initialArtistIds?: number[]
}) => {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [albumModalVisible, setAlbumModalVisible] = useState(false)
	const [artistsModalVisible, setArtistsModalVisible] = useState(false)
	const [selectedAlbum, setSelectedAlbum] = useState<AlbumResponse | null>(null)
	const [selectedArtists, setSelectedArtists] = useState<ArtistResponse[]>([])

	useEffect(() => {
		const fetchInitials = async () => {
			if (visible) {
				if (initialAlbumId) {
					const album = await albumService.getById(initialAlbumId)
					setSelectedAlbum(album)
				}
				if (initialArtistIds && initialArtistIds.length > 0) {
					const artists = await Promise.all(
						initialArtistIds.map((id) => artistService.getById(id))
					)
					setSelectedArtists(artists)
				}
			}
		}
		fetchInitials()
	}, [visible, initialAlbumId, initialArtistIds])

	const handleCreate = async (values: any) => {
		setLoading(true)
		try {
			await trackService.create({
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
				title='Add Track'
				open={visible}
				onCancel={() => {
					onCancel()
					form.resetFields()
					setSelectedAlbum(null)
					setSelectedArtists([])
				}}
				footer={null}
			>
				<Form form={form} layout='vertical' onFinish={handleCreate}>
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
						<Button type='primary' htmlType='submit' loading={loading}>
							Create
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

export default AddTrack
