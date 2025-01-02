import MainHeading from "@template-components/heading";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import React from "react";
import { TourResponse } from "@utils/types";

const YouMightAlsoLike = ({
  locale,
  dictionary,
  tours,
  destination,
}: {
  locale: any;
  dictionary: any;
  destination?: string;
  tours?: TourResponse[];
}) => {
  const { button, destinationPage, sectionHeadings } = dictionary;
  return (
    <>
      <div data-scroll data-scroll-speed="1" data-scroll-direction="vertical">
        <MainHeading classes="mb-10">
          {sectionHeadings.youMightAlsoLike}
        </MainHeading>
      </div>
      <div data-scroll data-scroll-speed=".3" data-scroll-direction="vertical">
        <TourCardWrapper
          locale={locale}
          isSlider={true}
          tours={tours}
          destination={destination}
          dictionary={{ button, destinationPage }}
        />
      </div>
    </>
  );
};

export default YouMightAlsoLike;
