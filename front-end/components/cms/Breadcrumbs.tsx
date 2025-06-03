import { FC } from 'react'
import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'

export type BreadcrumbData = {
  name: string
  path: string
  current: boolean
}

type BreadcrumbsProps = {
  pages: BreadcrumbData[]
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ pages }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/cms/dashboard" className="text-gray-500 hover:text-gray-700">
              <HomeIcon aria-hidden="true" className="size-5 shrink-0" />

              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>

        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center space-x-4">
              <ChevronRightIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />

              <Link
                href={page.path}
                className={`text-sm font-medium ${page.current ? 'text-indigo-500 hover:text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
