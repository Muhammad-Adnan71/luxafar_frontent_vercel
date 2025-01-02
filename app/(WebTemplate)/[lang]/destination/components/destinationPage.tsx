import React from "react";
import DestinationComponent from "./destinationComponent";
import {
  getLocaleCookie,
  removeParaTagsFromString,
  replaceSpacesWithDash,
} from "@utils/functions";
import { cookies } from "next/headers";
import { getDictionary } from "@utils/dictionary";
import { i18n } from "i18n.config";

async function DestinationPage({
  response,
  locale = i18n.defaultLocale,
}: {
  response: any;
  locale?: any;
}) {
  const {
    planContactBanner,
    button,
    breadCrumb,
    destinationPage,
    placeholder,
    radioButton,
    successModal,
    tabsContents,
    sectionHeadings,
    sectionHeadings: { testimonialClientLove },
    errors,
  } = await getDictionary(locale);

  const metaDescription = removeParaTagsFromString(
    response?.data?.destination?.seoMeta?.description as string
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/${replaceSpacesWithDash(
        response?.data?.destination?.name
      )}`,
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
    url: `https://luxafar.com/${replaceSpacesWithDash(
      response?.data?.destination?.name
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
      <DestinationComponent
        dictionary={{
          tabsContents,
          planContactBanner,
          button,
          breadCrumb,
          destinationPage,
          placeholder,
          radioButton,
          successModal,
          sectionHeadings,
          errors,
          locale,
        }}
        destination={response?.data.destination}
        holidayTypes={response?.data.holidayTypes}
      />
    </>
  );
}

export default DestinationPage;
