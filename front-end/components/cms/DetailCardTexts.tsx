import { FC, ReactNode } from 'react'

type DetailCardTextsProps = {
  data: {
    label: string
    value: string | ReactNode
  }[]
  wrapperClassName?: string
  labelClassName?: string
  valueClassName?: string
}

const DetailCardTexts: FC<DetailCardTextsProps> = ({
  data,
  wrapperClassName = '',
  labelClassName = '',
  valueClassName = '',
}) => {
  return (
    <div className={`flex space-x-14 ${wrapperClassName}`}>
      {data.map(({ label, value }, idx) => (
        <div
          key={`${label}-${idx}`}
          className='flex flex-col space-y-1 text-sm w-[200px]'
        >
          <h3 className={`text-gray-400 font-medium ${labelClassName}`}>{label}</h3>

          {typeof value === 'string' ? (
            <p
              title={value}
              className={`font-semibold break-all line-clamp-2 ${valueClassName}`}
            >
              {value}
            </p>
          ) : (
            value
          )}
        </div>
      ))}
    </div>
  )
}

export default DetailCardTexts
