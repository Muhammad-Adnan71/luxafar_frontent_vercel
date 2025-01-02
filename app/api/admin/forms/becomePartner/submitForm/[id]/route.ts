import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  const id = Number(params.id);
  try {
    const form = await prisma.becomePartner.update({
      where: {
        id,
      },
      data: { status: "read" },
      include: {
        becomePartnerFormQuestionAndAnswer: {
          include: {
            BespokeQuestion: true
          }
        }
      }
    });

    return new NextResponse(
      JSON.stringify({
        data: form,
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    if (error) {
      return getErrorResponse(400, "Error", error);
    }

    return getErrorResponse(500, error.message);
  }
}