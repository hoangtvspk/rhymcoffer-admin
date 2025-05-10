import {Form, Input, InputNumber, Button} from 'antd'
import type {ArtistRequest, ArtistResponse} from '@/types/api'

interface EditArtistFormProps {
	artist: ArtistResponse | null
	loading: boolean
	form: any
	onUpdate: (values: ArtistRequest) => void
}

export const EditArtistForm = ({
	artist,
	loading,
	form,
	onUpdate,
}: EditArtistFormProps) => {
	return (
		<Form
			form={form}
			layout='vertical'
			onFinish={onUpdate}
			initialValues={artist || {}}
		>
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
				<Button type='primary' htmlType='submit' loading={loading}>
					Update
				</Button>
			</Form.Item>
		</Form>
	)
}
