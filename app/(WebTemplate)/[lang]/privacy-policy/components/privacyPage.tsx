import { WEB_ROUTES } from "@utils/constant";
import {
  getLocaleCookie,
  pathNameByLocale,
  removeParaTagsFromString,
} from "@utils/functions";
import React from "react";
import Breadcrumbs from "@template-components/breadcrumbs";
import MainHeading from "@template-components/heading";
import MainHeadingContent from "@template-components/mainHeadingContent";
import Paragraph from "@template-components/paragraph";
import Subheading from "@template-components/sub-heading";
import Container from "components/template/container";
import { cookies } from "next/headers";
import { getDictionary } from "@utils/dictionary";
import { i18n } from "i18n.config";

async function PrivacyPage({
  page,
  locale = i18n.defaultLocale,
}: {
  page: any;
  locale?: any;
}) {
  const { content, ...rest } = page;
  const metaDescription = removeParaTagsFromString(page?.page?.description);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://luxafar.com/privacy-policy",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Privacy Policy",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: "https://luxafar.com/privacy-policy",
    image: "https://luxafar.com/template/logo.png",
    description: metaDescription,
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };

  const { planContactBanner, button, sectionHeadings, breadCrumb } =
    await getDictionary(locale);
  const breadCrumbs = [
    { name: breadCrumb.home, url: pathNameByLocale(locale, "/") },
    {
      name: breadCrumb.privacyPolicy,
      url: pathNameByLocale(locale, WEB_ROUTES.PRIVACY_POLICY),
    },
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container classes="pb-20">
        <Breadcrumbs breadcrumbs={breadCrumbs} classes="mb-10 max-sm:hidden" />
        <div
          data-scroll
          data-scroll-speed="-0.3"
          data-scroll-direction="vertical"
        >
          <MainHeading
            isHeadingH1={true}
            classes={`mb-8 max-sm:mb-6 ${
              locale === "ru" ? "max-sm:!text-[28px]" : ""
            }`}
          >
            <MainHeadingContent content={content?.[0]?.title} />
          </MainHeading>
        </div>
        <Paragraph
          classes="mb-10"
          htmlText={content?.[0]?.description}
        ></Paragraph>

        <>
          {content?.map((item: any, index: number) => {
            if (index !== 0) {
              return (
                <div key={index}>
                  <div
                    data-scroll
                    data-scroll-speed=".5"
                    data-scroll-direction="veritcal"
                  >
                    <Subheading classes="font-[600] max-sm:text-[24px]">
                      {item.title}
                    </Subheading>
                  </div>
                  <Paragraph
                    classes="mb-10"
                    htmlText={item.description}
                  ></Paragraph>
                </div>
              );
            }
          })}
        </>
      </Container>
    </>
  );
}

export default PrivacyPage;
