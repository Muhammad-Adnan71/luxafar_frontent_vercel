import React from "react";
import { apiTemplateDestinationByName } from "@utils/services/destination";
import { Metadata } from "next";
import {
  capitalizeFirstLetter,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { apiGetDestinationSeoMeta } from "@utils/services/seoMeta";
import DestinationPage from "../components/destinationPage";
import { Locale } from "i18n.config";
import { notFound } from "next/navigation";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}): Promise<Metadata> {
  try {
    const {
      data: {
        destination: {
          seoMeta: { description, title, keywords },
        },
      },
    } = await apiGetDestinationSeoMeta(params.name);

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
async function Destination({
  params: { name, lang },
}: {
  params: { name: string; lang: Locale };
}) {
  const locale = getLocaleFromServer(lang);

  const response = await apiTemplateDestinationByName(name, { locale });
  return <DestinationPage response={response} locale={locale} />;
}

export default Destination;
