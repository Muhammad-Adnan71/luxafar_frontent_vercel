"use client";
import React, { useRef, useState } from "react";
import BlogCard from "@template-components/cards/blogCard";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import SliderButtons from "@template-components/sliderButtons";
import { InspirationResponse } from "@utils/types";
import {
  inspirationUrl,
  pathNameByLocale,
  replaceSpacesWithDash,
} from "@utils/functions";
import CardLoading from "./cardLoading";

function BlogCardWrapper({
  locale,
  blogs,
  column = 3,
  showAll,
  loading,
  destinationName,
  readMore,
}: {
  locale: any;
  readMore?: string;
  destinationName?: string;
  loading?: boolean;
  column?: number;
  blogs?: InspirationResponse[];
  showAll?: boolean;
}) {
  const swiperRefBlog = useRef<any>({}) as any;
  const [slideIndex, setSlideIndex] = useState(0);
  const [lastSlide, setLastSlide] = useState<boolean>(false);
  const handleSlideChange = (params: any) => {
    setSlideIndex(params.activeIndex);
    if (swiperRefBlog?.current?.swiper?.isEnd) {
      setLastSlide(true);
    } else {
      setLastSlide(false);
    }
  };
  const colValue = column === 4;

  return (
    <>
      <div
        className={`grid ${
          colValue ? "grid-cols-4" : "grid-cols-3"
        } gap-x-8 gap-y-12 ${
          showAll ? "hidden" : ""
        } max-sm:gap-y-12 max-lg:grid-cols-2 max-sm:grid-cols-1`}
      >
        {loading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((item: any) => (
              <CardLoading key={item} />
            ))}
          </>
        ) : (
          <>
            {blogs?.map((blog: any, index: number) => {
              return (
                <BlogCard
                  titleClasses={
                    column === 4 ? "text-[20px] !leading-[1.2]" : ""
                  }
                  key={index}
                  image={blog?.media?.mobileMediaUrl}
                  title={blog.title}
                  description={blog.description}
                  buttonURL={pathNameByLocale(
                    locale,
                    inspirationUrl(blog, destinationName)
                  )}
                  buttonText={readMore ? readMore : "Read More"}
                />
              );
            })}
          </>
        )}
      </div>
      <div className={`relative ${showAll ? "" : "hidden"}`}>
        <div className={`relative  `}>
          <Swiper
            onSlideChange={handleSlideChange}
            className="inspirations-slider"
            ref={swiperRefBlog}
            slidesPerView={3}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 40,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
          >
            {blogs?.map((blog: any, index: number) => {
              return (
                <SwiperSlide key={index}>
                  <BlogCard
                    image={blog.media.mobileMediaUrl}
                    title={blog.title}
                    description={blog.description}
                    buttonURL={pathNameByLocale(
                      locale,
                      inspirationUrl(blog, destinationName)
                    )}
                    buttonText={readMore ? readMore : "Read More"}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <SliderButtons
          sliderLength={blogs?.length}
          swiperRef={swiperRefBlog}
          lastSlide={lastSlide}
          slideIndex={slideIndex}
          classes="absolute right-0 -bottom-2 xl:hidden z-10"
        />
      </div>
    </>
  );
}

export default BlogCardWrapper;
