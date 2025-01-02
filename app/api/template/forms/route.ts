import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { verifyCaptchaAction } from "libraries/recaptcha";
import { NextRequest, NextResponse } from "next/server";
import { emailTemplate, emailTemplatePopup } from "@utils/template/contact";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { sendEmailService, sendEmailServicePopUp } from "@utils/email-config";

export async function POST(request: NextRequest) {
  const { gReCaptchaToken, email, name, destination, formType, ...rest } =
    await request.json();
  const verify = await verifyCaptchaAction(gReCaptchaToken);

  if (!verify) {
    return new NextResponse(
      JSON.stringify({
        message: "recaptcha token is not verify",
        status: "error",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const destinationContent = await prisma.destinations.findFirst({
    where: {
      name: destination,
    },
    include: {
      inspirations: true,
      content: {
        include: {
          media: true,
        },
      },
    },
  });

  try {
    if (rest?.type === "booking") {
      const bespokeQuestion = await prisma.bespokeQuestion.findMany({});

      const questions = bespokeQuestion.map((item) => {
        return {
          type: item?.type,
          name: item?.question,
          answer: "",
          additional_text: "",
        };
      });

      await fetch(`http://54.254.236.177:8070/web/bespoke`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          params: {
            name,
            email,
            medium: "Website",
            no_of_persons: rest?.noOfTravelers,
            phone: rest.phone,
            which_country: "",
            start_date: rest?.travelingStartDate,
            end_date: rest?.travelingEndDate,
            trip_length: "",
            source: "",
            source_details: "",
            type_of_form: "Booking",
            questions: questions,
          },
        }),
      });
    } else {
      await fetch(`http://54.254.236.177:8070/web/luxafarcontactus`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          params: {
            name,
            email,
            phone: rest?.phone ? rest?.phone : " ",
            which_country: destination,
            subject: rest?.subject ? rest?.subject : "New Lead",
            message: rest.message ? rest.message : " ",
            medium: "Website",
            type_of_form: formType,
          },
        }),
      });
    }

    const form = await prisma.forms.create({
      data: {
        ...rest,
        email,
        name,
        gReCaptchaToken,
      },
    });

    if (destinationContent?.inspirations.length) {
      const inspirations = await prisma.inspirations.findMany({
        where: {
          isActive: true,
          isDeleted: false,

          destination: {
            some: {
              name: destination,
            },
          },
        },
        include: {
          destination: true,
          seoMeta: true,
          media: true,
        },
        orderBy: {
          id: "desc",
        },
        take: 3,
      });

      const [contentResponse, inspirationResponse] = await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(destinationContent?.content),
        convertMediaIdsResponseIntoMediaUrl(inspirations),
      ]);

      const bannerImage = contentResponse.find(
        (ele: any) => ele.name === "get bespoke plan"
      );
      await sendEmailService(
        email,
        emailTemplate(
          inspirationResponse,
          name,
          bannerImage?.media?.desktopMediaUrl
        )
      );
    } else {
      const destinations = await prisma.destinations.findMany({
        take: 3,
        orderBy: {
          id: "desc",
        },
        where: {
          inspirations: {
            some: {},
          },
        },
        include: {
          inspirations: {
            take: 1,
            include: {
              seoMeta: true,
              media: true,
              destination: true,
            },
          },
        },
      });
      const inspiration = destinations.map((ele: any) => ({
        ...ele.inspirations[0],
      }));
      const [inspirationResponse] = await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(inspiration),
      ]);
      if (rest?.type === "popups") {
        await sendEmailServicePopUp(email, emailTemplatePopup(inspirationResponse, name));
      } else {
        await sendEmailService(email, emailTemplate(inspirationResponse, name));
      }

    }
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
    return getErrorResponse(500, error.message);
  }
}
