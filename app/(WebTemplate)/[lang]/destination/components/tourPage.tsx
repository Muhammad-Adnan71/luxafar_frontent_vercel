import React from "react";

import { WEB_ROUTES } from "@utils/constant";
import Overview from "../components/overview";
import DayToDayItinerary from "../components/dayToDayItinerary";
import DatesAndPrices from "../components/datesAndPrices";
import WhatToExpect from "../components/whatToExpect";
import {
  pathNameByLocale,
  removeParaTagsFromString,
  replaceSpacesWithDash,
  truncateText,
} from "@utils/functions";
import InnerPageBanner from "@template-components/innerPageBanner";
import Tabs from "@template-components/tabs";
import { getDictionary } from "@utils/dictionary";
import { i18n } from "i18n.config";
async function TourPage({
  tourResponse,
  destinationNameString,
  name,
  locale = i18n.defaultLocale,
}: {
  locale?: any;
  destinationNameString: string;
  tourResponse: any;
  name: string;
}) {
  const {
    button,
    breadCrumb,
    destinationPage,
    placeholder,
    successModal,
    sectionHeadings,
    tabsContents,
    errors,
  } = await getDictionary(locale);
  const tabsContent = [
    {
      label: tabsContents.overview,
      value: "overview",
      content: (
        <Overview
          dictionary={{
            button,
            destinationPage,
            placeholder,
            sectionHeadings,
            successModal,
            errors,
            locale,
          }}
          holidayTypeId={
            tourResponse?.data?.tour?.tourHoliDayType?.holidayType?.id
          }
          tourId={tourResponse?.data?.tour?.ToursTranslation?.[0]?.tourId}
          airFairIncluded={tourResponse.data.tour.airFairIncluded}
          title={tourResponse?.data?.tour?.overviewTitle}
          description={tourResponse?.data?.tour?.overviewDescription}
          noOfDays={tourResponse?.data?.tour?.planDays}
          price={tourResponse?.data?.tour?.price}
          highlights={tourResponse?.data?.tour?.highlights}
          relatedTours={tourResponse.data.relatedTours}
          inspirations={tourResponse.data.inspirations}
          inspirationCount={tourResponse?.data?.inspirationCount}
          destination={destinationNameString}
        />
      ),
    },
    {
      label: tabsContents.dayToDayItinerary,
      value: "dayToDayItinerary",
      content: (
        <DayToDayItinerary
          dictionary={{
            button,
            destinationPage,
            placeholder,
            sectionHeadings,
            locale,
            successModal,
          }}
          tourId={tourResponse?.data?.tour?.ToursTranslation?.[0]?.tourId}
          relatedTours={tourResponse.data.relatedTours}
          inspirations={tourResponse.data.inspirations}
          airFairIncluded={tourResponse.data.tour.airFairIncluded}
          noOfDays={tourResponse?.data?.tour?.planDays}
          price={tourResponse?.data?.tour?.price}
          tourScheduleData={tourResponse?.data?.tour?.dayToDayItinerary?.map(
            (item: any) => ({
              place: item?.destination,
              hotel: item?.accommodation,
              acitvity: item?.description,
            })
          )}
          accommodationImage={
            tourResponse?.data?.tour?.accommodationImageMedia?.desktopMediaUrl
          }
          inspirationCount={tourResponse?.data?.inspirationCount}
          destination={destinationNameString}
        />
      ),
    },
    {
      label: tabsContents.datesAndPrices,
      value: "datesAndPrices",
      content: (
        <DatesAndPrices
          dictionary={{
            button,
            destinationPage,
            placeholder,
            sectionHeadings,
            successModal,
            locale,
          }}
          tourId={tourResponse?.data?.tour?.ToursTranslation?.[0]?.tourId}
          makeItPrivateDescription={
            tourResponse.data.tour.makeItPrivateDescription
          }
          supplementPolicy={tourResponse.data.tour.supplementPolicy}
          priceTitle={tourResponse.data.tour.pricingTitle}
          priceDescription={tourResponse.data.tour.pricingDescription}
          planServices={tourResponse.data.tour.planService}
          privatePlan={tourResponse.data.tour.privatePlan}
          airFairIncluded={tourResponse.data.tour.airFairIncluded}
          noOfDays={tourResponse?.data?.tour?.planDays}
          price={tourResponse?.data?.tour?.price}
          relatedTours={tourResponse.data.relatedTours}
          inspirations={tourResponse.data.inspirations}
          inspirationCount={tourResponse?.data?.inspirationCount}
          destination={destinationNameString}
        />
      ),
    },
    {
      label: tabsContents.whatToExpect,
      value: "whatToExpect",
      content: (
        <WhatToExpect
          dictionary={{
            button,
            destinationPage,
            sectionHeadings,
            placeholder,
            successModal,
            locale,
          }}
          tourId={tourResponse?.data?.tour?.ToursTranslation?.[0]?.tourId}
          relatedTours={tourResponse.data.relatedTours}
          inspirations={tourResponse.data.inspirations}
          airFairIncluded={tourResponse.data.tour.airFairIncluded}
          noOfDays={tourResponse?.data?.tour?.planDays}
          price={tourResponse?.data?.tour?.price}
          cuisineDescription={tourResponse?.data?.tour?.cuisineDescription}
          departurePoint={tourResponse?.data?.tour?.departurePoint}
          meetingPoint={tourResponse?.data?.tour?.meetingPoint}
          physicalActivityDescription={
            tourResponse?.data?.tour?.physicalActivityDescription
          }
          travelingFromDescription={
            tourResponse?.data?.tour?.travelingFromDescription
          }
          weatherDescription={tourResponse?.data?.tour?.weatherDescription}
          whenToGoDescription={tourResponse?.data?.tour?.whenToGoDescription}
          inspirationCount={tourResponse?.data?.inspirationCount}
          destination={destinationNameString}
        />
      ),
    },
  ];

  const tourTitle = tourResponse?.data?.tour?.title;
  const breadcrumbs = [
    { name: breadCrumb.home, url: pathNameByLocale(locale, "/") },

    { name: tourTitle ? tourTitle : "", url: "" },
  ];
  let isMobile;
  if (typeof window !== "undefined") {
    isMobile = window && window.screen.width < 640;
  }
  const metaDescription = removeParaTagsFromString(
    tourResponse?.data?.tour?.seoMeta?.description as string
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/${replaceSpacesWithDash(
        tourResponse?.data?.tour?.seoMeta?.slug
      )}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Tours",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: `https://luxafar.com/${replaceSpacesWithDash(
      tourResponse?.data?.tour?.seoMeta?.slug
    )}`,
    image: "https://luxafar.com/template/logo.png",
    description: metaDescription,
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InnerPageBanner
        breadcrumbs={breadcrumbs}
        altText={
          tourResponse?.data?.tour?.title + "" + "Luxafar Tour Banner Image"
        }
        image={
          isMobile
            ? tourResponse.data.tour.bannerImageMedia?.mobileMediaUrl
              ? tourResponse.data.tour.bannerImageMedia?.mobileMediaUrl
              : tourResponse.data.tour.bannerImageMedia?.desktopMediaUrl
            : tourResponse.data.tour.bannerImageMedia?.desktopMediaUrl
        }
        mainHeading={
          <span
            className={`
            ${
              tourResponse?.data?.tour?.title &&
              tourResponse?.data?.tour?.title?.length > 50
                ? "md:w-[800px]"
                : "md:w-[600px]"
            }
             block max-sm:text-center max-sm:w-[250px]`}
          >
            {truncateText(tourResponse?.data?.tour?.title, 40)}
          </span>
        }
        buttonText="Back to tours"
        buttonLink={`/${pathNameByLocale(
          locale,
          `/${replaceSpacesWithDash(
            tourResponse?.data?.tour?.destination?.name as string
          )}`
        )}?tab=tours`}
        description=""
        detailPage={true}
      />
      <Tabs
        detailPage={true}
        defaultValue={"overview"}
        tabsContent={tabsContent}
      />
    </>
  );
}

export default TourPage;
