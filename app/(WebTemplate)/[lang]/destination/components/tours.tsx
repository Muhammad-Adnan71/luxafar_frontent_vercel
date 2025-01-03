import React from "react";
import Gallery from "@template-components/gallery";
import PlanContactBanner from "@template-components/planContactBanner";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import Container from "components/template/container";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import Button from "@template-components/button";
import { InspirationResponse, TourResponse } from "@utils/types";
import { pathNameByLocale, replaceSpacesWithDash } from "@utils/functions";
import { WEB_ROUTES } from "@utils/constant";

export default function Tours({
  destination,
  tours,
  blogs,
  gallery,
  dictionary,
}: {
  dictionary: any;
  destination?: string;
  blogs?: InspirationResponse[];
  tours?: TourResponse[];
  gallery: any;
}) {
  const { planContactBanner, button, destinationPage, locale } = dictionary;
  const destinationName =
    destination && destination?.charAt(0).toUpperCase() + destination?.slice(1);

  return (
    <Container>
      <div>
        {tours?.length ? (
          <section className="mt-20 mb-14 max-md:mt-12">
            <SectionTitleHeader
              locale={locale}
              isHeadingAnimated={false}
              classes="mb-20 max-lg:mb-10"
              title={
                <>
                  {destinationPage.browseOur}
                  <strong className="block text-secondary-color !font-heading">
                    {destinationPage.toursTo} {destination}
                  </strong>
                </>
              }
            />
            <TourCardWrapper
              locale={locale}
              dictionary={{ button, destinationPage }}
              tours={tours}
              isExpandable={true}
            />
            {/* <div className="md:hidden text-center mt-10 mb-5">
              <Button
                classes="!text-[14px] max-sm:!text-[12px]"
                text="Browse All Tour"
              />
            </div> */}
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-16 mt-32 max-md:my-4">
        <PlanContactBanner
          locale={locale}
          title={planContactBanner.heading}
          description={`${planContactBanner.description1} ${destinationName} ${planContactBanner.description2}`}
          buttonText={button.getBespokePlan}
          buttonURL={WEB_ROUTES.BESPOKE_HOLIDAY}
        />
      </section>
      <div>
        {blogs?.length ? (
          <section className="my-16">
            <SectionTitleHeader
              locale={locale}
              classes="mb-20 max-lg:mb-10"
              buttonText={blogs.length > 3 ? button.seeAllInspiration : ""}
              buttonURL={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                destinationName
              )}`}
              title={
                <>
                  {destinationPage.articlesRelated}
                  <strong className="block text-secondary-color !font-heading">
                    {destinationPage.articlesRelatedTo} {destination}
                  </strong>
                </>
              }
            />
            <BlogCardWrapper
              readMore={button.readMore}
              locale={locale}
              showAll={true}
              blogs={blogs?.slice(0, 3)}
              destinationName={destinationName}
            />
            {blogs.length > 3 && (
              <div className="md:hidden text-center mt-10 max-sm:mt-14">
                <Button
                  redirect={pathNameByLocale(
                    locale,
                    `${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                      destinationName
                    )}`
                  )}
                  classes="!text-[14px] max-sm:!text-[11px]"
                  text={button.seeAllInspiration}
                />
              </div>
            )}
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-20 max-md:my-4" id="gallery">
        <SectionTitleHeader
          locale={locale}
          classes="mb-20 max-md:mb-14 "
          title={
            <>
              <strong className="inline-block text-secondary-color !font-heading">
                {destinationPage.gallery}
              </strong>
            </>
          }
        />
        <Gallery classes="mb-40 max-sm:mb-16" images={gallery} />
      </section>
    </Container>
  );
}
