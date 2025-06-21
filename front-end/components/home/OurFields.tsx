'use client'
import { FC, useState } from 'react'
import SoccerFieldCard, { SoccerFieldCardProps } from '@/components/home/SoccerFieldCard'
import FieldOrderModal from '@/components/FieldOrderModal'
import { useQuery } from '@tanstack/react-query'
import { ListFieldRequest, ListFieldResponse } from '@/utils/type'
import { ENV } from '@/utils/constants'
import Shimmer from '@/components/Shimmer'

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

  const { data, isPending } = useQuery<ListFieldRequest, unknown, ListFieldResponse>({
    queryKey: ['field'],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch(`${ENV.API_URL}/fields`)

      if (!res.ok) {
        const errorData = await res.json()

        throw new Error(errorData.message || 'Failed to get list field')
      }

      return res.json()
    },
  })

  const handleClickCard = (data: SoccerFieldCardProps) => () => {
    setSelectedField(data)

    setIsOpenModal(true)
  }

  const handleClickCloseModal = () => {
    setIsOpenModal(false)
  }

  return (
    <section className={`bg-primary ${customBackgroundColor}`}>
      <div className='mx-auto max-w-2xl px-6 py-24 lg:max-w-7xl lg:px-8'>
        <h2 className={`text-2xl font-bold text-gray-900 text-center ${titleClassName}`}>Lapangan Kami</h2>

        <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {!isPending && data
            ? data.data.items.map((field, idx) => (
                <button
                  key={idx}
                  onClick={handleClickCard({
                    imgUrl: field.photo,
                    title: field.name,
                    price: field.pricePerHour,
                  })}
                >
                  <SoccerFieldCard
                    title={field.name}
                    imgUrl={field.photo}
                    price={field.pricePerHour}
                  />
                </button>
              ))
            : [1, 2, 3, 4, 5].map((num) => (
                <div
                  key={`field-${num}-shimmer`}
                  className='flex flex-col space-y-4'
                >
                  <Shimmer className='aspect-square w-full rounded-md object-cover lg:aspect-auto lg:h-80' />

                  <div className='flex items-center justify-between'>
                    <Shimmer className='w-[100px] h-5' />

                    <Shimmer className='w-[100px] h-5' />
                  </div>
                </div>
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
