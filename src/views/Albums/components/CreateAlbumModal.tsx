import {Modal, Form, Input, InputNumber, DatePicker, Button} from 'antd'
import {albumService} from '@/services'
import type {AlbumRequest} from '@/types/api'
import dayjs from 'dayjs'

interface CreateAlbumModalProps {
	visible: boolean
	onCancel: () => void
	onSuccess: () => void
}

export const CreateAlbumModal = ({
	visible,
	onCancel,
	onSuccess,
}: CreateAlbumModalProps) => {
	const [form] = Form.useForm()

	const handleCreate = async (values: AlbumRequest) => {
		try {
			await albumService.create({
				...values,
				releaseDate: values.releaseDate
					? dayjs(values.releaseDate).format('YYYY-MM-DD')
					: undefined,
			})
			form.resetFields()
			onSuccess()
		} catch (error) {
			// Error is handled by the service
		}
	}

	return (
		<Modal
			title='Add Album'
			open={visible}
			onCancel={() => {
				onCancel()
				form.resetFields()
			}}
			footer={null}
		>
			<Form form={form} layout='vertical' onFinish={handleCreate}>
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
						Create
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	)
}
