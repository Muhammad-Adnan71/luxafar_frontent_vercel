import { handleResponse } from "@utils/api-helpers";
import { Locale } from "i18n.config";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiTemplateCaughtAllRoutes(
  slug: any,
  params?: {
    locale?: any;
  }
): Promise<{
  status: string;
  data: any;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/template/caughtAllRoutes/${slug}`);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: any;
  }>(response);
}
export async function apiTemplateCaughtAllRoutesSeo(slug: any): Promise<{
  status: string;
  data: any;
}> {
  var url = new URL(
    `${SERVER_ENDPOINT}/api/template/seoMeta/caughtAllRoutes/${slug}`
  );
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-cache",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: any;
  }>(response);
}
