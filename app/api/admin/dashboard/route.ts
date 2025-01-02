import { getErrorResponse } from "@utils/api-helpers";
import { languages } from "@utils/constant";
import { prisma } from "@utils/prisma";
import { apiTemplateDestinationByName } from "@utils/services/destination";
import { translateObj, translateService } from "@utils/translate";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "/";
    // const question = await prisma.bespokeQuestion.findMany({
    //   where: {
    //     formType: "bespoke",
    //   },
    // });
    // console.log(question);
    // question.map(async (item, index) => {
    //   await prisma.bespokeQuestion.update({
    //     where: {
    //       id: item.id,
    //     },
    //     data: {
    //       sortId: index + 1,
    //     },
    //   });
    // });
    // const destinations = await prisma.destinations.findMany({
    //   include: { seoMeta: true },
    // });
    // const tours = await prisma.tours.findMany({ include: { seoMeta: true } });
    // const inspirations = await prisma.inspirations.findMany({
    //   include: { seoMeta: true },
    // });
    // const places = await prisma.placeToVisit.findMany({
    //   include: { seoMeta: true },
    // });
    // destinations.forEach(async (ele) => {
    //   // await prisma.destinations.update({
    //   //   where: {
    //   //     id: ele.id,
    //   //   },
    //   //   data: {
    //   //     seoMeta: {
    //   //       update: {
    //   //         data: {
    //   //           slug: ele.name.replaceAll(" ", "-").toLocaleLowerCase(),
    //   //         },
    //   //       },
    //   //     },
    //   //   },
    //   // });

    //   await prisma.destinations.update({
    //     where: {
    //       id: ele.id,
    //     },
    //     data: {
    //       caughtAllRoutes: {
    //         create: {
    //           route: ele.seoMeta?.slug ?? "",
    //           layout: "destination",
    //         },
    //       },
    //     },
    //   });
    // });
    // tours.forEach(async (ele) => {
    //   await prisma.tours.update({
    //     where: {
    //       id: ele.id,
    //     },
    //     data: {
    //       caughtAllRoutes: {
    //         create: {
    //           route: ele.seoMeta?.slug ?? "",
    //           layout: "tour",
    //         },
    //       },
    //     },
    //   });
    // });
    // inspirations.forEach(async (ele) => {
    //   await prisma.inspirations.update({
    //     where: {
    //       id: ele.id,
    //     },
    //     data: {
    //       caughtAllRoutes: {
    //         create: {
    //           route: ele.seoMeta?.slug ?? "",
    //           layout: "inspiration",
    //         },
    //       },
    //     },
    //   });
    // });
    // places.forEach(async (ele) => {
    //   await prisma.placeToVisit.update({
    //     where: {
    //       id: ele.id,
    //     },
    //     data: {
    //       caughtAllRoutes: {
    //         create: {
    //           route: ele.seoMeta?.slug ?? "",
    //           layout: "place",
    //         },
    //       },
    //     },
    //   });
    // });

    revalidatePath(path);

    const [pages, forms, becomePartner, bespokeCount] =
      await prisma.$transaction([
        prisma.pages.findMany({
          where: {
            showInPages: true,
          },
          orderBy: {
            sortId: "asc",
          },
          include: {
            content: true,
          },
        }),
        prisma.forms.findMany(),
        prisma.becomePartner.count({
          where: {
            status: "unread",
          },
        }),
        prisma.bespokeForm.count({
          where: {
            status: "unread",
          },
        }),
      ]);
    const languages = await prisma.languages.findMany({});
    return new NextResponse(
      JSON.stringify({
        data: { pages, forms, becomePartner, bespokeCount, languages },
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
