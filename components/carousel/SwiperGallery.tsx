'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { Button } from '@heroui/button';
import Image from 'next/image';

export interface ThumbsGalleryProps {
  images: string[];
  alt: string;
  imagesAlt?: string[];
  className?: string;
}

// NOTE: do not add `loading="lazy"` alongside `priority` below — next/image
// throws "has both priority and loading='lazy'" and 500s the page. Non-priority
// images are lazy by default, so the attribute was redundant as well as fatal.
// This only surfaced when a product first shipped more than one image, which is
// the sole condition under which this gallery renders at all.
const SwiperGallery: React.FC<ThumbsGalleryProps> = ({ images, className = '', alt, imagesAlt }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [mainSwiper, setMainSwiper] = useState<any>(null);

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <Swiper
        loop={true}
        spaceBetween={10}
        onSwiper={setMainSwiper}
        {...(thumbsSwiper ? { thumbs: { swiper: thumbsSwiper } } : {})}
        className="w-full mb-10"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Image
              src={src}
              alt={imagesAlt?.[index] || alt}
              height={700}
              width={700}
              quality={90}
              priority={index === 0 ? true : false}
              fetchPriority={index === 0 ? "high" : "low"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-[300px] xl:h-[500px] 2xl:h-[700px] object-cover rounded-[30px] lg:rounded-[50px] select-none pointer-events-auto"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="relative flex items-center justify-center w-full mt-4">
        {/* Prev Button */}
        <Button
          isIconOnly
          radius="full"
          aria-label="Previous"
          color="primary"
          className="thumbs-button-prev absolute left-0 z-10 p-2"
        >
          <IoArrowBackOutline className="w-5 h-5 text-white" />
        </Button>

        <Swiper
          loop={true}
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={3}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[Thumbs, FreeMode, Navigation]}
          navigation={{
            nextEl: '.thumbs-button-next',
            prevEl: '.thumbs-button-prev',
          }}
          className="w-[660px]">
          {images.map((src, index) => (
            <SwiperSlide
              key={index}
              className="flex justify-center"
              onClick={() => mainSwiper?.slideToLoop(index)}
            >
              <Image
                src={src}
                alt={imagesAlt?.[index] || `${alt} - Thumbnail ${index + 1}`}
                width={200}
                height={200}
                quality={90}
                priority={index === 0 ? true : false}
                fetchPriority={index === 0 ? "high" : "low"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-[30px] lg:rounded-[50px] w-full h-full cursor-pointer select-none pointer-events-auto"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Next Button */}
        <Button
          isIconOnly
          radius="full"
          aria-label="Next"
          color="primary"
          className="thumbs-button-next absolute right-0 z-50 p-2"
        >
          <IoArrowForwardOutline className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default SwiperGallery;
