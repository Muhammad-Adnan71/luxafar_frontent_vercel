import React from "react";
import { apiGetTourByNameTemplate } from "@utils/services/tour";
import {
  capitalizeFirstLetter,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
export const runtime = "edge";
import { Metadata } from "next";
import { apiGetTourSeoMeta } from "@utils/services/seoMeta";
import TourPage from "../../components/tourPage";
import { Locale } from "i18n.config";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: {
    name,
    params: [destinationName, tourName],
  },
}: any): Promise<Metadata> {
  try {
    const {
      data: {
        tour: {
          seoMeta: { description, title, keywords },
        },
      },
    } = await apiGetTourSeoMeta(tourName, name);

    const metaDescription = removeParaTagsFromString(description as string);

    return {
      title: `${capitalizeFirstLetter(title)} - Luxafar`,
      description: metaDescription,
      keywords: keywords,

      openGraph: {
        title: `${capitalizeFirstLetter(title)} - Luxafar`,
        description: metaDescription,
      },
    };
  } catch (error) {
    console.log(error);
    return notFound();
  }
}

const TourDetailPage = async ({
  params: { name, params, lang },
}: {
  params: {
    name: string;
    lang: Locale;
    params: [tours: string, tourName: string];
  };
}) => {
  const destinationNameString = name.replaceAll("-", " ");
  const locale = getLocaleFromServer(lang);

  const [_, tourName] = params;
  const tourResponse = await apiGetTourByNameTemplate(tourName, name, {
    locale,
  });
  return (
    <TourPage
      locale={locale}
      name={name}
      tourResponse={tourResponse}
      destinationNameString={destinationNameString}
    />
  );
};

export default TourDetailPage;
