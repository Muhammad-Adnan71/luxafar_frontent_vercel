import React from "react";

import HolidayBanner from "../components/holidayBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";

import { WEB_ROUTES } from "@utils/constant";
import { Locale, i18n } from "i18n.config";
import { getDictionary } from "@utils/dictionary";
import Container from "components/template/container";
import ThingsSection from "@template-components/thingsSection";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import PlanContactBanner from "@template-components/planContactBanner";
import { cookies } from "next/headers";
import {
  getLocaleCookie,
  pathNameByLocale,
  truncateText,
} from "@utils/functions";
async function HolidayPage({
  response,
  locale = i18n.defaultLocale,
  responseHolidayType,
}: {
  locale?: any;
  response: any;
  responseHolidayType: any;
}) {
  const {
    sectionHeadings,
    button,
    holidayTypePage,
    planContactBanner,
    breadCrumb,
  } = await getDictionary(locale);
  const breadCrumbs = [
    {
      name: breadCrumb.home,
      url: pathNameByLocale(locale, "/"),
    },
    {
      name: breadCrumb.holidayType,
      url: pathNameByLocale(locale, WEB_ROUTES.HOLIDAY_TYPES),
    },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/holiday-types}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Holiday Type",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: `https://luxafar.com/holiday-types`,
    image: "https://luxafar.com/template/logo.png",
    description: response?.data?.page?.seoMeta?.description,
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
      <HolidayBanner
        locale={locale}
        image={response?.data?.page?.content?.[0]?.media?.desktopMediaUrl}
        title={holidayTypePage.bannerHeading}
        mobileImage={response?.data?.page?.content?.[0]?.media?.mobileMediaUrl}
        breadcrumbs={breadCrumbs}
        buttonText={button.getBespokePlan}
        buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
      />
      <Container>
        <div className="py-10">
          <SectionTitleHeader
            classes="mb-10"
            title={
              <>
                {holidayTypePage.chooseYour}
                <strong className="block text-secondary-color !font-heading">
                  {holidayTypePage.HolidayType}
                </strong>
              </>
            }
          />
          {responseHolidayType?.data?.holidayTypes?.map(
            (item: any, index: number) => (
              <div key={index} className="pb-10">
                <ThingsSection
                  locale={locale}
                  headingClasses="w-full max-2xl:!text-[46px]"
                  classes={`bg-quaternary-color  max-lg:[&>.txtPadding]:px-10 max-sm:[&>.txtPadding]:px-6 max-lg:[&>.txtPadding]:pb-10 ${
                    index % 2 !== 0 ? "lg:pl-10" : "lg:pr-10"
                  }`}
                  title={item?.name}
                  image={item?.media}
                  description={truncateText(item?.description, 270)}
                  buttonText={button.learnMore}
                  buttonURL={`${WEB_ROUTES.HOLIDAY_TYPES}/${item?.seoMeta?.slug}`}
                  imgRight={index % 2 !== 0}
                />
              </div>
            )
          )}
        </div>
        <div>
          {responseHolidayType?.data?.inspirations?.length ? (
            <div className="my-10 max-md:mt-0">
              <SectionTitleHeader
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
                showAll={true}
                blogs={responseHolidayType?.data?.inspirations}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <section className="my-16 max-md:mt-0">
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

export default HolidayPage;
