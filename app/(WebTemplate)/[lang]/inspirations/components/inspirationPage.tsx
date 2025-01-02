import { getDictionary } from "@utils/dictionary";
import { i18n } from "i18n.config";
import React from "react";
import InspirationsComponent from "./inspirationsComponent";
import { cookies } from "next/headers";
import { getLocaleCookie } from "@utils/functions";

async function InspirationPage({
  inspirations,
  locale = i18n.defaultLocale,
}: {
  inspirations: any;
  locale?: any;
}) {
  const {
    button,
    placeholder,
    dropdown,
    inspirationPage,
    planContactBanner,
    breadCrumb,
  } = await getDictionary(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://luxafar.com/inspirations",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Inspirations",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: "https://luxafar.com/inspirations",
    image: "https://luxafar.com/template/logo.png",
    description: "metaDescription",
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
      <InspirationsComponent
        dictionary={{
          button,
          placeholder,
          dropdown,
          inspirationPage,
          planContactBanner,
          breadCrumb,
          locale,
        }}
        featuredInspirations={inspirations?.data?.featuredInspirations}
        inspirations={inspirations.data.inspirations}
        rowCount={inspirations.count}
      />
    </>
  );
}

export default InspirationPage;
