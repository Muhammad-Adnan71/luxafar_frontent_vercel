import React from "react";

import Container from "components/template/container";
import Paragraph from "@template-components/paragraph";
import DetailsSection from "../components/detailsSection";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import { getDictionary } from "@utils/dictionary";
import { WEB_ROUTES } from "@utils/constant";
import { pathNameByLocale, removeParaTagsFromString } from "@utils/functions";
import BlogBanner from "../components/blog-banner";

async function InspirationDetailPage({
  inspiration,
  tours,
  params,
  locale,
}: {
  locale?: any;
  inspiration: any;
  tours: any;
  params: any;
}) {
  const {
    planContactBanner,
    button,
    sectionHeadings,
    breadCrumb,
    destinationPage,
  } = await getDictionary(locale);

  const breadcrumbs = [
    {
      name: breadCrumb.home,
      url: pathNameByLocale(locale, "/"),
    },
    {
      name: breadCrumb.blogs,
      url: pathNameByLocale(locale, WEB_ROUTES.INSPIRATIONS),
    },

    {
      name: inspiration?.title,
      url: "",
    },
  ];

  const metaDescription = removeParaTagsFromString(
    inspiration.seoMeta.description as string
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/${inspiration.seoMeta.slug}`,
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
    url: `https://luxafar.com/${inspiration.seoMeta.slug}`,
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
      <BlogBanner
        classes="h-[calc(100vh_-_330px)]"
        altText={inspiration?.title ? inspiration?.title + " " + "Luxafar" : ""}
        image={inspiration?.media?.desktopMediaUrl}
        mobileImage={inspiration?.media?.mobileMediaUrl}
        breadcrumbs={breadcrumbs}
        holidayTypeId={inspiration?.holidayType[0]?.id}
      />
      <Container classes="py-10 pb-16">
        <h1 className="font-heading text-secondary-color capitalize text-[42px] max-sm:text-[23px] max-lg:w-full font-[600] w-[50%] mb-10">
          {inspiration?.title}
        </h1>
        <Paragraph htmlText={inspiration?.description}></Paragraph>

        <>
          {inspiration?.inspirationDetail?.map((item: any, index: number) => {
            return (
              <DetailsSection
                mobileImage={item?.media?.mobileMediaUrl}
                key={index}
                title={item?.title}
                image={item?.media?.desktopMediaUrl}
                description={item?.description}
              />
            );
          })}
        </>
        <PlanContactBanner
          classes="my-16 max-md:mt-12 max-md:mb-8"
          title={planContactBanner.heading}
          description={planContactBanner.description}
          buttonText={button.getBespokePlan}
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
          locale={locale}
        />
        <div>
          {tours?.length ? (
            <div className="my-10">
              <SectionTitleHeader
                classes="mb-10"
                title={sectionHeadings.youMightAlsoLike}
              />
              <TourCardWrapper
                locale={locale}
                tours={tours}
                dictionary={{ button, destinationPage }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </Container>
    </>
  );
}

export default InspirationDetailPage;
