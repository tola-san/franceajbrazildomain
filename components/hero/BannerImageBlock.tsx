
import Image from "next/image";
import { FC } from "react";

interface BannerImageBlockProps {
  src: string;
  alt: string;
  title: string;
  gradient?: string;
}

const BannerImageBlock: FC<BannerImageBlockProps> = ({
  src,
  alt,
  title,
  gradient = "from-black/70 via-transparent to-transparent",
}) => {
  return (
    <figure className="w-[200px] xl:w-[380px] 3xl:w-[520px] h-[490px]  2xl:h-[550px] hidden lg:block bg-white relative overflow-hidden rounded-[30px] lg:rounded-[50px]">
      <Image
        src={src}
        alt={alt}
        loading="lazy"
        height={800}
        width={400}
        quality={100}
        className="object-cover object-top z-0 w-full h-full"
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />
      <figcaption className="absolute top-10 inset-x-0 z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-2xl 2xl:text-3xl 3xl:text-4xl uppercase text-background whitespace-pre-line">
            {title}
          </h3>
        </div>
      </figcaption>
    </figure>
  );
};

export default BannerImageBlock;
