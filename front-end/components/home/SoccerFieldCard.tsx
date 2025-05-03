import React, { FC } from 'react';
import field from '@/public/dummy-soccer-field.jpg';
import NextImg from "next/image";

export type SoccerFieldCardProps = {
  imgUrl: string
  title: string
  price: number
}

const SoccerFieldCard: FC<SoccerFieldCardProps> = ({ imgUrl, price, title }) => {
  return (
    <div className="group relative">
      {/* TODO: change it later on to use imgUrl props */}
      <NextImg
        src={field}
        alt="Front of men&#039;s Basic Tee in black."
        className="aspect-square w-full rounded-md bg-white object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
        draggable='false'
      />

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href="#">
              <span aria-hidden="true" className="absolute inset-0"></span>

              {title}
            </a>
          </h3>
        </div>

        <p className="text-sm font-medium text-gray-900">Rp {price}</p>
      </div>
    </div>
  );
};

export default SoccerFieldCard;
