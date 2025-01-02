import React from "react";

import { apiGetTemplatePlacesByName } from "@utils/services/places";
import { Metadata } from "next";
import {
  capitalizeFirstLetter,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import PlacePage from "../../../components/placePage";
import { Locale, i18n } from "i18n.config";
import { notFound } from "next/navigation";
export const runtime = "edge";

export async function generateMetadata({
  params: { name, placeName },
}: {
  params: {
    name: string;
    placeName: string;
  };
}): Promise<Metadata> {
  try {
    const {
      data: {
        place: {
          seoMeta: { description, title, keywords },
        },
      },
    } = await apiGetTemplatePlacesByName(placeName);

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
async function PlaceDetail({
  params: { name, placeName, lang },
}: {
  params: {
    name: string;
    placeName: string;
    lang: Locale;
  };
}) {
  const destinationNameString = name.replaceAll("-", " ");
  const locale = getLocaleFromServer(lang);
  const response = await apiGetTemplatePlacesByName(placeName, {
    locale,
  });
  return (
    <PlacePage
      locale={locale}
      response={response}
      destinationNameString={destinationNameString}
    />
  );
}

export default PlaceDetail;
