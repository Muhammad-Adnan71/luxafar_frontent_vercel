import { BannerResponse } from "../types";
import { handleResponse } from "@utils/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllBanner(): Promise<{
  status: string;
  data: BannerResponse[];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/banner`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: BannerResponse[];
  }>(response);
}

export async function apiGetBannerById(id: Number): Promise<{
  status: string;
  data: BannerResponse;
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/banner/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: BannerResponse;
  }>(response);
}

export async function apiPostBanner(
  banner: BannerResponse
): Promise<{ status: string; data: BannerResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/banner`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(banner),
  });

  return handleResponse<{ status: string; data: BannerResponse }>(response);
}
export async function apiPutBanner(
  id: number,
  banner: BannerResponse
): Promise<{ status: string; data: BannerResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/banner/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(banner),
  });

  return handleResponse<{ status: string; data: BannerResponse }>(response);
}
export async function apiDeleteBanner(
  id: number
): Promise<{ status: string; data: BannerResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/banner/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ status: string; data: BannerResponse }>(response);
}
// export async function apiUpdateBannerStatus(
//   id: number,
//   status: {
//     status: boolean;
//   }
// ): Promise<{ status: string; data: BannerResponse }> {
//   const response = await fetch(`${SERVER_ENDPOINT}/api/admin/banner/${id}`, {
//     method: "PUT",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(status),
//   });

//   return handleResponse<{ status: string; data: BannerResponse }>(response);
// }
