"use client"

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from "next/image";

const heroImages = [
   {ImgUrl: '/assets/images/hero-1.svg', alt: 'smartwatch'},
   {ImgUrl: '/assets/images/hero-2.svg', alt: 'bag'},
   {ImgUrl: '/assets/images/hero-3.svg', alt: 'lamp'},
   {ImgUrl: '/assets/images/hero-4.svg', alt: 'air fryer'},
   {ImgUrl: '/assets/images/hero-5.svg', alt: 'chair'},
]

const HeroCarousel = () => {
  return (
   <div className="hero-carousel">
      <Carousel
       showThumbs={false}
       autoPlay={true}
       infiniteLoop
       interval={2000}
       showArrows={false}
       showStatus={true}
       >
         {
            heroImages.map((heroImg) => ( 
               <Image
                  src={heroImg.ImgUrl}
                  alt={heroImg.alt}
                  width={484}
                  height={484}
                  className="object-contain"
                  key={heroImg.alt}
               />
            ))
         }
      </Carousel>

      <Image
         src='assets/icons/hand-drawn-arrow.svg'
         alt="arrow"
         width={175}
         height={175}
         className="max-xl:hidden absolute -left-[15%] bottom-0"
      />
   </div>
  )
}

export default HeroCarousel