import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { apiGetAllBecomePartnerQuestionTemplate } from "@utils/services/becomePartner";
import {
  apiTemplateCaughtAllRoutes,
  apiTemplateCaughtAllRoutesSeo,
} from "@utils/services/caughtAllRoute";
import { Locale, i18n } from "i18n.config";
import React from "react";
import DestinationComponent from "../destination/components/destinationComponent";
import DestinationPage from "../destination/components/destinationPage";
import TourPage from "../destination/components/tourPage";
import InspirationDetailPage from "../inspirations/components/inspirationDetailPage";
import PlacePage from "../destination/components/placePage";
import { Metadata } from "next";
import { apiGetDestinationSeoMeta } from "@utils/services/seoMeta";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@utils/prisma";
import { getErrorResponse } from "@utils/api-helpers";

export const runtime = "edge";

export async function generateMetadata({
  params: { lang, params },
}: {
  params: { lang: Locale; params: any };
}): Promise<Metadata | undefined> {
  try {
    const {
      data: { ...rest },
    } = await apiTemplateCaughtAllRoutesSeo(params[0]);
    if (rest?.layout === "destination") {
      const {
        seoMeta: { description, title, keywords, slug },
      } = rest?.destination;
      const metaDescription = removeParaTagsFromString(description as string);

      return {
        title: `${capitalizeFirstLetter(title)} - Luxafar`,
        description: metaDescription,
        keywords: keywords,
        alternates: {
          canonical: lang === "en" ? `/${slug}` : `/${lang}/${slug}`,
          // languages: {
          //   "en-US": `/${slug}`,
          //   fr: `/fr/${slug}`,
          //   it: `/it/${slug}`,
          //   es: `/es/${slug}`,
          //   ru: `/ru/${slug}`,
          //   zh: `/zh/${slug}`,
          // },
        },
        openGraph: {
          title: `${capitalizeFirstLetter(title)} - Luxafar`,
          url: `/${slug}`,
          images: "/template/logo.png",
          description: metaDescription,
        },
      };
    } else if (rest?.layout === "tour") {
      const {
        seoMeta: { description, title, keywords, slug },
      } = rest.tour;

      const metaDescription = removeParaTagsFromString(description as string);

      return {
        title: `${capitalizeFirstLetter(title)} - Luxafar`,
        description: metaDescription,
        keywords: keywords,
        alternates: {
          canonical: lang === "en" ? `/${slug}` : `/${lang}/${slug}`,
          // languages: {
          //   "en-US": `/${slug}`,
          //   fr: `/fr/${slug}`,
          //   it: `/it/${slug}`,
          //   es: `/es/${slug}`,
          //   ru: `/ru/${slug}`,
          //   zh: `/zh/${slug}`,
          // },
        },
        openGraph: {
          title: `${capitalizeFirstLetter(title)} - Luxafar`,
          url: `/${slug}`,
          images: "/template/logo.png",
          description: metaDescription,
        },
      };
    } else if (rest?.layout === "inspiration") {
      const {
        seoMeta: { description, title, keywords, slug },
      } = rest.inspiration;

      const metaDescription = removeParaTagsFromString(description as string);

      return {
        title: capitalizeFirstLetter(title) + " " + "- Luxafar",
        description: metaDescription,
        keywords: keywords,
        alternates: {
          canonical: lang === "en" ? `/${slug}` : `/${lang}/${slug}`,
          // languages: {
          //   "en-US": `/${slug}`,
          //   fr: `/fr/${slug}`,
          //   it: `/it/${slug}`,
          //   es: `/es/${slug}`,
          //   ru: `/ru/${slug}`,
          //   zh: `/zh/${slug}`,
          // },
        },
        openGraph: {
          title: capitalizeFirstLetter(title) + " " + "- Luxafar",
          url: `/${slug}`,
          images: "/template/logo.png",
          description: metaDescription,
        },
      };
    } else if (rest?.layout === "place") {
      const {
        seoMeta: { description, title, keywords, slug },
      } = rest.place;

      const metaDescription = removeParaTagsFromString(description as string);
      return {
        title: `${capitalizeFirstLetter(title)} - Luxafar`,
        description: metaDescription,
        keywords: keywords,
        alternates: {
          canonical: lang === "en" ? `/${slug}` : `/${lang}/${slug}`,
          // languages: {
          //   "en-US": `/${slug}`,
          //   fr: `/fr/${slug}`,
          //   it: `/it/${slug}`,
          //   es: `/es/${slug}`,
          //   ru: `/ru/${slug}`,
          //   zh: `/zh/${slug}`,
          // },
        },
        openGraph: {
          title: `${capitalizeFirstLetter(title)} - Luxafar`,
          url: `/${slug}`,
          images: "/template/logo.png",
          description: metaDescription,
        },
      };
    }
  } catch (error) {
    console.log(error);
    return notFound();
  }
}

async function page({
  params: { lang, params },
}: {
  params: { lang: Locale; params: any };
}) {
  const locale = getLocaleFromServer(lang);
  const response = await apiTemplateCaughtAllRoutes(params[0], { locale });
  const layout: any = {
    destination: <DestinationPage response={response} locale={locale} />,
    tour: (
      <TourPage
        locale={locale}
        name={""}
        tourResponse={response}
        destinationNameString={""}
      />
    ),
    inspiration: (
      <InspirationDetailPage
        inspiration={response?.data?.inspiration}
        tours={response?.data?.tours}
        params={{ destinationName: "", inspirationName: "", lang }}
        locale={locale}
      />
    ),
    place: (
      <PlacePage
        locale={locale}
        response={response}
        destinationNameString={""}
      />
    ),
  };
  if (response?.data?.layout) return <>{layout[response?.data?.layout]}</>;
  else notFound();
}

export default page;
