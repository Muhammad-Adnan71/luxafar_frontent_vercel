import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-USER-ID");

  if (!userId) {
    return getErrorResponse(
      401,
      "You are not logged in, please provide token to gain access"
    );
  }

  const user = await prisma.users.findUnique({
    where: { id: Number(userId) },
    include: {
      media: true,
    },
  });
  const userResponse = await convertMediaIdsResponseIntoMediaUrl(user);
  return NextResponse.json({
    status: "success",
    data: {
      user: {
        ...userResponse,
        password: undefined,
      },
    },
  });
}
