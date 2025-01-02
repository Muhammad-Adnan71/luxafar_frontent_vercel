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
import {
  apiGetTemplateInspirationByDestinationName,
  apiGetTemplateInspirations,
} from "@utils/services/inspirations";

import { useLocomotiveScroll } from "react-locomotive-scroll";
import { WEB_ROUTES } from "@utils/constant";
import { pathNameByLocale } from "@utils/functions";

function InspirationDestinationComponent({
  inspirations,
  featuredInspiration,
  rowCount,
  destinationName,
  dictionary,
  locale,
}: {
  locale: any;
  dictionary?: any;
  destinationName: string;
  featuredInspiration: InspirationResponse;
  rowCount: number;
  inspirations: InspirationResponse[];
}) {
  // const { planContactBanner, button, sectionHeadings, breadCrumb } = dictionary;
  const { scroll } = useLocomotiveScroll();
  const [inspirationsData, setInspirationsData] = useState(inspirations);

  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(rowCount);
  const [currentPage, setCurrentPage] = useState(1);

  const [isMounted, setIsMounted] = useState(false);
  const { button, inspirationPage, planContactBanner, breadCrumb } = dictionary;

  const breadcrumbs = [
    {
      name: breadCrumb.home,
      url: pathNameByLocale(locale, "/"),
    },
    {
      name: breadCrumb.blogs,
      url: pathNameByLocale(locale, WEB_ROUTES.INSPIRATIONS),
    },
    {
      name: destinationName,
      url: ``,
    },
  ];

  const getInspirations = async () => {
    const response = await apiGetTemplateInspirationByDestinationName({
      ...(currentPage && { pageNum: currentPage.toString() }),
      ...(destinationName && { destinationName }),
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
  }, [currentPage]);

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
      {featuredInspiration ? (
        <FeaturedBlog
          locale={locale}
          ButtonText={button}
          featuredLabel={inspirationPage?.featured}
          minutesLabel={inspirationPage?.mins}
          blog={featuredInspiration}
          destinationName={destinationName}
        />
      ) : (
        <></>
      )}

      <div className="py-10 pb-16 max-sm:py-6">
        <BlogCardWrapper
          readMore={button.readMore}
          locale={locale}
          column={3}
          blogs={inspirationsData}
          showAll={false}
          loading={isLoading}
          destinationName={destinationName}
        />

        <Pagination
          totalResults={count}
          onPagination={(currentPage: number, e: any) => {
            setCurrentPage(currentPage);
            scrollToHash(e, "inspiration", 1000);
          }}
          currentPage={currentPage}
          resultsPerPage={9}
          buttonText={{
            nextButton: button.nextPage,
            prevButton: button.prevPage,
          }}
        />
        <PlanContactBanner
          classes="my-10 max-sm:my-20 "
          title={
            // <>
            //   Ready To{" "}
            //   <strong className="inline max-sm:inline text-secondary-color !font-heading sm:ml-1">
            //     Plan <br className="md:hidden" /> Your Tour?
            //   </strong>
            // </>
            planContactBanner.heading
          }
          locale={locale}
          description={`${planContactBanner.description1},${planContactBanner.description2}`}
          buttonText={button.getBespokePlan}
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
        />
      </div>
    </Container>
  );
}

export default InspirationDestinationComponent;
