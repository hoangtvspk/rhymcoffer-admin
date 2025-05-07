import {Modal, List, Input, Button} from 'antd'
import {useEffect, useState} from 'react'
import {albumService} from '../../../services/album.service'
import type {AlbumResponse} from '../../../types/api'

const SelectAlbumModal = ({
	visible,
	onCancel,
	onSelect,
}: {
	visible: boolean
	onCancel: () => void
	onSelect: (album: AlbumResponse) => void
}) => {
	const [albums, setAlbums] = useState<AlbumResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')

	useEffect(() => {
		if (visible) {
			setLoading(true)
			albumService
				.getAll()
				.then(setAlbums)
				.finally(() => setLoading(false))
		}
	}, [visible])

	const filteredAlbums = albums.filter((album) =>
		album.name.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<Modal
			title='Select Album'
			open={visible}
			onCancel={onCancel}
			footer={null}
		>
			<Input
				placeholder='Search albums...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				style={{marginBottom: 12}}
			/>
			<List
				loading={loading}
				dataSource={filteredAlbums}
				renderItem={(album) => (
					<List.Item
						actions={[
							<Button type='link' onClick={() => onSelect(album)} key='select'>
								Select
							</Button>,
						]}
					>
						{album.name}
					</List.Item>
				)}
			/>
		</Modal>
	)
}

export default SelectAlbumModal
