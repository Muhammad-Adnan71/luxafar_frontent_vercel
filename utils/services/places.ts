import { InspirationResponse } from "@utils/types";
import { HolidayTypesResponse, TourResponse } from "../types";
import { handleResponse } from "@utils/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllPlaces(params?: {
  active?: "true";
  pageNum?: string;
  pageSize?: string;
  searchParams?: string;
}): Promise<{
  status: string;
  data: any[];
  count: number;
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/places`);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
  });

  return handleResponse<{
    status: string;
    data: any[];
    count: number;
  }>(response);
}
export async function apiGetPlacesById(id: number): Promise<{
  status: string;
  data: any;
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/places/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
  });

  return handleResponse<{
    status: string;
    data: any;
  }>(response);
}

export async function apiPostPlace(
  tourDetail: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/places`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
    body: JSON.stringify(tourDetail),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiPutPlace(
  id: number,
  placeData: any
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/places/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
    body: JSON.stringify(placeData),
  });

  return handleResponse<{ status: string; data: any }>(response);
}
export async function apiUpdatePlaceStatus(
  id: number,
  placeStatus: { status: boolean }
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/places/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
    body: JSON.stringify(placeStatus),
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiDeletePlace(
  id: number
): Promise<{ status: string; data: any }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/places/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
  });

  return handleResponse<{ status: string; data: any }>(response);
}

export async function apiGetTemplatePlacesByName(
  name: string,
  params?: {
    locale?: string;
  }
): Promise<{
  status: string;
  data: {
    place: any;
    recommendedTours: TourResponse[];
    places: any;
    inspirations: InspirationResponse[];
    inspirationsCount: number;
  };
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/template/place/${name}`);
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
      place: any;
      recommendedTours: TourResponse[];
      places: any;
      inspirations: InspirationResponse[];
      inspirationsCount: number;
    };
  }>(response);
}
