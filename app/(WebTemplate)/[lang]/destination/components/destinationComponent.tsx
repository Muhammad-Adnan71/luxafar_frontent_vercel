"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import InnerPageBanner from "@template-components/innerPageBanner";
import Tabs from "@template-components/tabs";
import BestTimeToVisit from "./bestTimeToVisit";
import ThingsToDo from "./thingsToDo";
import GetBespokePlane from "./getBespokePlane";
import Tours from "./tours";
import PlaceToVisit from "./placeToVisit";
import {
  pathNameByLocale,
  replaceSpacesWithDash,
  truncateText,
} from "@utils/functions";
import { HolidayTypesResponse } from "@utils/types";
import { WEB_ROUTES } from "@utils/constant";
import { getCookie } from "cookies-next";

function DestinationComponent({
  destination,
  holidayTypes,
  dictionary,
}: {
  dictionary: any;
  holidayTypes: HolidayTypesResponse[];
  destination: any;
}) {
  const {
    tabsContents,
    planContactBanner,
    button,
    breadCrumb,
    destinationPage,
    placeholder,
    radioButton,
    successModal,
    sectionHeadings,
    errors,
    locale,
  } = dictionary;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { scroll } = useLocomotiveScroll();
  const activeTab = searchParams.get("tab") as string;
  const pagesShowGalleryButton = [null, "travel-guide", "tours"];
  const [image, setImage] = useState<any>();
  const scrollToHash = (event: any, element_id: string, offset: number) => {
    event.preventDefault();

    const element = document.getElementById(element_id) as HTMLElement;
    const elementPositionOnWindow: number = element?.getBoundingClientRect().y;
    scroll.scrollTo(elementPositionOnWindow - offset, {
      duration: 500,
      disableLerp: true,
    });
  };

  const getBespokePlan = destination?.content?.find(
    (item: any) => item?.name === "get bespoke plan"
  );
  const thingsToDo = destination?.content?.find(
    (item: any) => item?.name === "things to do"
  );
  const placeToVisit = destination?.content?.find(
    (item: any) => item?.name === "places to visit"
  );
  const seasonsToVisit = destination?.content?.find(
    (item: any) => item?.name === "Seasons to visit"
  );
  const featuredTour = destination?.tours?.find(
    (item: any) => item.isFeatured === true
  );

  useEffect(() => {
    const bannerImage = destination?.content?.find(
      (ele: any) =>
        ele.name.toLocaleLowerCase() ===
        activeTab?.replaceAll("-", " ")?.toLocaleLowerCase()
    );
    setImage(bannerImage ? bannerImage?.media : getBespokePlan?.media);
  }, [searchParams]);

  const tabsContent = [
    {
      label: tabsContents.travelGuide,
      value: "travel-guide",
      onClick: () => {
        router.push(
          pathNameByLocale(
            locale,
            `/${replaceSpacesWithDash(
              destination?.seoMeta?.slug
            )}?tab=travel-guide`
          )
        );
      },
      content: (
        <GetBespokePlane
          locales={{
            planContactBanner,
            button,
            placeholder,
            destinationPage,
            radioButton,
            successModal,
            testimonialClientLove: sectionHeadings.testimonialClientLove,
            errors,
            locale,
          }}
          testimonials={destination.testimonial}
          about={getBespokePlan}
          destination={{
            id: destination?.id,
            name: destination?.name,
            slug: destination?.seoMeta?.slug,
          }}
          places={destination?.placeToVisit}
          tours={destination?.tours?.slice(0, 2)}
          blogs={destination?.inspirations}
          gallery={destination?.gallery}
        />
      ),
    },
    {
      label: tabsContents.tours,
      value: "tours",
      content: (
        <Tours
          dictionary={{
            planContactBanner,
            button,
            destinationPage,
            locale,
          }}
          gallery={destination.gallery}
          destination={destination?.name}
          tours={destination?.tours}
          blogs={destination?.inspirations}
        />
      ),
      onClick: () => {
        router.push(
          pathNameByLocale(
            locale,
            `/${replaceSpacesWithDash(destination?.seoMeta?.slug)}?tab=tours`
          )
        );
      },
    },
    {
      label: tabsContents.placesToVisit,
      value: "places-to-visit",
      content: (
        <>
          <PlaceToVisit
            dictionary={{
              planContactBanner,
              button,
              destinationPage,
              sectionHeadings,
              locale,
            }}
            featuredTour={featuredTour}
            about={placeToVisit}
            destination={destination?.name}
            tours={destination?.tours}
            blogs={destination?.inspirations}
            places={destination?.placeToVisit}
            ideas={holidayTypes}
          />
        </>
      ),
      onClick: () => {
        router.push(
          pathNameByLocale(
            locale,
            `/${replaceSpacesWithDash(
              destination?.seoMeta?.slug
            )}?tab=places-to-visit`
          )
        );
      },
    },
    {
      label: tabsContents.thingsTodDo,
      value: "things-to-do",
      content: (
        <ThingsToDo
          dictionary={{
            planContactBanner,
            button,
            destinationPage,
            sectionHeadings,
            locale,
          }}
          destination={destination?.name}
          featuredTour={featuredTour}
          tour={destination?.tours}
          about={thingsToDo}
          blogs={destination?.inspirations}
          thingsToDo={destination?.thingsToDo}
          destinationFeatureOffered={destination?.destinationFeatureOffered}
        />
      ),
      onClick: () => {
        router.push(
          pathNameByLocale(
            locale,
            `/${replaceSpacesWithDash(
              destination?.seoMeta?.slug
            )}?tab=things-to-do`
          )
        );
      },
    },
    {
      label: tabsContents.seasonsToVisit,
      value: "seasons-to-visit",
      content: (
        <BestTimeToVisit
          dictionary={{
            planContactBanner,
            button,
            destinationPage,
            sectionHeadings,
            locale,
          }}
          destination={destination?.name}
          featuredTour={featuredTour}
          tour={destination?.tours}
          about={seasonsToVisit}
          blogs={destination?.inspirations}
          seasonToVisit={destination?.seasonToVisit}
        />
      ),
      onClick: () => {
        router.push(
          pathNameByLocale(
            locale,
            `/${replaceSpacesWithDash(
              destination?.seoMeta?.slug
            )}?tab=seasons-to-visit`
          )
        );
      },
    },
  ];

  const breadcrumbs = [
    { name: breadCrumb.home, url: pathNameByLocale(locale, "/") },
    {
      name: destination?.name as string,
      url: "",
    },
  ];
  let isMobile: any;
  if (typeof window !== "undefined") {
    isMobile = window && window.screen.width < 640;
  }

  const tabsRoutes = [
    "travel-guide",
    "tours",
    "places-to-visit",
    "things-to-do",
    "seasons-to-visit",
  ];
  return (
    <>
      <InnerPageBanner
        breadcrumbs={breadcrumbs}
        image={
          isMobile
            ? image?.mobileMediaUrl
              ? image?.mobileMediaUrl
              : image?.desktopMediaUrl
            : image?.desktopMediaUrl
        }
        mainHeading={destination?.name}
        buttonText={
          pagesShowGalleryButton?.includes(activeTab) ? button.gallery : ""
        }
        description={
          isMobile
            ? destination?.description
            : truncateText(destination?.description, 350)
        }
        onButtonClick={(e: any) => {
          scrollToHash(e, "gallery", 100);
        }}
      />
      <Tabs
        locale={locale}
        defaultValue={
          tabsRoutes.includes(activeTab?.toLowerCase())
            ? activeTab
            : "travel-guide"
        }
        tabsContent={tabsContent}
      />
    </>
  );
}

export default DestinationComponent;
