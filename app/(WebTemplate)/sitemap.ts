import { dateFormat, friendlyUrl } from "@utils/functions";
import { MetadataRoute } from "next";
import { apiGetAllSitemapData } from "@utils/services/sitemap";
import { WEB_ROUTES, languages } from "@utils/constant";
export const runtime = "edge";

export async function generateSitemaps() {
  // Fetch the total number of languages and calculate the number of sitemaps needed
  return languages.map((lang: any) => ({ id: lang.locale }));
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const response = await apiGetAllSitemapData();
  let holidayType: any = [];
  const locale = id;

  if (locale !== "en") {
    response?.data?.allActiveHolidayTypeWithTitle.forEach((item: any) =>
      holidayType.push({
        url: `${process.env.METADATA_BASE_URL}/${locale}${WEB_ROUTES.HOLIDAY_TYPES}/${item?.seoMeta.slug}`,
        lastModified: `${dateFormat(item?.updatedAt).toString()}`,
        changeFrequency: "weekly",
        priority: 0.5,
      })
    );
  } else {
    response?.data?.allActiveHolidayTypeWithTitle.forEach((item: any) =>
      holidayType.push({
        url: `${process.env.METADATA_BASE_URL}${WEB_ROUTES.HOLIDAY_TYPES}/${item?.seoMeta.slug}`,
        lastModified: `${dateFormat(item?.updatedAt).toString()}`,
        changeFrequency: "weekly",
        priority: 0.5,
      })
    );
  }

  let inspirations: any = [];

  if (locale !== "en") {
    response?.data?.allActiveInspirationWithTitle.forEach((item: any) => {
      item.destination.forEach((ele: any) => {
        inspirations.push({
          url: `${process.env.METADATA_BASE_URL}/${locale}/${item?.seoMeta?.slug}`,
          lastModified: `${dateFormat(item?.updatedAt).toString()}`,
          changeFrequency: "weekly",
          priority: 0.5,
        });
      });
    });
  } else {
    response?.data?.allActiveInspirationWithTitle.forEach((item: any) => {
      item.destination.forEach((ele: any) => {
        inspirations.push({
          url: `${process.env.METADATA_BASE_URL}/${item?.seoMeta?.slug}`,
          lastModified: `${dateFormat(item?.updatedAt).toString()}`,
          changeFrequency: "weekly",
          priority: 0.5,
        });
      });
    });
  }

  let places: any = [];

  if (locale !== "en") {
    response?.data?.allActivePlacesWithTitle.map((item: any) =>
      places.push({
        url: `${process.env.METADATA_BASE_URL}/${locale}/${item?.seoMeta?.slug}`,
        lastModified: `${dateFormat(item?.updatedAt).toString()}`,
        changeFrequency: "weekly",
        priority: 0.5,
      })
    );
  } else {
    response?.data?.allActivePlacesWithTitle.map((item: any) =>
      places.push({
        url: `${process.env.METADATA_BASE_URL}/${item?.seoMeta?.slug}`,
        lastModified: `${dateFormat(item?.updatedAt).toString()}`,
        changeFrequency: "weekly",
        priority: 0.5,
      })
    );
  }

  let destinations: any = [];

  if (locale !== "en") {
    response?.data?.allActiveDestinationWithTitle
      .filter((fil: any) => fil.tourDestinations.length > 0)
      .map((item: any) =>
        destinations.push({
          url: `${process.env.METADATA_BASE_URL}/${locale}/${item?.seoMeta?.slug}`,
          lastModified: `${dateFormat(item?.updatedAt).toString()}`,
          changeFrequency: "weekly",
          priority: 0.5,
        })
      );
  } else {
    response?.data?.allActiveDestinationWithTitle
      .filter((fil: any) => fil.tourDestinations.length > 0)
      .map((item: any) =>
        destinations.push({
          url: `${process.env.METADATA_BASE_URL}/${item?.seoMeta?.slug}`,
          lastModified: `${dateFormat(item?.updatedAt).toString()}`,
          changeFrequency: "weekly",
          priority: 0.5,
        })
      );
  }

  let tours: any = [];
  const filteredTours = response?.data?.allActiveToursWithTitle.filter(
    (fil: any) => fil.tourDestinations.length
  );

  if (locale !== "en") {
    filteredTours.map((item: any) =>
      tours.push({
        url: `${process.env.METADATA_BASE_URL}/${locale}/${item?.seoMeta?.slug}`,
        lastModified: `${dateFormat(item?.updatedAt).toString()}`,
        changeFrequency: "weekly",
        priority: 0.5,
      })
    );
  } else {
    filteredTours.map((item: any) =>
      tours.push({
        url: `${process.env.METADATA_BASE_URL}/${item?.seoMeta?.slug}`,
        lastModified: `${dateFormat(item?.updatedAt).toString()}`,
        changeFrequency: "weekly",
        priority: 0.5,
      })
    );
  }

  let mainPages: any = [];

  if (locale !== "en") {
    Object.values(WEB_ROUTES).map((item: any) => {
      if (item !== "/destination") {
        mainPages.push({
          url: (process.env.METADATA_BASE_URL as string) + "/" + locale + item,
          lastModified: `${dateFormat(new Date().toISOString())}`,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    });
  } else {
    Object.values(WEB_ROUTES).map((item: any) => {
      if (item !== "/destination")
        mainPages.push({
          url: (process.env.METADATA_BASE_URL as string) + item,
          lastModified: `${dateFormat(new Date().toISOString())}`,
          changeFrequency: "weekly",
          priority: 0.8,
        });
    });
  }

  return [
    ...mainPages,
    ...holidayType,
    ...inspirations,
    ...places,
    ...destinations,
    ...tours,
  ];
}
