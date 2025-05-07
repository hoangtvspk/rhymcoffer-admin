import {useTranslation} from 'react-i18next'
import SwitchLanguage from '@/components/SwitchLanguage/SwitchLanguage'
const HomeView = () => {
	const {t} = useTranslation()
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-black space-y-4'>
			<p className='text-white text-4xl font-bold'>{t('welcome')}</p>
			<SwitchLanguage />
		</div>
	)
}

export default HomeView
