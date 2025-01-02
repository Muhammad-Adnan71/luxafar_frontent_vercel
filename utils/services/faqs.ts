import { handleResponse } from "@utils/api-helpers";
import { FaqResponse } from "@utils/types";
const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllFaqs(): Promise<{
  status: string;
  data: FaqResponse[];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/faqs`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
  });

  return handleResponse<{
    status: string;
    data: FaqResponse[];
  }>(response);
}
export async function apiPutFaqs(
  id: number,
  faq: FaqResponse
): Promise<{ status: string; data: FaqResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/faqs/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
    body: JSON.stringify(faq),
  });

  return handleResponse<{ status: string; data: FaqResponse }>(response);
}
export async function apiPostFaqs(
  faq: FaqResponse
): Promise<{ status: string; data: FaqResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/faqs`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
    body: JSON.stringify(faq),
  });

  return handleResponse<{ status: string; data: FaqResponse }>(response);
}

export async function apiDeleteFaqs(
  id: number
): Promise<{ status: string; data: FaqResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/faqs/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
  });

  return handleResponse<{ status: string; data: FaqResponse }>(response);
}
