"use client";
import React, { useRef, useState } from "react";
import Main from "../container";
import MainHeading from "./heading";
import Paragraph from "./paragraph";
import Button from "./button";
import {
  inspirationUrl,
  pathNameByLocale,
  replaceSpacesWithDash,
} from "@utils/functions";
import SliderButtons from "./sliderButtons";
import { Swiper, SwiperSlide } from "swiper/react";
import BlogCard from "./cards/blogCard";
import { ContentResponse, InspirationResponse } from "@utils/types";
import MainHeadingContent from "./mainHeadingContent";
import { getCookie } from "cookies-next";

const Inspirations = ({
  data,
  inspirations,
  locale,
  dictionary,
}: {
  dictionary?: any;
  locale: any;
  data: ContentResponse | undefined;
  inspirations: InspirationResponse[];
}) => {
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
  const lang = getCookie("lang");

  return (
    <div className="relative">
      <Main>
        <div className="pt-28 max-lg:pt-20 relative max-lg:pb-20 pb-40 max-md:pb-10">
          <div className="pb-20">
            <div className="flex justify-between gap-5 max-md:flex-col relative">
              <div className="w-1/2 max-md:w-full max-md:mb-5">
                <div>
                  <MainHeading>
                    <div
                      data-scroll
                      data-scroll-speed="0.5"
                      data-scroll-direction="horizontal"
                      className={` ${
                        locale !== "en" ? "" : "md:whitespace-nowrap"
                      }`}
                    >
                      <MainHeadingContent
                        strongClasses={`${locale !== "en" ? "ml-0" : ""}`}
                        content={data?.title}
                      />
                    </div>
                  </MainHeading>
                </div>
              </div>
              <div className="w-[36%] max-xl:w-[40%] max-md:w-4/5 max-sm:w-full">
                <Paragraph htmlText={data?.description}></Paragraph>
                <div className="flex justify-between items-center">
                  <Button
                    text={data?.buttonText}
                    redirect={pathNameByLocale(
                      locale,
                      data?.buttonUrl as string
                    )}
                  />
                </div>
                <SliderButtons
                  sliderLength={inspirations.length}
                  swiperRef={swiperRefBlog}
                  lastSlide={lastSlide}
                  slideIndex={slideIndex}
                  classes="absolute -bottom-2 right-0  z-10 max-sm:hidden"
                />
              </div>
            </div>
          </div>
          <div className="relative">
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
              {inspirations?.map((blog: any, index: number) => (
                <SwiperSlide key={index}>
                  <BlogCard
                    image={blog?.media?.mobileMediaUrl}
                    title={blog.title}
                    description={blog.description}
                    buttonURL={pathNameByLocale(locale, inspirationUrl(blog))}
                    buttonText={dictionary.readMore}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <SliderButtons
              sliderLength={inspirations.length}
              swiperRef={swiperRefBlog}
              lastSlide={lastSlide}
              slideIndex={slideIndex}
              classes="absolute -bottom-2 right-0  z-10 sm:hidden"
            />
          </div>
        </div>
      </Main>
    </div>
  );
};

export default Inspirations;
