import { getDictionary } from "@utils/dictionary";
import { getLocaleCookie } from "@utils/functions";
import BespokeForm from "components/template/bespokeForm";
import { i18n } from "i18n.config";
import { cookies } from "next/headers";
import React from "react";

async function BespokeHolidayPage({
  questions,
  locale = i18n.defaultLocale,
}: {
  locale?: any;
  questions: any;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://luxafar.com/bespoke-holiday",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Bespoke Holiday",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: "https://luxafar.com/bespoke-holiday",
    image: "https://luxafar.com/template/logo.png",
    description: "metaDescription",
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };

  const {
    planContactBanner,
    button,
    breadCrumb,
    bespokePage,
    successModal,
    placeholder,
    errors,
  } = await getDictionary(locale);
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BespokeForm
        questions={questions}
        dictionary={{
          errors,
          planContactBanner,
          button,
          breadCrumb,
          successModal,
          placeholder,
          bespokePage,
          locale,
        }}
      />
    </div>
  );
}

export default BespokeHolidayPage;
