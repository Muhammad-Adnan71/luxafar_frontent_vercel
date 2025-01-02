import React from "react";
import {
  capitalizeFirstLetter,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { apiGetTemplateInspirationByName } from "@utils/services/inspirations";
import { Metadata } from "next";
import { apiGetInspirationSeoMeta } from "@utils/services/seoMeta";

import InspirationDetailPage from "../../components/inspirationDetailPage";
import { Locale, i18n } from "i18n.config";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params: { destinationName, inspirationName },
}: {
  params: { destinationName: string; inspirationName: string };
}): Promise<Metadata> {
  try {
    const {
      data: {
        inspiration: {
          seoMeta: { description, title, keywords },
        },
      },
    } = await apiGetInspirationSeoMeta(`${destinationName}/${inspirationName}`);
    const metaDescription = removeParaTagsFromString(description as string);

    return {
      title: capitalizeFirstLetter(title) + " " + "- Luxafar",
      description: metaDescription,
      keywords: keywords,
      openGraph: {
        title: capitalizeFirstLetter(title) + " " + "- Luxafar",
        description: metaDescription,
      },
    };
  } catch (error) {
    console.log(error);
    return notFound();
  }
}
async function DestinationDetail({
  params: { destinationName, inspirationName, lang },
}: {
  params: { destinationName: string; inspirationName: string; lang: Locale };
}) {
  const locale = getLocaleFromServer(lang);

  const {
    data: { inspiration, tours },
  } = await apiGetTemplateInspirationByName(
    `${destinationName}/${inspirationName}`,
    {
      locale,
    }
  );

  return (
    <InspirationDetailPage
      inspiration={inspiration}
      tours={tours}
      params={{ destinationName, inspirationName, lang }}
      locale={locale}
    />
  );
}

export default DestinationDetail;
