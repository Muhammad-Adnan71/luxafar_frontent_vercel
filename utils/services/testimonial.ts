import { handleResponse } from "@utils/api-helpers";
import { TestimonialResponse } from "@utils/types";
const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllTestimonials(params?: {
  pageNum?: string;
  pageSize?: string;
  searchParams?: string;
  groupBy?: string;
}): Promise<{
  status: string;
  count: number;
  data: TestimonialResponse[];
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/admin/testimonial`);
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
    count: number;

    data: TestimonialResponse[];
  }>(response);
}
export async function apiDeleteTestimonial(id: number): Promise<{
  status: string;
  data: TestimonialResponse;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/testimonial/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      },
    }
  );

  return handleResponse<{
    status: string;
    data: TestimonialResponse;
  }>(response);
}

export async function apiPostTestimonialService(
  testimonial: TestimonialResponse
): Promise<{ status: string; data: TestimonialResponse }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/testimonial`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
    body: JSON.stringify(testimonial),
  });

  return handleResponse<{ status: string; data: TestimonialResponse }>(
    response
  );
}

export async function apiUpdateTestimonial(
  id: number,
  testimonial: TestimonialResponse
): Promise<{ status: string; data: TestimonialResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/testimonial/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      },
      body: JSON.stringify(testimonial),
    }
  );

  return handleResponse<{ status: string; data: TestimonialResponse }>(
    response
  );
}

export async function apiChangeSortTestimonialService({
  sourceId,
  sortPosition,
  destinationIdSortId,
  destinationId,
}: {
  sourceId: number;
  sortPosition: number;
  destinationId?: number;
  destinationIdSortId: number;
}): Promise<{ status: string; data: TestimonialResponse[] }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/testimonial`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
    body: JSON.stringify({
      sourceId,
      sortPosition,
      destinationIdSortId,
      destinationId,
    }),
  });

  return handleResponse<{ status: string; data: TestimonialResponse[] }>(
    response
  );
}
