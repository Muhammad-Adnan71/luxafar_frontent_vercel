import { handleResponse } from "@utils/api-helpers";
import { BespokeQuestionResponse } from "@utils/types";
const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllBespokeQuestion(): Promise<{
  status: string;
  data: BespokeQuestionResponse[];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/forms/bespoke`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: BespokeQuestionResponse[];
  }>(response);
}
export async function apiPutBespokeQuestion(
  bespokeQuestionResponse: BespokeQuestionResponse[]
): Promise<{
  status: string;
  data: BespokeQuestionResponse[];
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/forms/bespoke`, {
    method: "PUT",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bespokeQuestionResponse),
  });

  return handleResponse<{
    status: string;
    data: BespokeQuestionResponse[];
  }>(response);
}

export async function apiGetAllBespokeQuestionTemplate(params?: {
  locale?: string;
}): Promise<{
  status: string;
  data: BespokeQuestionResponse[];
}> {
  var url = new URL(`${SERVER_ENDPOINT}/api/template/forms/bespoke`);
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
    data: BespokeQuestionResponse[];
  }>(response);
}

export async function apiBespokeForm(bespokeForm: any): Promise<{
  status: string;
  data: any;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/template/forms/bespoke`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bespokeForm),
    }
  );

  return handleResponse<{
    status: string;
    data: any;
  }>(response);
}
export async function apiChangeSortBespokeQuestionService({
  sourceId,
  sortPosition,
  destinationIdSortId,
  destinationId,
}: {
  sourceId: number;
  sortPosition: number;
  destinationId?: number;
  destinationIdSortId: number;
}): Promise<{ status: string; data: BespokeQuestionResponse[] }> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/forms/bespoke`, {
    method: "POST",
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

  return handleResponse<{ status: string; data: BespokeQuestionResponse[] }>(
    response
  );
}
