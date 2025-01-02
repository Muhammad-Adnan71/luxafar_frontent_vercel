/* eslint-disable @next/next/no-img-element */
"use client";
import ImageWithLoader from "@template-components/ImageWithLoader";
import Breadcrumbs from "@template-components/breadcrumbs";
import MainHeading from "@template-components/heading";
import Container from "components/template/container";
import React, { useEffect, useState } from "react";
import useAdventure from "store/useAdventure";

function HolidayBannerDetail({
  holidayTypeId,
  breadcrumbs,
  image,
  title,
  mobileImage,
  locale,
}: {
  holidayTypeId: number;
  breadcrumbs: { name: string; url: string }[];
  image: any;
  title: string;
  mobileImage?: any;
  locale?: any;
}) {
  let isMobile;
  if (typeof window !== "undefined") {
    isMobile = window && window.screen.width < 640;
  }
  const { handleIsAdventure } = useAdventure();

  useEffect(() => {
    if ([2, 4, 5].includes(holidayTypeId)) {
      handleIsAdventure();
    }
  }, []);

  return (
    <div className="max-sm:w-4/5 max-sm:mx-auto relative overflow-hidden h-[calc(50vh)] after:w-full after:h-full after:bg-[#000] after:absolute after:top-0 after:left-0 after:opacity-[.65]">
      <Container classes="absolute top-[30px] left-[50%] translate-x-[-50%]  z-20 max-md:hidden">
        <Breadcrumbs breadcrumbs={breadcrumbs} classes="mb-10" />
      </Container>
      <Container classes="absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]  z-20">
        <MainHeading
          isHeadingH1={true}
          locale={locale}
          classes={`mb-10 w-[400px] font-semibold max-sm:w-auto ${
            locale === "ru" ? "max-sm:!text-[34px]" : "max-sm:!text-[42px]"
          } max-sm:mb-0 max-sm:text-center`}
        >
          {title}
        </MainHeading>
      </Container>
      <div className="w-full h-full ">
        <ImageWithLoader
          alt={title ? title + " " + "Luxafar Holiday Type Banner" : ""}
          loaderClasses={" glass-banner-effect"}
          classes="w-full h-full object-cover  "
          url={isMobile ? (mobileImage ? mobileImage : image) : image}
        />
      </div>
    </div>
  );
}

export default HolidayBannerDetail;
