"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper";

import Main from "../container";
import SliderPagination from "./bannerSliderPagination";
import BannerSlide from "./bannerSlide";
import BannerImageSlide from "./bannerImageSlide";
import usePreloader from "store/usePreloader";

function Banner({ slides, locale }: { slides: any; locale: any }) {
  const { isLoading } = usePreloader();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState<any>(true);
  const swiperRef = useRef<any>({}) as any;
  useEffect(() => {
    if (isLoading) {
      swiperRef?.current?.swiper?.autoplay?.stop();
    } else {
      swiperRef?.current?.swiper?.autoplay?.start();
    }
  }, [isLoading]);

  return (
    <Main>
      <div
        className={`relative ${
          imageLoading
            ? "lg:h-[calc(100vh-150px)] mb-20 max-sm:mb-12 lg:max-h-[720px] "
            : "h-auto"
        }`}
      >
        <div className="    flex relative justify-end max-md:flex-col">
          <div className="w-[26%] max-lg:w-[45%] z-20 mt-10 absolute top-[0%] left-0 max-md:static max-md:order-2 max-md:w-full max-md:mt-10 max-md:mx-auto ">
            {slides.map(
              (
                { title, description, buttonText, buttonUrl }: any,
                key: number
              ) => (
                <BannerSlide
                  key={key}
                  isLoading={isLoading}
                  activeSlide={activeSlideIndex === key}
                  slide={{ title, description, buttonText, buttonUrl }}
                  locale={locale}
                />
              )
            )}
          </div>
          <div
            className={`w-[75%] max-lg:w-[90%] max-md:w-[100%] opacity-0 translate-x-[60%] z-10 ${
              !isLoading
                ? "animate-[0.7s_slider_0.7s_ease-in-out_forwards]"
                : ""
            } `}
          >
            <Swiper
              ref={swiperRef}
              slidesPerView={1}
              effect="fade"
              modules={[EffectFade, Autoplay]}
              autoplay={{ delay: 7000 }}
              onSlideChange={({ activeIndex }: any) =>
                setActiveSlideIndex(activeIndex)
              }
            >
              {slides.map(({ title, imageId, media }: any, key: number) => (
                <SwiperSlide key={key}>
                  <BannerImageSlide
                    isLoading={isLoading}
                    imageAlt={title}
                    desktopImage={
                      media.desktopMediaUrl ?? media?.mobileMediaUrl
                    }
                    mobileImage={media.mobileMediaUrl ?? media?.desktopMediaUrl}
                    setImageLoading={setImageLoading}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            {slides.length > 1 && (
              <SliderPagination
                slides={slides}
                activeIndex={swiperRef?.current?.swiper?.activeIndex}
                onSlideClick={(index: any) =>
                  swiperRef?.current?.swiper?.slideTo(index)
                }
              />
            )}
          </div>
        </div>
      </div>
    </Main>
  );
}

export default Banner;
