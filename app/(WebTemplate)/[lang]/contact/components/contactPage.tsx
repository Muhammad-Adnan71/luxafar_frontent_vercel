import React from "react";
import Breadcrumbs from "@template-components/breadcrumbs";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import Container from "components/template/container";
import PlanContactBanner from "@template-components/planContactBanner";
import MainHeadingContent from "@template-components/mainHeadingContent";
import { getDictionary } from "@utils/dictionary";
import { i18n } from "i18n.config";
import { WEB_ROUTES } from "@utils/constant";
import {
  getLocaleCookie,
  pathNameByLocale,
  removeParaTagsFromString,
} from "@utils/functions";
import Form from "./form";
import { cookies } from "next/headers";

async function ContactPage({ page, locale }: { page: any; locale?: any }) {
  const {
    planContactBanner,
    button,
    breadCrumb,
    placeholder,
    successModal,
    errors,
  } = await getDictionary(locale);
  console.log(page,"asdnasdlaskdansfkmdnakms");
  const getCookie = cookies();
  const breadCrumbs = [
    { name: breadCrumb.home, url: pathNameByLocale(locale, "/") },
    {
      name: breadCrumb.contactUs,
      url: pathNameByLocale(locale, WEB_ROUTES.CONTACT),
    },
  ];
  const metaDescription = removeParaTagsFromString(page?.page?.description);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://luxafar.com/contact",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Contact",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: "https://luxafar.com/contact",
    image: "https://luxafar.com/template/logo.png",
    description: metaDescription,
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };
  const { content, ...rest } = page;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container classes="pb-20">
        <Breadcrumbs breadcrumbs={breadCrumbs} classes="mb-10 max-sm:hidden" />
        <div className=" flex gap-10 max-[900px]:flex-col">
          <div className="w-[50%] max-[900px]:w-full">
            <div
              data-scroll
              data-scroll-speed="1"
              data-scroll-direction="vertical"
            >
              <MainHeading
                isHeadingH1={true}
                classes={`mb-10 max-sm:!text-[43px]  ${
                  locale === "ru"
                    ? "max-sm:!text-[36px] max-[1535px]:text-[62px]"
                    : "max-sm:!text-[43px] max-[1535px]:text-[80px]"
                }`}
              >
                <MainHeadingContent content={content?.[0].title} />
              </MainHeading>
            </div>

            <Paragraph htmlText={content?.[0].description} />
          </div>
          <div className="w-[50%] max-[900px]:w-full">
            <Form locale={{ button, placeholder, successModal, errors }} />
          </div>
        </div>
        <div className="py-20 max-sm:pt-10 max-sm:pb-0">
          <PlanContactBanner
            classes="my-10 px-[5%]"
            title={planContactBanner.heading2}
            description={planContactBanner.description}
            buttonText={button.getBespokePlan}
            buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
            locale={locale}
          />
        </div>
      </Container>
    </>
  );
}

export default ContactPage;
