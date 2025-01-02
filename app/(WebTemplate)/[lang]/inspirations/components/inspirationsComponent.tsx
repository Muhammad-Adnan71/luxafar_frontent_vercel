"use client";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "@template-components/breadcrumbs";
import Container from "components/template/container";
import SearchSelectInput from "@template-components/searchSelect";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import Pagination from "@template-components/pagination";
import PlanContactBanner from "@template-components/planContactBanner";
import { InspirationResponse } from "@utils/types";
import FeaturedBlog from "./featuredBlog";
import { apiTemplateDestinations } from "@utils/services/destination";
import { apiTemplateGetAllHolidayTypes } from "@utils/services/holidayTypes";
import { apiGetTemplateInspirations } from "@utils/services/inspirations";

import { useLocomotiveScroll } from "react-locomotive-scroll";
import { WEB_ROUTES } from "@utils/constant";
import { Button } from "react-day-picker";
import { getCookie } from "cookies-next";
import { i18n } from "i18n.config";
import { pathNameByLocale } from "@utils/functions";

function InspirationsComponent({
  dictionary,
  inspirations,
  featuredInspirations,
  rowCount,
}: {
  dictionary: any;
  featuredInspirations: InspirationResponse[];
  rowCount: number;
  inspirations: InspirationResponse[];
}) {
  const {
    button,
    dropdown,
    inspirationPage,
    planContactBanner,
    breadCrumb,
    locale,
  } = dictionary;
  const { scroll } = useLocomotiveScroll();
  // const locale = getCookie("lang") || i18n.defaultLocale;
  const [inspirationsData, setInspirationsData] = useState(inspirations);
  const [destinations, setDestinations] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [holidayTypes, setHolidayTypes] = useState<
    {
      label: string;
      value: string;
    }[]
  >();

  const [selectedDestination, setSelectedDestination] = useState<any>({});
  const [selectedHolidayTypes, setSelectedHolidayTypes] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(rowCount);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDestination = (value: string) => {
    setSelectedDestination({
      id: value,
      name: destinations?.find((ele: any) => ele?.value == value)?.label,
    });
    setCurrentPage(1);
  };
  const handleHolidayType = (value: string) => {
    setSelectedHolidayTypes(value);
    setCurrentPage(1);
  };
  const [isMounted, setIsMounted] = useState(false);

  const breadcrumbs = [
    {
      name: breadCrumb.home,
      url: pathNameByLocale(locale, "/"),
    },
    {
      name: breadCrumb.blogs,
      url: pathNameByLocale(locale, WEB_ROUTES.INSPIRATIONS),
    },
  ];

  useEffect(() => {
    getDestinations();
    getHolidayTypes();
  }, []);

  const getDestinations = async () => {
    const response = await apiTemplateDestinations({ locale });
    if (response?.status === "success") {
      setDestinations(
        response?.data.map((destination: any) => ({
          label: destination?.name,
          value: destination?.id?.toString(),
        }))
      );
    }
  };

  const getHolidayTypes = async () => {
    const response = await apiTemplateGetAllHolidayTypes({ locale });
    if (response.status === "success") {
      setHolidayTypes(
        response.data?.holidayTypes?.map((destination: any) => ({
          label: destination?.name,
          value: destination?.id?.toString(),
        }))
      );
    }
  };

  const getInspirations = async () => {
    const response = await apiGetTemplateInspirations({
      locale,
      ...(selectedDestination?.id && {
        destinationId: selectedDestination.id,
      }),
      ...(selectedHolidayTypes && { holidayTypeId: selectedHolidayTypes }),
      ...(currentPage && { pageNum: currentPage.toString() }),
      ...{ pageSize: "9" },
    });
    if (response?.status === "success") {
      setInspirationsData(response.data.inspirations);
      setCount(response?.count);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      getInspirations();
      setIsLoading(true);
    }
  }, [selectedDestination.id, selectedHolidayTypes, currentPage]);
  const scrollToHash = (event: any, element_id: string, offset: number) => {
    event.preventDefault();

    const element = document.getElementById(element_id) as HTMLElement;
    const elementPositionOnWindow: number = element?.getBoundingClientRect().y;
    scroll.scrollTo(elementPositionOnWindow - offset, {
      duration: 500,
      disableLerp: true,
    });
  };

  return (
    <Container>
      <Breadcrumbs breadcrumbs={breadcrumbs} classes="max-md:hidden" />
      {featuredInspirations?.length ? (
        <FeaturedBlog
          locale={locale}
          ButtonText={button}
          featuredLabel={inspirationPage?.featured}
          minutesLabel={inspirationPage?.mins}
          blogs={featuredInspirations}
        />
      ) : (
        <></>
      )}
      <div
        className="flex gap-5 justify-start md:items-end my-10 max-md:flex-col"
        id="inspiration"
      >
        <div className="w-[32%] max-md:w-full md:min-w-[276px] ">
          <SearchSelectInput
            onChange={handleDestination}
            value={selectedDestination.id as string}
            label={dropdown?.label?.destination}
            placeHolder={dropdown?.placeholder?.destination}
            items={destinations}
            className={`${
              locale !== "en"
                ? "[&>span>span]:text-[11px] [&>span>span]:px-4 leading-[.9]"
                : ""
            } `}
          />
        </div>
        <div className="w-[32%] max-md:w-full md:min-w-[276px]">
          <SearchSelectInput
            className={`${
              locale !== "en"
                ? "[&>span>span]:text-[11px] [&>span>span]:px-4 leading-[.9]"
                : ""
            } `}
            onChange={handleHolidayType}
            value={selectedHolidayTypes as string}
            label={dropdown?.label?.holidayType}
            placeHolder={dropdown?.placeholder?.holidayType}
            items={holidayTypes}
          />
        </div>
        <div className="w-[32%] max-md:w-full">
          <button
            onClick={(e) => {
              e.preventDefault();
              setSelectedDestination({});
              setSelectedHolidayTypes("");
            }}
            className="font-body text-secondary-color w-fit pb-3 block font-[600] text-[11px] underline underline-offset-4 "
          >
            {inspirationPage.clearAll}
          </button>
        </div>
      </div>
      <div className="py-10 pb-16 max-sm:py-6">
        <BlogCardWrapper
          locale={locale}
          column={3}
          blogs={inspirationsData}
          showAll={false}
          loading={isLoading}
          destinationName={selectedDestination?.name}
          readMore={button.readMore}
        />

        <Pagination
          buttonText={{
            nextButton: button.nextPage,
            prevButton: button.prevPage,
          }}
          totalResults={count}
          onPagination={(currentPage: number, e: any) => {
            setCurrentPage(currentPage);
            scrollToHash(e, "inspiration", 1000);
          }}
          currentPage={currentPage}
          resultsPerPage={9}
          locale={true}
        />
        <PlanContactBanner
          locale={locale}
          classes="my-10 max-sm:my-20 "
          title={planContactBanner.heading}
          description={planContactBanner.description}
          buttonText={button.getBespokePlan}
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
        />
      </div>
    </Container>
  );
}

export default InspirationsComponent;
