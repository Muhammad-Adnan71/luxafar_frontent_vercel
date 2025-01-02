import {
  BannerResponse,
  PageResponse,
  PartnersResponse,
  FaqResponse,
  TestimonialResponse,
  InspirationResponse,
  HolidayTypesResponse,
  TourResponse,
  bespokeQuestionOptionsResponse,
  BespokeQuestionResponse,
} from "../types";
import { handleResponse } from "@utils/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllPagesService(): Promise<{
  status: string;
  data: [];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/pages`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: [];
  }>(response);
}

export async function apiGetPageByIdService(pageId: number): Promise<{
  status: string;
  data: PageResponse;
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/pages/${pageId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: PageResponse;
  }>(response);
}

export async function apiGetPageByIdTemplateService(params: {
  name: string;
  locale?: string;
}): Promise<{
  status: string;
  data: {
    page: any;
    banners: BannerResponse[];
    partners: PartnersResponse[];
    faqs: FaqResponse[];
    testimonials: TestimonialResponse[];
    inspirations: InspirationResponse[];
  };
}> {
  const { name, ...rest } = params;
  var url = new URL(`${SERVER_ENDPOINT}/api/template/pages/${name}`);
  url.search = new URLSearchParams(rest).toString();
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
    data: {
      page: PageResponse;
      banners: BannerResponse[];
      partners: PartnersResponse[];
      faqs: FaqResponse[];
      testimonials: TestimonialResponse[];
      inspirations: InspirationResponse[];
    };
  }>(response);
}
export async function apiUpdatePagesService(
  pageId: number,
  data: any
): Promise<{
  status: string;
  data: [];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/pages/${pageId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{
    status: string;
    data: [];
  }>(response);
}
export async function apiGetToursPageService(params?: {
  destinationId?: string;
  holidayTypeId?: string;
  pageNum?: string;
  locale?: string;
  pageSize?: string;
}): Promise<{
  status: string;
  data: {
    count: number;
    page: PageResponse;
    tours: TourResponse[];
    featuredTours: TourResponse[];
    upcomingTours: TourResponse[];
    inspirations: InspirationResponse[];
    bespokeQuestion: BespokeQuestionResponse[];
  };
}> {
  let url = new URL(`${SERVER_ENDPOINT}/api/template/pages/tours`);
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
    data: {
      count: number;
      page: PageResponse;
      tours: TourResponse[];
      featuredTours: TourResponse[];
      upcomingTours: TourResponse[];
      inspirations: InspirationResponse[];
      bespokeQuestion: BespokeQuestionResponse[];
    };
  }>(response);
}
