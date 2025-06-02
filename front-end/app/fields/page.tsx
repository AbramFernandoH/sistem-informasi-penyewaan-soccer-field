import PwaLayout from '@/layouts/pwa'
import OurFields from '@/components/home/OurFields'

export default function Fields() {
  return (
    <PwaLayout>
      <OurFields
        titleClassName='text-3xl'
        customBackgroundColor='bg-white'
      />
    </PwaLayout>
  )
}
