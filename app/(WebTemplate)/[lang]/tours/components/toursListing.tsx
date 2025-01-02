import MainHeading from "@template-components/heading";
import MainHeadingContent from "@template-components/mainHeadingContent";
import Pagination from "@template-components/pagination";
import SearchSelectInput from "@template-components/searchSelect";
import CardLoading from "components/template/container/cardLoading";
import TourCardLoading from "components/template/container/tourCardLoading";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import { TourResponse } from "@utils/types";
import React, { useEffect, useState } from "react";
import { apiTemplateDestinations } from "@utils/services/destination";
import { apiTemplateGetAllHolidayTypes } from "@utils/services/holidayTypes";
import { apiGetTemplateTours } from "@utils/services/tour";
import { getCookie } from "cookies-next";
import { i18n } from "i18n.config";

function ToursListing({
  rowCount,
  tours,
  dictionary,
  locale,
}: {
  locale: any;
  dictionary: any;
  rowCount: number;
  tours: TourResponse[];
}) {
  const [selectedDestination, setSelectedDestination] = useState<any>({});
  const [selectedHolidayTypes, setSelectedHolidayTypes] = useState<string>();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(rowCount);
  const [toursData, setToursData] = useState<TourResponse[]>(tours);
  const { dropdown, sectionHeadings, button, destinationPage } = dictionary;
  const lang = getCookie("lang") || i18n.defaultLocale;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      getInspirations();
      setIsLoading(true);
    }
  }, [selectedDestination.id, selectedHolidayTypes, currentPage]);

  const getInspirations = async () => {
    const response = await apiGetTemplateTours({
      locale: lang,
      ...(selectedDestination?.id && {
        destinationId: selectedDestination.id,
      }),
      ...(selectedHolidayTypes && { holidayTypeId: selectedHolidayTypes }),
      ...(currentPage && { pageNum: currentPage.toString() }),
      ...{ pageSize: "8" },
    });
    if (response?.status === "success") {
      setToursData(response.data.tours);
      setCount(response?.data?.count);
      setIsLoading(false);
    }
  };

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
  useEffect(() => {
    getDestinations();
    getHolidayTypes();
  }, []);

  const getDestinations = async () => {
    const response = await apiTemplateDestinations({ locale: lang });
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
    const response = await apiTemplateGetAllHolidayTypes({ locale: lang });
    if (response.status === "success") {
      setHolidayTypes(
        response.data?.holidayTypes?.map((destination: any) => ({
          label: destination?.name,
          value: destination?.id?.toString(),
        }))
      );
    }
  };
  return (
    <div>
      <MainHeading>
        {sectionHeadings.browseOur}
        {/* <MainHeadingContent
          content={sectionHeadings.tours}
          strongClasses="mt-2 inline-block"
        /> */}
        <strong className=" block text-secondary-color !font-heading">
          {sectionHeadings.tours}
        </strong>
      </MainHeading>
      <div
        className="flex gap-5 justify-start md:items-end my-10 max-md:flex-col"
        id="inspiration"
      >
        <div className="w-[32%] max-md:w-full md:min-w-[276px] ">
          <SearchSelectInput
            onChange={handleDestination}
            value={selectedDestination.id as string}
            label={dropdown.label.destination}
            placeHolder={dropdown.placeholder.destination}
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
            onChange={handleHolidayType}
            value={selectedHolidayTypes as string}
            label={dropdown.label.holidayType}
            placeHolder={dropdown.placeholder.holidayType}
            items={holidayTypes}
            className={`${
              locale !== "en"
                ? "[&>span>span]:text-[11px] [&>span>span]:px-4 leading-[.9]"
                : ""
            } `}
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
            {button.clearAll}
          </button>
        </div>
      </div>
      <div className="">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
            {[1, 2, 3, 4, 5, 6].map((item: any) => (
              <TourCardLoading key={item} />
            ))}
          </div>
        ) : (
          <TourCardWrapper
            tours={toursData}
            dictionary={{ button, destinationPage }}
            locale={locale}
          />
        )}
      </div>
      <Pagination
        totalResults={count}
        onPagination={(currentPage: number, e: any) => {
          setCurrentPage(currentPage);
        }}
        currentPage={currentPage}
        resultsPerPage={9}
        buttonText={{
          nextButton: button.nextPage,
          prevButton: button.prevPage,
        }}
      />
    </div>
  );
}

export default ToursListing;
