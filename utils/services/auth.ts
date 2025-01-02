import { handleResponse } from "@utils/api-helpers";
import { AuthUser, UserLoginResponse, UserResponse } from "../types";

const SERVER_ENDPOINT =
  process.env.SERVER_ENDPOINT || process.env.NEXT_PUBLIC_API_URL;

export async function apiRegisterUser(credentials: string): Promise<AuthUser> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
    body: credentials,
  });

  return handleResponse<UserResponse>(response).then((data) => data.data.user);
}

export async function apiLoginUser(credentials: string): Promise<string> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
    body: credentials,
  });

  return handleResponse<UserLoginResponse>(response).then((data) => data.token);
}

export async function apiLogoutUser(): Promise<void> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/auth/logout`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
    },
  });

  return handleResponse<void>(response);
}

export async function apiGetAuthUser(token?: string): Promise<AuthUser> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/user/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,

      "Content-Type": "application/json",
    },
  });

  return handleResponse<UserResponse>(response).then((data) => data.data.user);
}

export async function apiGetUserProfile(): Promise<{
  status: string;
  data: { user: AuthUser };
}> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/user`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,

      "Content-Type": "application/json",
    },
  });

  return handleResponse<{ status: string; data: { user: AuthUser } }>(
    response
  ).then((data) => data);
}

export async function apiUpdateCurrentUser(user: any): Promise<any> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/admin/user`, {
    method: "PUT",
    credentials: "include",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_BEARER as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return handleResponse<any>(response).then((data) => data);
}
