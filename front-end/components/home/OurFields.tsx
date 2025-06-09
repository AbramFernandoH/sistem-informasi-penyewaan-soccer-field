'use client'
import { FC, useState } from 'react'
import SoccerFieldCard, { SoccerFieldCardProps } from '@/components/home/SoccerFieldCard'
import FieldOrderModal from '@/components/FieldOrderModal'

type OurFieldsProps = {
  titleClassName?: string
  customBackgroundColor?: string
}

const OurFields: FC<OurFieldsProps> = ({ titleClassName = '', customBackgroundColor = '' }) => {
  const [isOpenModal, setIsOpenModal] = useState(false)

  const [selectedField, setSelectedField] = useState<SoccerFieldCardProps>({
    imgUrl: '',
    title: '',
    price: 0,
  })

  const data: SoccerFieldCardProps[] = [
    {
      imgUrl: '@/public/dummy-soccer-field.jpg',
      title: 'Lapangan 1',
      price: 150000,
    },
    {
      imgUrl: '@/public/dummy-soccer-field.jpg',
      title: 'Lapangan 2',
      price: 150000,
    },
    {
      imgUrl: '@/public/dummy-soccer-field.jpg',
      title: 'Lapangan 3',
      price: 150000,
    },
    {
      imgUrl: '@/public/dummy-soccer-field.jpg',
      title: 'Lapangan 4',
      price: 150000,
    },
    {
      imgUrl: '@/public/dummy-soccer-field.jpg',
      title: 'Lapangan 5',
      price: 150000,
    },
  ]

  const handleClickCard = (data: SoccerFieldCardProps) => () => {
    setSelectedField(data)

    setIsOpenModal(true)
  }

  const handleClickCloseModal = () => {
    setIsOpenModal(false)
  }

  return (
    <section className={`bg-primary ${customBackgroundColor}`}>
      <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
        <h2 className={`text-2xl font-bold text-gray-900 text-center ${titleClassName}`}>Lapangan Kami</h2>

        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {data.map((data, idx) => (
            <button
              key={idx}
              onClick={handleClickCard(data)}
            >
              <SoccerFieldCard {...data} />
            </button>
          ))}
        </div>

        <FieldOrderModal
          isOpen={isOpenModal}
          closeModal={handleClickCloseModal}
          fieldName={selectedField.title}
        />
      </div>
    </section>
  )
}

export default OurFields
