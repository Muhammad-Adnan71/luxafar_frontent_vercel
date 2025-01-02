import TourCard from "@template-components/cards/tourCard";
import Paragraph from "@template-components/paragraph";
import ThingsSection from "@template-components/thingsSection";
import Container from "components/template/container";
import React from "react";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import GuideThingsCardWrapper from "components/template/container/guideThingsCardWrapper";
import {
  DestinationFeatureOfferedResponse,
  InspirationResponse,
  TourResponse,
} from "@utils/types";
import MainHeading from "@template-components/heading";
import { pathNameByLocale, replaceSpacesWithDash } from "@utils/functions";
import { useRouter } from "next/navigation";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import Button from "@template-components/button";
import { WEB_ROUTES } from "@utils/constant";
export default function ThingsToDo({
  about,
  thingsToDo,
  blogs,
  tour,
  featuredTour,
  destinationFeatureOffered,
  destination,
  dictionary,
}: {
  dictionary: any;
  destination: string;
  featuredTour: TourResponse;
  thingsToDo?: any[];
  destinationFeatureOffered: DestinationFeatureOfferedResponse[];
  tour?: TourResponse[];
  about?: { title: string; description: string };
  blogs?: InspirationResponse[];
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
  const router = useRouter();
  const { scroll } = useLocomotiveScroll();
  return (
    <Container>
      <section className="mb-12 mt-20 max-md:mt-12">
        <div className="flex xl:gap-20 max-xl:gap-10 justify-between mb-16 max-md:mb-10 max-lg:flex-col">
          <div className="w-1/2 max-lg:w-full">
            <MainHeading
              classes={`mb-10 max-md:mb-0 ${
                locale === "ru" ? "max-[380px]:text-[36px]" : ""
              }`}
            >
              {destinationPage.ultimateGuideForThingsToDo}
            </MainHeading>
          </div>
          {featuredTour && (
            <div className="md:min-w-[492px] w-[45%] max-lg:hidden">
              <TourCard
                locale={locale}
                dictionary={{ destinationPage, button }}
                isFeatured
                tour={featuredTour}
              />
            </div>
          )}
        </div>

        <Paragraph
          htmlText={about?.description}
          classes="opacity-1"
        ></Paragraph>
        {featuredTour && (
          <div className="md:w-[492px] max-md:w-full mr-auto lg:hidden pt-10">
            <TourCard
              locale={locale}
              dictionary={{ destinationPage, button }}
              isFeatured
              tour={featuredTour}
            />
          </div>
        )}
      </section>
      <div>
        {thingsToDo?.length ? (
          <section className="my-16 max-xl:my-10">
            {thingsToDo?.map((item: any, index: number) => (
              <div key={index} className="pb-10 max-md:pb-0">
                <ThingsSection
                  locale={locale}
                  altText={
                    item?.title ? item.title + " " + "Luxafar Things To Do" : ""
                  }
                  title={item.title}
                  image={item.media}
                  description={item.description}
                  imgRight={index % 2 === 0 ? true : false}
                  key={index}
                ></ThingsSection>
              </div>
            ))}
          </section>
        ) : (
          ""
        )}
      </div>
      <div>
        {destinationFeatureOffered?.length ? (
          <section className="my-16 max-md:my-0 max-md:mb-4">
            <GuideThingsCardWrapper
              descriptionDetails={destinationFeatureOffered}
            />
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-16 max-md:my-10">
        <PlanContactBanner
          locale={locale}
          classes="my-10"
          title={planContactBanner.heading}
          description={`${planContactBanner.description1} ${destinationName} ${planContactBanner.description2}`}
          buttonText={button.getBespokePlan}
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
        />
      </section>
      <div>
        {blogs?.length ? (
          <section className="mt-16 max-md:mt-0 mb-40 max-md:mb-20">
            <SectionTitleHeader
              locale={locale}
              classes="mb-20 max-lg:mb-10"
              title={
                <>
                  <strong className="text-secondary-color !font-heading">
                    {sectionHeadings.blogs}
                  </strong>
                </>
              }
              buttonText={blogs.length > 3 ? button.browseAllInspiration : ""}
              buttonURL={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                destinationName
              )}`}
              buttonClick={(e: any) => {
                e.preventDefault();
                router.push(
                  `${WEB_ROUTES.DESTINATION}/${replaceSpacesWithDash(
                    destinationName as string
                  )}?tab=places-to-visit`
                );
                const headerHeight =
                  document.getElementsByTagName("header")[0]?.offsetHeight;
                const innerPageBanner = document.getElementById(
                  "innerPageBanner"
                ) as HTMLElement;
                scroll.scrollTo(innerPageBanner?.offsetHeight + headerHeight, {
                  duration: 500,
                  disableLerp: true,
                });
              }}
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
          </section>
        ) : (
          ""
        )}
      </div>
    </Container>
  );
}
