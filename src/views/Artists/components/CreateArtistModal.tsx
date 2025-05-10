import {Modal, Form, Input, InputNumber, Button} from 'antd'
import {artistService} from '@/services/artist.service'
import type {ArtistRequest} from '@/types/api'

interface CreateArtistModalProps {
	visible: boolean
	onCancel: () => void
	onSuccess: () => void
}

export const CreateArtistModal = ({
	visible,
	onCancel,
	onSuccess,
}: CreateArtistModalProps) => {
	const [form] = Form.useForm()

	const handleCreate = async (values: ArtistRequest) => {
		try {
			await artistService.create(values)
			form.resetFields()
			onSuccess()
		} catch (error) {
			// handle error (show notification, etc)
		}
	}

	return (
		<Modal
			title='Add Artist'
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
					rules={[{required: true, message: 'Please input artist name!'}]}
				>
					<Input />
				</Form.Item>
				<Form.Item name='imageUrl' label='Image URL'>
					<Input />
				</Form.Item>
				<Form.Item name='description' label='Description'>
					<Input.TextArea />
				</Form.Item>
				<Form.Item name='popularity' label='Popularity'>
					<InputNumber min={0} max={100} />
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
