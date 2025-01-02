"use client";
import React, { useEffect } from "react";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import Pricing from "./pricing";
import Container from "components/template/container";
import Highlights from "@template-components/highlights";
import Testimonials from "@template-components/testimonials";
import YouMightAlsoLike from "./youMightAlsoLike";
import ArticlesForYourGuidance from "./articlesForYourGuidance";
import {
  InspirationResponse,
  TestimonialResponse,
  TourResponse,
} from "@utils/types";
import useAdventure from "store/useAdventure";
const Overview = ({
  holidayTypeId,
  title,
  destination,
  description,
  price,
  airFairIncluded,
  noOfDays,
  highlights,
  tourId,
  relatedTours,
  inspirations,
  inspirationCount,
  dictionary,
}: {
  tourId?: number;
  holidayTypeId: number;
  dictionary: any;
  destination?: string;
  airFairIncluded?: boolean;
  relatedTours: TourResponse[];
  inspirations: InspirationResponse[];
  title?: string;
  description?: string;
  price?: string;
  noOfDays?: number;
  highlights?: any[];
  inspirationCount: number;
}) => {
  const {
    button,
    destinationPage,
    placeholder,
    sectionHeadings,
    successModal,
    errors,
    locale,
  } = dictionary;
  const { handleIsAdventure } = useAdventure();

  useEffect(() => {
    if ([2, 4, 5].includes(holidayTypeId)) {
      handleIsAdventure();
    }
  }, []);
  return (
    <div className="my-16 max-md:my-12">
      <Container>
        <div className="flex justify-between max-md:gap-y-14 max-md:flex-col ">
          <div className="w-[45%] max-md:order-2 max-md:w-full">
            <MainHeading classes=" pb-6 max-md:pb-0 max-sm:leading-[0.9]">
              <span
                dangerouslySetInnerHTML={{
                  __html: destinationPage.overviewAbout,
                }}
              ></span>
              &nbsp;
              <strong className="inline text-secondary-color !font-heading ">
                {destination}
              </strong>
            </MainHeading>

            <Paragraph htmlText={description} classes="pt-8 "></Paragraph>
          </div>
          <div className="flex h-full w-[40%] md:justify-end max-md:w-full max-xl:w-[45%] max-md:order-1">
            <Pricing
              dictionary={{
                button,
                destinationPage,
                placeholder,
                successModal,
                errors,
                locale,
              }}
              tourId={tourId}
              classes={`${locale === "ru" ? " max-h-max " : ""} `}
              airFairIncluded={airFairIncluded}
              days={`${noOfDays}`}
              price={price ? Number(price) : 0}
            />
          </div>
        </div>
        <div>
          <Highlights
            highlights={destinationPage.highlights}
            highlightsData={highlights}
          />
        </div>
      </Container>

      <Container>
        <div>
          {relatedTours?.length ? (
            <div className="my-16 max-md:mt-0">
              <YouMightAlsoLike
                locale={locale}
                dictionary={{ button, destinationPage, sectionHeadings }}
                tours={relatedTours}
                destination={destination}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          {inspirations?.length ? (
            <div className="my-16 max-md:mt-0">
              <ArticlesForYourGuidance
                dictionary={{ button, sectionHeadings, locale }}
                inspirations={inspirations}
                destination={destination}
                inspirationCount={inspirationCount}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </Container>
    </div>
  );
};

export default Overview;
