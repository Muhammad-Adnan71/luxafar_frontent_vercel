import React from "react";
import TourCard from "@template-components/cards/tourCard";
import Paragraph from "@template-components/paragraph";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import Container from "components/template/container";
import PlaceCardWrapper from "components/template/container/placeCardWrapper";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import TripCardWrapper from "components/template/container/tripCardWrapper";

import {
  HolidayTypesResponse,
  InspirationResponse,
  TourResponse,
} from "@utils/types";
import MainHeading from "@template-components/heading";
import { pathNameByLocale, replaceSpacesWithDash } from "@utils/functions";
import Button from "@template-components/button";
import { WEB_ROUTES } from "@utils/constant";

export default function PlaceToVisit({
  destination,
  tours,
  blogs,
  places,
  ideas,
  about,
  featuredTour,
  dictionary,
}: {
  dictionary: any;
  destination?: string;
  featuredTour: TourResponse;
  about?: { title: string; description: string };
  ideas?: HolidayTypesResponse[];
  places?: { image: any; title: string; description: string }[];
  blogs?: InspirationResponse[];
  tours?: TourResponse[];
}) {
  const {
    planContactBanner,
    button,
    destinationPage,
    sectionHeadings,
    locale,
  } = dictionary;
  const destinationName =
    destination && destination?.charAt(0).toUpperCase() + destination?.slice(1);

  const toursWithoutFeatured = tours?.filter(
    (item: any) => featuredTour?.id !== item.id
  );

  return (
    <Container>
      <div className="flex gap-24 md:justify-between max-lg:gap-x-10 my-20 max-sm:my-12 max-sm:gap-y-12 max-md:flex-col">
        <div className="w-1/2 max-lg:w-2/5 max-md:w-full">
          <MainHeading classes={" mb-7 max-sm:whitespace-normal"}>
            {destinationPage.getInspired}
          </MainHeading>
          <Paragraph
            classes="opacity-1"
            htmlText={about?.description}
          ></Paragraph>
        </div>
        {featuredTour ? (
          <div className="w-1/2 max-md:w-full">
            <TourCard
              locale={locale}
              dictionary={{ button, destinationPage }}
              destination={destination}
              isFeatured
              tour={featuredTour}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        {places?.length ? (
          <div className="mb-20">
            <SectionTitleHeader
              locale={locale}
              isHeadingAnimated={false}
              classes=" mb-20 max-lg:mb-10 "
              title={destinationPage.placesWhereYouCanGo}
            />
            <PlaceCardWrapper
              locale={locale}
              buttonText={button.readMore}
              places={places}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="mb-20 max-md:mb-12 max-md:mt-5 ">
        <SectionTitleHeader
          locale={locale}
          classes="mb-20 max-lg:mb-10 max-sm:mb-0"
          title={destinationPage.getTripIdeas}
        />
        <TripCardWrapper locale={locale} ideas={ideas} />
      </div>
      <div className="mb-20 max-md:mb-12">
        {blogs?.length ? (
          <div>
            <SectionTitleHeader
              locale={locale}
              classes="mb-20 max-lg:mb-10"
              buttonText={blogs.length > 3 ? button.browseAllInspiration : ""}
              buttonURL={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                destinationName
              )}`}
              title={
                <>
                  <strong className="inline-block text-secondary-color !font-heading">
                    Blogs
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
      <div>
        {toursWithoutFeatured?.length ? (
          <section className="my-16 max-md:mt-8 max-md:mb-0">
            <SectionTitleHeader
              locale={locale}
              classes="mb-20 max-lg:mb-10"
              title={sectionHeadings.recommendedTours}
            />
            <TourCardWrapper
              locale={locale}
              dictionary={{ button, destinationPage }}
              destination={destination}
              tours={toursWithoutFeatured}
              isSlider={true}
            />
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-16 mb-40 max-md:mb-20">
        <PlanContactBanner
          locale={locale}
          title={planContactBanner.heading}
          description={`${planContactBanner.description1} ${destinationName} ${planContactBanner.description2}`}
          buttonText={button.getBespokePlan}
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
        />
      </section>
    </Container>
  );
}
