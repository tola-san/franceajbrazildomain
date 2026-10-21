import { Category } from "@/types/category";
import { FC, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Button } from "@heroui/button";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { ROUTES } from "@/utils/route";
import Image from "next/image";
import { Link } from "@/i18n/routing";

interface Props {
  data: Category[];
  locale: string;
}

const CategoryCarousel: FC<Props> = ({ data, locale }) => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <nav
      className="hidden lg:block px-6"
      aria-label="Product categories carousel"
    >
      <div className="relative flex items-center justify-center max-w-full">
        {/* Prev Button */}
        <Button
          ref={prevRef}
          isIconOnly
          radius="full"
          aria-label="Previous category"
          color="primary"
          size="lg"
          className="absolute -left-5 z-50 border-5 hover:!opacity-100 border-background"
        >
          <IoArrowBackOutline className="w-5 h-5 text-white" />
        </Button>

        <Swiper
          onSwiper={setSwiperInstance}
          loop={true}
          spaceBetween={25}
          slidesPerView={3}
          autoplay={{ delay: 5000 }}
          modules={[Navigation, Autoplay]}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1400: { slidesPerView: 4 },
          }}
          className="w-full z-10 rounded-[30px] lg:rounded-[40px] overflow-hidden"
        >
          {data.map((category) => (

            <SwiperSlide
              key={category.id}
              className="relative"
              tabIndex={0}
              aria-label={`Category: ${category.title}`}
            >
              <Link
                href={`${ROUTES.CATEGORIES}/${category.slug}`}
                className="block w-full h-full"
                tabIndex={-1}
                aria-label={`Go to category ${category.title}`}
              >
                <article
                  className="w-full h-[520px] group relative bg-white hover:bg-warning transition-colors duration-500 rounded-[30px] lg:rounded-[40px] overflow-hidden cursor-pointer"
                  aria-labelledby={`carousel-category-title-${category.id}`}>
                  <div className="flex flex-col h-full items-center justify-between gap-10 py-20 z-20">
                    <div className="relative h-[260px] w-[260px]">
                      {/* thumbnail image  */}
                      <Image
                        src={category.image}
                        alt={`Category image for ${category.title}`}
                        height={250}
                        width={250}
                        loading="lazy"
                        sizes="250px"
                        className={`select-none pointer-events-auto object-contain relative z-50 ${category.className}`}
                      />

                      {/* element shape */}
                      <div className="absolute top-5 right-10 z-10 transition-all duration-300 group-hover:-top-10 group-hover:-right-5">
                        <Image
                          src="/images/decor-leaf.svg"
                          alt="Decorative leaf graphic top right"
                          aria-hidden="true"
                          height={130}
                          width={130}
                          loading="eager"
                          sizes="130px"
                          className="select-none pointer-events-auto object-contain"
                        />
                      </div>
                      {/* element shape */}
                      <div className="absolute -bottom-2 left-0 z-10 transition-all duration-300 translate-x-5 group-hover:translate-x-0 group-hover:left-[-40px]">
                        <Image
                          src="/images/decor-leaf-2.svg"
                          alt="Decorative leaf graphic bottom left"
                          aria-hidden="true"
                          height={130}
                          width={130}
                          loading="eager"
                          sizes="130px"
                          className="select-none pointer-events-auto object-cover"
                        />
                      </div>

                    </div>
                    <div className="text-center space-y-1">
                      <h3
                        id={`carousel-category-title-${category.id}`}
                        className="text-2xl uppercase text-primary font-medium">
                        {category.title}
                      </h3>
                      <p className="text-base font-mono uppercase font-normal text-primary">
                        {category.totalProducts} Products
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 z-10 " aria-hidden="true">
                    <Image
                      src="/images/catagory-card-shape.jpg"
                      alt="Background decorative shape for category card"
                      width={350}
                      height={520}
                      loading="lazy"
                      sizes="(min-width: 1400px) 25vw, (min-width: 1024px) 33vw, 100vw"
                      className="select-none pointer-events-auto w-full h-full object-cover"
                    />
                  </div>

                </article>
              </Link>
            </SwiperSlide>

          ))}
        </Swiper>

        {/* Next Button */}
        <Button
          ref={nextRef}
          isIconOnly
          radius="full"
          aria-label="Next category"
          size="lg"
          color="primary"
          className="absolute -right-5 hover:!opacity-100 z-50 p-2 border-5 border-background"
        >
          <IoArrowForwardOutline className="w-5 h-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};

export default CategoryCarousel;