import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import { CarouselNextButton, CarouselPrevButton } from "./CarouselButton";

import ListingItem from "../ListingItem/ListingItem";

import "./Carousel.scss";

import "swiper/css";
import ListingItemSkeleton from "./LisitngItemSkeleton";

const Carousel = ({
  sampleListings,
  prevButtonClassName,
  nextButtonClassName,
  header,
  paragraph,
}) => {
  return (
    <div className="carousel-container">
      <div className="header-container">
        <div className="splat_listing_container__headers">
          <h1>{header}</h1>
          <p>{paragraph}</p>
        </div>
        <div className="custom-nav-buttons">
          <CarouselPrevButton prevButtonClassName={prevButtonClassName} />
          <CarouselNextButton nextButtonClassName={nextButtonClassName} />
        </div>
      </div>

      <div>
        <Swiper
          className="carousel-container__swiper"
          modules={[Navigation, A11y]}
           spaceBetween={20}
           slidesPerView={1.1}
           breakpoints={{
             520: { slidesPerView: 1.5, spaceBetween: 16 },
             760: { slidesPerView: 2.1, spaceBetween: 18 },
             1050: { slidesPerView: 3, spaceBetween: 20 },
             1280: { slidesPerView: 3.4, spaceBetween: 20 },
           }}
          navigation={{
            prevEl: `.${prevButtonClassName}`,
            nextEl: `.${nextButtonClassName}`,
          }}
        >
          {sampleListings.length
            ? sampleListings.map((listing) => {
                return (
                  <SwiperSlide key={listing.id}>
                    <ListingItem
                      listing={listing}
                    />
                  </SwiperSlide>
                );
              })
             : [1, 2, 3, 4, 5].map((_, idx) => (
                 <SwiperSlide key={`skeleton-${idx}`}>
                   <ListingItemSkeleton />
                 </SwiperSlide>
               ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;
