import { DestinationFeaturesResponse } from "../types";
import { handleResponse } from "@utils/api-helpers";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiGetAllDestinationFeatures(params?: {
  isActive?: true;
}): Promise<{
  status: string;
  data: DestinationFeaturesResponse[];
}> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/features${
      params?.isActive ? "/?active=true" : ""
    }`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      },
    }
  );

  return handleResponse<{
    status: string;
    data: DestinationFeaturesResponse[];
  }>(response);
}
export async function apiPosDestinationFeature(
  feature: DestinationFeaturesResponse
): Promise<{ status: string; data: DestinationFeaturesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/features`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      },
      body: JSON.stringify(feature),
    }
  );

  return handleResponse<{ status: string; data: DestinationFeaturesResponse }>(
    response
  );
}
export async function apiPutDestinationFeature(
  id: number,
  feature: DestinationFeaturesResponse
): Promise<{ status: string; data: DestinationFeaturesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/features/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      },
      body: JSON.stringify(feature),
    }
  );

  return handleResponse<{ status: string; data: DestinationFeaturesResponse }>(
    response
  );
}
export async function apiDeleteDestinationFeature(
  id: number
): Promise<{ status: string; data: DestinationFeaturesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/features/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      },
    }
  );

  return handleResponse<{ status: string; data: DestinationFeaturesResponse }>(
    response
  );
}
export async function apiUpdateDestinationFeatureStatus(
  id: number,
  params: { isActive: boolean }
): Promise<{ status: string; data: DestinationFeaturesResponse }> {
  const response = await fetch(
    `${SERVER_ENDPOINT}/api/admin/destinations/features/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      },
      body: JSON.stringify(params),
    }
  );

  return handleResponse<{ status: string; data: DestinationFeaturesResponse }>(
    response
  );
}
