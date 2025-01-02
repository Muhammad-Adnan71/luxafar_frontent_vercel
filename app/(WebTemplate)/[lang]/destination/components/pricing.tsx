"use client";
import React, { useState } from "react";
import Button from "@template-components/button";
import TourBookingForm from "@template-components/modals/TourBookingForm";
import SideHeading from "@template-components/side-heading";
import Subheading from "@template-components/sub-heading";
import { cn, pathNameByLocale } from "@utils/functions";
import { WEB_ROUTES } from "@utils/constant";

import { getCookie } from "cookies-next";

const Pricing = ({
  classes,
  price,
  days,
  airFairIncluded,
  dictionary,
  tourId,
}: {
  tourId?: number;
  dictionary: any;
  airFairIncluded?: boolean;
  classes?: string;
  price: number;
  days: string;
}) => {
  const { placeholder, destinationPage, button, successModal, errors, locale } =
    dictionary;
  const error = errors;

  return (
    <>
      <div
        className={cn([
          "max-h-[525px]  p-12 xl:px-14 max-xl:p-8 max-lg:mx-auto max-lg:p-6 max-md:p-12 max-sm:px-6 max-sm:py-8 bg-quaternary-color text-center " +
            classes,
        ])}
      >
        <div className="px-8 py-6 border-[1px] max-sm:px-3 border-secondary-color !text-center mb-8">
          <SideHeading classes="!static !text-[9px]" isRotate={false}>
            {destinationPage.pricingFrom}
          </SideHeading>
          <Subheading classes="text-[60px] mb-[2px] font-[700]">
            ${price}
          </Subheading>
          <SideHeading classes="!static mb-3 !text-[9px]" isRotate={false}>
            {destinationPage.pricingPerPerson}
          </SideHeading>
          {airFairIncluded ? (
            <p className="bg-primary-color w-fit capitalize text-secondary-color text-[12px] mx-auto mb-2 p-2 ">
              *{destinationPage.airFareIncluded}
            </p>
          ) : (
            <p className="bg-primary-color w-fit capitalize text-secondary-color text-[12px] mx-auto mb-2 p-2 ">
              *{destinationPage.airFareNotIncluded}
            </p>
          )}
          <SideHeading
            isRotate={false}
            classes="!text-secondary-color !opacity-100 !block !static mb-4 text-[18px] !text-center"
          >
            {days} {destinationPage.datesAndPricesDays}
          </SideHeading>
          <TourBookingForm
            tourId={tourId}
            dictionary={{
              placeholder,
              destinationPage,
              button,
              successModal,
              error,
              locale,
            }}
          />
        </div>
        <div className="max-sm:w-4/5 max-[380px]:w-full max-sm:mx-auto">
          <Subheading
            classes={`text-white 2xl:text-[30px] xl:text-[26px] sm:!whitespace-nowrap text-center ${
              locale === "ru"
                ? "sm:!whitespace-normal"
                : "sm:!whitespace-nowrap"
            }`}
          >
            {destinationPage.pricingYourOwnAdventure}
          </Subheading>
          <div className="mx-auto sm:px-8">
            <Button
              redirect={pathNameByLocale(locale, WEB_ROUTES.BESPOKE_HOLIDAY)}
              classes={`${
                locale !== "en" ? "text-[11px] !capitalize px-3" : ""
              } xl:text-[11px] w-full mx-auto max-sm:w-fit !py-4`}
              text={button.preferCustomTour}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
