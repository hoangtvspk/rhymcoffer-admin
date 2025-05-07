import {Modal, List, Input, Checkbox, Button} from 'antd'
import {useEffect, useState} from 'react'
import {artistService} from '../../../services/artist.service'
import type {ArtistResponse} from '../../../types/api'

const SelectArtistsModal = ({
	visible,
	onCancel,
	onSelect,
	selectedIds,
}: {
	visible: boolean
	onCancel: () => void
	onSelect: (artists: ArtistResponse[]) => void
	selectedIds: number[]
}) => {
	const [artists, setArtists] = useState<ArtistResponse[]>([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [checkedIds, setCheckedIds] = useState<number[]>(selectedIds)

	useEffect(() => {
		if (visible) {
			setLoading(true)
			artistService
				.getAll()
				.then(setArtists)
				.finally(() => setLoading(false))
			setCheckedIds(selectedIds)
		}
	}, [visible, selectedIds])

	const filteredArtists = artists.filter((artist) =>
		artist.name.toLowerCase().includes(search.toLowerCase())
	)

	const handleCheck = (id: number, checked: boolean) => {
		setCheckedIds((prev) =>
			checked ? [...prev, id] : prev.filter((i) => i !== id)
		)
	}

	const handleConfirm = () => {
		const selected = artists.filter((a) => checkedIds.includes(a.id))
		onSelect(selected)
	}

	return (
		<Modal
			title='Select Artists'
			open={visible}
			onCancel={onCancel}
			footer={[
				<Button key='cancel' onClick={onCancel}>
					Cancel
				</Button>,
				<Button key='ok' type='primary' onClick={handleConfirm}>
					OK
				</Button>,
			]}
		>
			<Input
				placeholder='Search artists...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				style={{marginBottom: 12}}
			/>
			<List
				loading={loading}
				dataSource={filteredArtists}
				renderItem={(artist) => (
					<List.Item>
						<Checkbox
							checked={checkedIds.includes(artist.id)}
							onChange={(e) => handleCheck(artist.id, e.target.checked)}
						>
							{artist.name}
						</Checkbox>
					</List.Item>
				)}
			/>
		</Modal>
	)
}

export default SelectArtistsModal
