import {Modal} from 'antd'
import type {AlbumResponse} from '@/types/api'

export const RemoveAlbumsModal = ({
	open,
	onOk,
	onCancel,
	confirmLoading,
	albumsToRemove,
}: {
	open: boolean
	onOk: () => void
	onCancel: () => void
	confirmLoading: boolean
	albumsToRemove: AlbumResponse[]
}) => (
	<Modal
		open={open}
		title='Remove Tracks'
		onOk={onOk}
		onCancel={onCancel}
		okText='Remove'
		okType='danger'
		confirmLoading={confirmLoading}
	>
		Are you sure you want to remove the following track(s) from this artist?
		<ul className='mt-2'>
			{albumsToRemove.map((a) => (
				<li key={a.id}>- {a.name}</li>
			))}
		</ul>
	</Modal>
)
