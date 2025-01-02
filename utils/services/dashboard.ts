import { FormResponse } from "../types";
import { handleResponse } from "@utils/api-helpers";
import { PageResponse } from "@utils/types";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiDashboard(): Promise<{
  status: string;
  data: {
    pages: PageResponse[];
    forms: FormResponse[];
    becomePartner: number;
    bespokeCount: number;
  };
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/dashboard`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
  });

  return handleResponse<{
    status: string;
    data: {
      pages: PageResponse[];
      forms: FormResponse[];
      becomePartner: number;
      bespokeCount: number;
    };
  }>(response);
}
export async function apiDashboardDetail(): Promise<{
  status: string;
  data: any;
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/dashboard/detail`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<{
    status: string;
    data: any;
  }>(response);
}
