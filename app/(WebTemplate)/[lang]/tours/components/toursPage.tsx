import React from "react";

import ToursComponent from "../components/toursComponent";
import {
  BespokeQuestionResponse,
  InspirationResponse,
  TourResponse,
} from "@utils/types";
import { cookies } from "next/headers";
import { getLocaleCookie } from "@utils/functions";
import { getDictionary } from "@utils/dictionary";
import { i18n } from "i18n.config";

async function ToursPage({
  tours,
  featuredTours,
  rowCount,
  upcomingTours,
  inspirations,
  questions,
  page,
  locale = i18n.defaultLocale,
}: {
  locale?: any;
  page: any;
  inspirations: InspirationResponse[];
  featuredTours: TourResponse[];
  upcomingTours: TourResponse[];
  rowCount: number;
  tours: TourResponse[];
  questions: BespokeQuestionResponse[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      // "@id": `https://luxafar.com/${replaceSpacesWithDash(
      //   response?.data?.destination?.name
      // )}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Destination",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    // url: `https://luxafar.com/${replaceSpacesWithDash(
    //   response?.data?.destination?.name
    // )}`,
    image: "https://luxafar.com/template/logo.png",
    // description: metaDescription,
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };

  const {
    planContactBanner,
    errors,
    sectionHeadings,
    breadCrumb,
    placeholder,
    toursPage,
    dropdown,
    bespokePage,
    button,
    destinationPage,
  } = await getDictionary(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToursComponent
        page={page}
        featuredTours={featuredTours}
        tours={tours}
        upcomingTours={upcomingTours}
        inspirations={inspirations}
        rowCount={rowCount}
        questions={questions}
        dictionary={{
          destinationPage,
          breadCrumb,
          toursPage,
          planContactBanner,
          button,
          sectionHeadings,
          dropdown,
          errors,
          placeholder,
          locale,
          bespokePage,
        }}
      />
    </>
  );
}

export default ToursPage;
