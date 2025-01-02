import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@utils/token";
import { getErrorResponse } from "utils/api-helpers";
import { CustomMiddleware } from "./chain";

interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
  };
}

const publicAdminApiRoutes = [
  "/api/admin/auth/login",
  "/api/admin/auth/register",
  "/api/admin/uploads",
];
export function withAuthMiddleware(middleware: CustomMiddleware) {
  return async (req: NextRequest, event: NextFetchEvent, res: NextResponse) => {
    const authorization = req.headers.get("Authorization");

    // if (req.nextUrl.pathname.startsWith("/api")) {
    // if (authorization === process.env.NEXT_PUBLIC_BEARER) {
    let token = req.cookies.get("token")?.value;
    if (!token) {
      if (req.nextUrl.pathname.startsWith("/admin/")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else if (
        req.nextUrl.pathname.includes("/api/admin") &&
        !publicAdminApiRoutes.includes(req.nextUrl.pathname)
      ) {
        return getErrorResponse(401, "Authorization Required");
      }
    } else {
      try {
        const { sub } = await verifyJWT<{ sub: string }>(token);
        res.headers.set("X-USER-ID", sub);
        (req as AuthenticatedRequest).user = { id: sub };
        if (req.nextUrl.pathname === "/admin") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
      } catch (error) {
        if (req.nextUrl.pathname.startsWith("/api/admin")) {
          return getErrorResponse(
            401,
            "Token is invalid or user doesn't exists"
          );
        }
        return NextResponse.redirect(
          new URL(
            `/admin?${new URLSearchParams({ error: "badauth" })}`,
            req.url
          )
        );
      }
    }
    // }
    // else {
    //   return getErrorResponse(401, "Authorization Required");
    // }
    // }
    return middleware(req, event, res);
  };
}
