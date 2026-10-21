'use client'

import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import { useGetCategories } from '@/framework/rest/category/useGetCategories'
import { useLocale } from 'next-intl'
import { Button } from '@heroui/button'

const BannerMobile: FC = () => {
  const locale = useLocale()
  const { data = [], isLoading } = useGetCategories({ lang: locale })

  return (
    <div className="relative flex justify-center max-w-full ml-5">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={10}
        slidesPerView={1.3}
        loop={data.length > 1}
        watchOverflow={false}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        className="w-full max-w-full rounded-[30px] lg:rounded-[50px] overflow-hidden">
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[200px] sm:h-[280px] object-cover rounded-[30px] lg:rounded-[50px]  cursor-pointer select-none pointer-events-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent rounded-[30px] lg:rounded-[50px] " />
            <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10">
              <h2 className="text-white text-xl sm:text-2xl font-medium tracking-wide">{item.title}</h2>
              <p className='text-white text-sm sm:text-base font-medium leading-4 sm:leading-tight mt-2'>{item.description}</p>
              <div className='inline-block mt-5'>
                <Button size="sm" className='text-white font-mono' variant='bordered'>View More</Button>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default BannerMobile
