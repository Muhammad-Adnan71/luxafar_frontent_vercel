import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";

const allowedOrigins = [
  "localhost:3000",
  "10.1.10.108:8069",
  "dev.luxafar.com",
  "demo.luxafar.com",
  "luxafar.com",
  "54.254.236.177:8070",
  "192.168.20.229:3000",
  "10.1.10.17:3000",
  "luxafar-frontent-vercel.vercel.app"
];
export function withCors(middleware: CustomMiddleware) {
  return (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const origin = request.headers.get("host");

    if (!origin || !allowedOrigins.includes(origin)) {
      return new NextResponse(
        JSON.stringify({
          data: " Invalid origin",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const res = NextResponse.next({
      request: {
        ...request,
        headers: request.headers,
      },
    });

    res.headers.set("Access-Control-Allow-Origin", origin as string);
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return middleware(request, event, res);
  };
}
