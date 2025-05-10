import {Modal, Table} from 'antd'
import type {TrackResponse} from '@/types/api'
import React from 'react'

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

export const AddTracksModal = ({
	open,
	onOk,
	onCancel,
	confirmLoading,
	allTracks,
	artistId,
	addSelectedRowKeys,
	setAddSelectedRowKeys,
	columns,
}: {
	open: boolean
	onOk: () => void
	onCancel: () => void
	confirmLoading: boolean
	allTracks: TrackResponse[]
	artistId: number
	addSelectedRowKeys: React.Key[]
	setAddSelectedRowKeys: (keys: React.Key[]) => void
	columns: any[]
}) => (
	<Modal
		open={open}
		title='Add Tracks to Artist'
		onOk={onOk}
		onCancel={onCancel}
		okText='Add'
		confirmLoading={confirmLoading}
	>
		<Table
			rowSelection={{
				selectedRowKeys: addSelectedRowKeys,
				onChange: setAddSelectedRowKeys,
			}}
			columns={columns}
			dataSource={allTracks.filter(
				(t) => !(t.artists || []).some((a) => a.id === artistId)
			)}
			rowKey='id'
			pagination={false}
			size='small'
		/>
	</Modal>
)
