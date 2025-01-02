import {
  getLocaleCookie,
  removeParaTagsFromString,
  replaceSpacesWithDash,
} from "@utils/functions";
import React from "react";
import PlaceDetails from "./placeDetails";
import { cookies } from "next/headers";
import { getDictionary } from "@utils/dictionary";
import { i18n } from "i18n.config";

async function PlacePage({
  response,
  destinationNameString,
  locale = i18n.defaultLocale,
}: {
  locale?: any;
  response: any;
  destinationNameString: string;
}) {
  const metaDescription = removeParaTagsFromString(
    response?.data?.place?.seoMeta?.description as string
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/${replaceSpacesWithDash(
        response?.data?.place?.seoMeta?.slug
      )}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Places",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: `https://luxafar.com/${replaceSpacesWithDash(
      response?.data?.place?.seoMeta?.slug
    )}`,
    image: "https://luxafar.com/template/logo.png",
    description: metaDescription,
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };

  const {
    planContactBanner,
    button,
    breadCrumb,
    tabsContents,
    destinationPage,
    sectionHeadings,
  } = await getDictionary(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlaceDetails
        data={response.data}
        destination={destinationNameString}
        dictionary={{
          planContactBanner,
          button,
          breadCrumb,
          tabsContents,
          destinationPage,
          sectionHeadings,
          locale,
        }}
      />
      ;
    </>
  );
}

export default PlacePage;
