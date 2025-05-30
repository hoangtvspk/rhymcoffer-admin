import type {TrackResponse} from '@/types/api'
import {Modal} from 'antd'

export const RemoveTracksModal = ({
	open,
	onOk,
	onCancel,
	confirmLoading,
	tracksToRemove,
}: {
	open: boolean
	onOk: () => void
	onCancel: () => void
	confirmLoading: boolean
	tracksToRemove: TrackResponse[]
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
			{tracksToRemove.map((t) => (
				<li key={t.id}>- {t.name}</li>
			))}
		</ul>
	</Modal>
)
