/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Button from "@template-components/button";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import Container from "components/template/container";
import Subheading from "@template-components/sub-heading";
import YouMightAlsoLike from "./youMightAlsoLike";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import ArticlesForYourGuidance from "./articlesForYourGuidance";
import PlaceCardWrapper from "components/template/container/placeCardWrapper";
import MainHeadingContent from "@template-components/mainHeadingContent";
import {
  pathNameByLocale,
  replaceSpacesWithDash,
  truncateText,
} from "@utils/functions";
import ImageWithLoader from "@template-components/ImageWithLoader";
import InnerPageBanner from "@template-components/innerPageBanner";
import Tabs from "@template-components/tabs";
import { useRouter } from "next/navigation";
import { WEB_ROUTES } from "@utils/constant";

const PlaceDetails = ({
  data,
  destination,
  dictionary,
}: {
  dictionary: any;
  data: {
    place: any;
    places: any;
    recommendedTours: any;
    inspirations: any;
    inspirationsCount: any;
  };
  destination: string;
}) => {
  const {
    planContactBanner,
    button,
    breadCrumb,
    tabsContents,
    destinationPage,
    sectionHeadings,
    locale,
  } = dictionary;
  const router = useRouter();
  let isMobile;
  if (typeof window !== "undefined") {
    isMobile = window && window.screen.width < 640;
  }

  const destinationName =
    data?.place?.destination?.name.charAt(0).toUpperCase() +
    data?.place?.destination?.name.slice(1);

  const breadcrumbs = [
    { name: breadCrumb.home, url: pathNameByLocale(locale, "/") },
    {
      name: data?.place?.title,
      url: "",
    },
  ];
  const bannerImage = data?.place?.destination?.content?.find(
    (ele: any) => ele.name.toLocaleLowerCase() === "places to visit"
  );

  const tabsContent = [
    {
      label: tabsContents.travelGuide,
      value: "travel-guide",
      onClick: () => {
        router.push(
          pathNameByLocale(
            locale,
            `/${replaceSpacesWithDash(
              data?.place?.destination?.name
            )}?tab=travel-guide`
          )
        );
      },

      content: <div className="h-[50vh]"></div>,
    },
    {
      label: tabsContents.tours,
      value: "tours",
      content: <div className="h-[50vh]"></div>,
      onClick: () => {
        router.push(
          pathNameByLocale(
            locale,
            `/${replaceSpacesWithDash(
              data?.place?.destination?.name
            )}?tab=tours`
          )
        );
      },
    },
    {
      label: tabsContents.placesToVisit,
      value: "places-to-visit",
      content: (
        <Container classes="my-16">
          <div className="flex gap-x-10 lg:min-h-[500px] max-lg:gap-y-9 max-lg:flex-col justify-between max-2xl:gap-x-20 mb-16">
            <div className="w-1/2 max-lg:order-2 max-lg:w-full">
              <MainHeading classes="inline-block mb-10">
                <MainHeadingContent content={data?.place?.title} />
              </MainHeading>
              <Paragraph
                classes="mb-10"
                htmlText={data?.place?.description}
              ></Paragraph>

              <Button
                text={button.getBespokePlan}
                redirect={pathNameByLocale(locale, WEB_ROUTES.BESPOKE_HOLIDAY)}
              />
            </div>
            {/* <div className="w-[350px] max-sm:w-[260px] max-md:order-1 max-md:mb-16 max-md:mx-auto max-lg:self-baseline lg:h-full border-[1px] border-secondary-color max-sm:p-6 p-9">
          <div className="w-fit mx-auto box-content mb-6  overflow-hidden">
            <img
              loading="lazy"
              className="w-[270px] max-[900px]:w-[230px] max-[900px]:h-[230px] max-sm:w-[200px] max-sm:h-[200px] h-[270px]  rounded-[50%] object-cover object-top"
              src={data?.place?.reviews?.[0]?.media?.desktopMediaUrl}
              alt="Place Card Image"
            />
          </div>
          <div className="text-center">
            <Paragraph
              classes="text-center mb-8"
              htmlText={data?.place?.reviews?.[0]?.description}
            ></Paragraph>
            <NameHeading className="mb-1">
              {data?.place?.reviews?.[0]?.name}
            </NameHeading>
            <Paragraph classes="mb-0">
              {data?.place?.reviews?.[0]?.location}
            </Paragraph>
          </div>
        </div> */}
            <div className="w-1/2 max-lg:w-full max-sm:h-[50vh] max-lg:order-1 lg:h-full max-md:mx-auto">
              <div className="w-full h-full">
                <ImageWithLoader
                  alt={
                    data?.place?.title
                      ? data?.place?.title + " " + "Luxafar Place Main Image"
                      : ""
                  }
                  classes="w-full h-full object-cover"
                  loading="eager"
                  url={
                    isMobile
                      ? data?.place?.media?.mobileMediaUrl
                        ? data?.place?.media?.mobileMediaUrl
                        : data?.place?.media?.desktopMediaUrl
                      : data?.place?.media?.desktopMediaUrl
                  }
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="w-1/2 max-md:w-full mb-12">
              <MainHeading classes="max-md:block inline-block mb-10 !text-[65px] max-xl:!text-[55px] max-lg:!text-[48px] max-md:!text-[40px] max-[380px]:!text-[35px] whitespace-nowrap">
                <span
                  dangerouslySetInnerHTML={{
                    __html: destinationPage.ideasForYourTrip,
                  }}
                ></span>
                <strong className="text-secondary-color whitespace-normal">
                  {data?.place?.title}
                </strong>
              </MainHeading>
              <Paragraph
                htmlText={data?.place?.attractionDescription}
              ></Paragraph>
            </div>
            <div className="w-full selectors mb-16 max-md:mb-0">
              {data?.place?.attraction?.map((place: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="mb-8 max-md:mb-0 flex max-lg:flex-col items-center  "
                  >
                    <div className="even:order-2 w-1/2 max-lg:w-full">
                      <picture>
                        <source
                          className=" object-cover max-sm:hidden"
                          srcSet={place?.media?.mobileMediaUrl}
                          media="(max-width:640px)"
                        />
                        <source
                          className={
                            "lg:relative z-[-1] max-w-[initial] max-lg:w-full w-[120%] object-cover sm:hidden"
                          }
                          srcSet={place?.media?.desktopMediaUrl}
                          media="(min-width:641px)"
                        />
                        <img
                          src={place?.media?.desktopMediaUrl}
                          alt={
                            place?.title
                              ? place?.title + " " + "Luxafar Attraction Image"
                              : ""
                          }
                          className="lg:relative z-[-1] max-w-[initial] max-lg:w-full w-[120%]"
                        />
                      </picture>
                    </div>
                    <div className="max-lg:relative max-lg:-top-20 max-sm:-top-16 bg-quaternary-color w-1/2 max-lg:w-[70%] max-md:w-4/5 p-12 max-xl:p-8 max-sm:px-4 max-sm:py-8 odd:order-1">
                      <Subheading
                        classes={`mb-8 max-md:mb-4  max-xl:text-[36px] max-md:text-[28px] font-[600]  ${
                          locale === "ru"
                            ? " max-sm:text-[21px] xl:text-[46px] overflow-x-hidden "
                            : "xl:text-[55px]"
                        }`}
                      >
                        <MainHeadingContent content={place?.title} />
                      </Subheading>
                      <Paragraph
                        classes="mb-0 md:line-clamp-4 max-md:line-clamp-[7] max-sm:text-[13px] max-sm:leading-[1.3]"
                        htmlText={place.description}
                      ></Paragraph>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {data?.recommendedTours.length ? (
            <div className="my-24 max-md:my-16 max-md:mt-0">
              <YouMightAlsoLike
                locale={locale}
                dictionary={{ button, destinationPage, sectionHeadings }}
                tours={data?.recommendedTours}
                destination={data?.place?.destination?.name}
              />
            </div>
          ) : (
            <></>
          )}
          <div className="mb-24 max-md:mb-16">
            <PlanContactBanner
              locale={locale}
              title={planContactBanner.heading2}
              description={`${planContactBanner.description1} ${destinationName} ${planContactBanner.description2}`}
              buttonText={button.getBespokePlan}
              buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
            />
          </div>
          <div className="mb-24 max-md:mb-16">
            <SectionTitleHeader
              classes="mb-20 max-lg:mb-10"
              title={sectionHeadings.recommendedPlaces}
            />
            <PlaceCardWrapper
              locale={locale}
              buttonText={button.readMore}
              places={data?.places}
            />
          </div>
          {data?.inspirations.length ? (
            <div className="mb-20">
              <ArticlesForYourGuidance
                dictionary={{ button, sectionHeadings, locale }}
                inspirations={data?.inspirations}
                destination={data?.place?.destination?.name}
                inspirationCount={data?.inspirationsCount}
              />
            </div>
          ) : (
            <></>
          )}
        </Container>
      ),
      onClick: () => {
        router.push(
          pathNameByLocale(
            locale,
            `/${replaceSpacesWithDash(
              data?.place?.destination?.name
            )}?tab=places-to-visit`
          )
        );
      },
    },
    {
      label: tabsContents.thingsTodDo,
      content: <div className="h-[50vh]"></div>,
      value: "things-to-do",
      onClick: () => {
        router.push(
          pathNameByLocale(
            locale,
            `/${replaceSpacesWithDash(
              data?.place?.destination?.name
            )}?tab=things-to-do`
          )
        );
      },
    },
    {
      label: tabsContents.seasonsToVisit,
      content: <div className="h-[50vh]"></div>,
      value: "seasons-to-visit",

      onClick: () => {
        router.push(
          pathNameByLocale(
            locale,
            `/${replaceSpacesWithDash(
              data?.place?.destination?.name
            )}?tab=seasons-to-visit`
          )
        );
      },
    },
  ];
  return (
    <>
      <InnerPageBanner
        breadcrumbs={breadcrumbs}
        image={
          isMobile
            ? bannerImage?.media?.mobileMediaUrl
              ? bannerImage?.media?.mobileMediaUrl
              : bannerImage?.media?.desktopMediaUrl
            : bannerImage?.media?.desktopMediaUrl
        }
        description={
          isMobile
            ? data?.place?.destination?.description
            : truncateText(data?.place?.destination?.description, 350)
        }
        mainHeading={data?.place?.destination?.name}
      />
      <Tabs
        locale={locale}
        defaultValue={"places-to-visit"}
        tabsContent={tabsContent}
      />
    </>
  );
};

export default PlaceDetails;
