import { getDictionary } from "@utils/dictionary";
import { getLocaleCookie } from "@utils/functions";
import { cookies } from "next/headers";
import React from "react";
import BecomePartnerForm from "./becomePartnerForm";
import { i18n } from "i18n.config";

async function BecomePartnerPage({
  questions,
  locale = i18n.defaultLocale,
}: {
  questions: any;
  locale?: any;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://luxafar.com/become-a-partner",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Become a Partner",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: "https://luxafar.com/become-a-partner",
    image: "https://luxafar.com/template/logo.png",
    description: "metaDescription",
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };

  const {
    button,
    breadCrumb,
    becomeAPartnerPage,
    placeholder,
    successModal,
    errors,
  } = await getDictionary(locale);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BecomePartnerForm
        questions={questions}
        dictionary={{
          button,
          breadCrumb,
          becomeAPartnerPage,
          placeholder,
          successModal,
          errors,
          locale,
        }}
      />
    </div>
  );
}

export default BecomePartnerPage;
