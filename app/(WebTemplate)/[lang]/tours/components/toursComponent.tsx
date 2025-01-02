"use client";

import React from "react";
import ToursBanner from "./toursBanner";
import Container from "components/template/container";

import UpcomingToursSlider from "./upcomingToursSlider";
import FeaturedTours from "./featuredTours";
import ToursListing from "./toursListing";
import {
  BespokeQuestionResponse,
  InspirationResponse,
  TourResponse,
} from "@utils/types";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import Button from "@template-components/button";
import BespokeForm from "./bespokeForm";
import { WEB_ROUTES } from "@utils/constant";
import { pathNameByLocale } from "@utils/functions";

function ToursComponent({
  tours,
  featuredTours,
  rowCount,
  upcomingTours,
  inspirations,
  questions,
  page,
  dictionary,
}: {
  dictionary: any;
  page: any;
  inspirations: InspirationResponse[];
  featuredTours: TourResponse[];
  upcomingTours: TourResponse[];
  rowCount: number;
  tours: TourResponse[];
  questions: BespokeQuestionResponse[];
}) {
  const {
    breadCrumb,
    toursPage,
    planContactBanner,
    button,
    sectionHeadings,
    dropdown,
    placeholder,
    bespokePage,
    errors,
    destinationPage,
    locale,
  } = dictionary;
  const breadcrumbs = [
    { name: breadCrumb.home, url: pathNameByLocale(locale, "/") },
    {
      name: breadCrumb.tours,
      url: pathNameByLocale(locale, `${WEB_ROUTES.TOURS}`),
    },
  ];
  const bannerVideo1 = page.content.find(
    (ele: any) => ele.name === "banner Video"
  );
  const bannerVideo2 = page.content.find(
    (ele: any) => ele.name === "banner Video" && bannerVideo1.id !== ele.id
  );
  const bespokePlan = page.content.find(
    (ele: any) => ele.name === "bespoke plan "
  );
  const upcomingToursContent = page.content.find(
    (ele: any) => ele.name === "upcoming tours"
  );
  const bannerSection = page.content.find(
    (ele: any) => ele.name === "banner Section"
  );
  return (
    <>
      <ToursBanner
        locale={locale}
        breadcrumbs={breadcrumbs}
        mainHeading={bannerSection?.title}
        buttonText={bannerSection?.buttonText}
        description={bannerSection?.description}
        buttonLink={bannerSection?.buttonUrl}
        bannerVideo1={bannerVideo1?.media?.desktopMediaUrl}
        bannerVideo2={bannerVideo2?.media?.desktopMediaUrl}
      />

      <UpcomingToursSlider
        locale={locale}
        slides={upcomingTours}
        title={upcomingToursContent?.title}
        description={upcomingToursContent?.description}
      />
      <Container>
        <FeaturedTours
          locale={locale}
          slides={featuredTours}
          dictionary={toursPage}
        />
        <ToursListing
          locale={locale}
          rowCount={rowCount}
          tours={tours}
          dictionary={{ sectionHeadings, dropdown, button, destinationPage }}
        />
        <BespokeForm
          locale={locale}
          dictionary={{ button, placeholder, errors, bespokePage }}
          questions={questions.slice(0, 2)}
          description={bespokePlan?.description}
        />
        <div>
          {inspirations?.length > 0 && (
            <section className="my-20 max-md:mt-12">
              <SectionTitleHeader
                locale={locale}
                classes=" mb-20 max-lg:mb-10 "
                title={
                  <strong className="block text-secondary-color !font-heading">
                    {sectionHeadings?.blogs}
                  </strong>
                }
              />
              <BlogCardWrapper
                locale={locale}
                readMore={button?.readMore}
                showAll={true}
                blogs={inspirations?.slice(0, 3)}
              />
              {inspirations.length > 3 && (
                <div className="md:hidden text-center mt-10 max-sm:mt-14">
                  <Button
                    redirect={pathNameByLocale(
                      locale,
                      `${WEB_ROUTES.INSPIRATIONS}`
                    )}
                    classes="!text-[14px] max-sm:!text-[11px]"
                    text={button.seeAllInspiration}
                  />
                </div>
              )}
            </section>
          )}
        </div>
        <section className="my-20 max-md:mt-0 mb-32">
          <PlanContactBanner
            locale={locale}
            title={planContactBanner?.heading}
            description={planContactBanner?.description}
            buttonText={button?.getBespokePlan}
            buttonURL={`${WEB_ROUTES.BESPOKE_HOLIDAY}`}
          />
        </section>
      </Container>
    </>
  );
}

export default ToursComponent;
