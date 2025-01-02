import React from "react";

import HolidayBannerDetail from "../components/holidayBannerDetail";
import MainHeading from "@template-components/heading";
import Container from "components/template/container";
import Paragraph from "@template-components/paragraph";
import HolidaySlider from "../components/holidaySlider";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import PlanContactBanner from "@template-components/planContactBanner";
import { getDictionary } from "@utils/dictionary";
import { i18n } from "i18n.config";
import {
  getLocaleCookie,
  pathNameByLocale,
  removeParaTagsFromString,
  replaceSpacesWithDash,
} from "@utils/functions";
import { WEB_ROUTES } from "@utils/constant";
import MainHeadingContent from "@template-components/mainHeadingContent";
import { cookies } from "next/headers";

async function HolidayDetailPage({
  response,
  locale = i18n.defaultLocale,
}: {
  response: any;
  locale?: any;
}) {
  const {
    sectionHeadings,
    planContactBanner,
    breadCrumb,
    button,
    destinationPage,
  } = await getDictionary(locale);
  const metaDescription = removeParaTagsFromString(
    response?.data?.holidayType.seoMeta.description as string
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/${replaceSpacesWithDash(
        response?.data?.holidayType.seoMeta.slug
      )}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Holiday Types",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: `https://luxafar.com/${replaceSpacesWithDash(
      response?.data?.holidayType.seoMeta.slug
    )}`,
    image: "https://luxafar.com/template/logo.png",
    description: metaDescription,
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };

  const breadCrumbs = [
    {
      name: breadCrumb.home,
      url: pathNameByLocale(locale, "/"),
    },
    {
      name: breadCrumb.holidayType,
      url: pathNameByLocale(locale, WEB_ROUTES.HOLIDAY_TYPES),
    },
    {
      name: response?.data?.holidayType?.name,
      url: pathNameByLocale(
        locale,
        `${WEB_ROUTES.HOLIDAY_TYPES}/${replaceSpacesWithDash(
          response?.data?.holidayType?.seoMeta?.slug
        )}`
      ),
    },
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HolidayBannerDetail
        holidayTypeId={response?.data?.holidayType.id}
        title={response?.data?.holidayType.name}
        image={response?.data?.holidayType?.media?.desktopMediaUrl}
        mobileImage={response?.data?.holidayType?.media?.mobileMediaUrl}
        breadcrumbs={breadCrumbs}
        locale={locale}
      />
      <Container classes="py-10">
        <div className="flex md:items-center   gap-10 max-md:flex-col">
          <MainHeading
            classes={
              "xl:text-[56px] max-lg:text-[48px] max-sm:text-[42px] max-sm:leading-[0.9] w-[40%] max-md:w-full"
            }
          >
            <MainHeadingContent
              content={response?.data?.holidayType.mainSectionHeading}
            />
          </MainHeading>

          <div className="w-[60%] max-md:w-full">
            <Paragraph
              htmlText={response?.data?.holidayType.mainSectionDescription}
            />
          </div>
        </div>
        <div className="py-10 max-md:mb-0">
          <HolidaySlider slides={response?.data?.holidayType.highlights} />
        </div>
        <>
          {response?.data?.tours?.length > 0 ? (
            <div className="my-16 max-md:mb-8 max-md:mt-4">
              <SectionTitleHeader
                classes="mb-10"
                title={sectionHeadings.recommendedTours}
              />
              <TourCardWrapper
                locale={locale}
                tours={response.data.tours}
                dictionary={{ button, destinationPage }}
              />
            </div>
          ) : (
            ""
          )}
        </>
        <div>
          {response?.data?.inspirations.length ? (
            <section className="my-10 max-md:mb-8">
              <SectionTitleHeader
                locale={locale}
                classes=" my-10 mt-0 "
                title={
                  <>
                    <strong className="inline-block text-secondary-color !font-heading">
                      {sectionHeadings.blogs}
                    </strong>
                  </>
                }
              />
              <BlogCardWrapper
                readMore={button.readMore}
                locale={locale}
                blogs={response?.data?.inspirations}
              />
            </section>
          ) : (
            ""
          )}
        </div>
        <section className="my-16 max-md:mt-0 max-md:mb-8">
          <PlanContactBanner
            classes="my-10"
            title={planContactBanner.heading}
            description={planContactBanner.description}
            buttonText={button.getBespokePlan}
            buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
            locale={locale}
          />
        </section>
      </Container>
    </>
  );
}

export default HolidayDetailPage;
