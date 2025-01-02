"use client";
import React from "react";
import TourCard from "@template-components/cards/tourCard";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import Container from "components/template/container";
import PlanContactBanner from "@template-components/planContactBanner";
import SeasonsTabs from "./seasonTabs";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import { InspirationResponse, TourResponse } from "@utils/types";
import { pathNameByLocale, replaceSpacesWithDash } from "@utils/functions";
import Button from "@template-components/button";
import { WEB_ROUTES } from "@utils/constant";

const BestTimeToVisit = ({
  dictionary,
  about,
  blogs,
  seasonToVisit,
  featuredTour,
  destination,
}: {
  dictionary: any;
  destination: string;
  featuredTour: TourResponse;
  tour?: TourResponse[];
  blogs?: InspirationResponse[];
  about?: { title: string; description: string };
  seasonToVisit?: any[];
}) => {
  const {
    planContactBanner,
    button,
    destinationPage,
    sectionHeadings,
    locale,
  } = dictionary;
  const destinationName =
    destination?.charAt(0)?.toUpperCase() + destination?.slice(1);

  return (
    <Container>
      <div className="flex gap-24 my-20 mb-16 max-md:gap-y-8 max-md:my-12 max-md:flex-col">
        <div className="w-1/2 max-md:w-full">
          <MainHeading classes="mb-10">
            {destinationPage.seasonsToVisitHeading}
          </MainHeading>
          <Paragraph
            classes="opacity-80"
            htmlText={about?.description} 
          ></Paragraph>
        </div>
        {featuredTour && (
          <div className="w-1/2 max-md:w-full">
            <TourCard
              locale={locale}
              dictionary={{ button, destinationPage }}
              isFeatured
              tour={featuredTour}
            />
          </div>
        )}
      </div>
      <div>
        {seasonToVisit?.length ? (
          <SeasonsTabs
            dictionary={{ destinationPage }}
            seasonData={seasonToVisit}
          />
        ) : (
          ""
        )}
      </div>
      <div className="py-6 pb-10 max-md:py-8 max-md:pt-0">
        <PlanContactBanner
          classes="my-10 px-[5%]"
          title={planContactBanner.heading2}
          description={`${planContactBanner.description1} ${destinationName} ${planContactBanner.description2}`}
          buttonText={button.getBespokePlan}
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
          locale={locale}
        />
      </div>
      <div>
        {blogs?.length ? (
          <div className="mb-40 max-md:mb-20">
            <SectionTitleHeader
              locale={locale}
              classes="mb-10"
              buttonText={blogs.length > 3 ? button.browseAllInspiration : ""}
              buttonURL={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                destinationName
              )}`}
              title={
                <>
                  <strong className="text-secondary-color !font-heading">
                    {sectionHeadings.blogs}
                  </strong>
                </>
              }
            />
            <BlogCardWrapper
              locale={locale}
              readMore={button.readMore}
              showAll={true}
              blogs={blogs?.slice(0, 3)}
              destinationName={destinationName}
            />
            {blogs.length > 3 && (
              <div className="md:hidden text-center mt-10 max-sm:mt-14">
                <Button
                  redirect={pathNameByLocale(
                    locale,
                    `${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                      destinationName
                    )}`
                  )}
                  classes="!text-[14px] max-sm:!text-[11px]"
                  text={button.seeAllInspiration}
                />
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </Container>
  );
};

export default BestTimeToVisit;
