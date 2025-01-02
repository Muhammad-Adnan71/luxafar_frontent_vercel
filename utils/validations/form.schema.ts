import { z } from "zod";

export function getContactFormInput(errors: any) {
  return z.object({
    name: z
      .string({
        required_error: errors.nameRequired,
      })
      .min(1, errors.nameRequired),
    phone: z
      .string({
        required_error: errors.phoneRequired,
      })
      .min(1, errors.phoneRequired),
    message: z
      .string({
        required_error: errors.messageRequired,
      })
      .min(1, errors.messageRequired),
    email: z
      .string({
        required_error: errors.emailRequired,
      })
      .min(1, errors.emailRequired)
      .email(errors.emailInvalid),
  });
}

export type ContactInput = z.infer<ReturnType<typeof getContactFormInput>>;

export function getFooterSubscribeFormInput(errors: any) {
  return z.object({
    name: z
      .string({
        required_error: errors.errors.nameRequired,
      })
      .min(1, errors.errors.nameRequired),
    message: z
      .string({
        required_error: errors.errors.messageRequired,
      })
      .optional(),
    email: z
      .string({
        required_error: errors.errors.emailRequired,
      })
      .min(1, errors.errors.emailRequired)
      .email(errors.errors.emailInvalid),
  });
}
export type FooterSubscribeInput = z.infer<
  ReturnType<typeof getFooterSubscribeFormInput>
>;

export function getContactHomeFormInput(errors: any) {
  return z.object({
    name: z
      .string({
        required_error: errors.nameRequired,
      })
      .min(1, errors.nameRequired),
    message: z
      .string({
        required_error: errors.messageRequired,
      })
      .min(1, errors.messageRequired)
      .optional(),
    subject: z
      .string({
        required_error: errors.subjectRequired,
      })
      .optional(),
    email: z
      .string({
        required_error: errors.emailRequired,
      })
      .min(1, errors.emailRequired)
      .email(errors.emailInvalid),
  });
}
export type ContactHomeInput = z.infer<
  ReturnType<typeof getContactHomeFormInput>
>;

export function getBookingFormInput(error: any) {
  return z.object({
    name: z
      .string({
        required_error: error.firstNameRequired,
      })
      .min(1, error.firstNameRequired),
    lastName: z
      .string({
        required_error: error.lastNameRequired,
      })
      .min(1, error.lastNameRequired),
    noOfTravelers: z
      .string({
        required_error: error.noOfTravelersRequired,
      })
      .min(1, error.noOfTravelersRequired),
    phone: z
      .string({
        required_error: error.phoneRequired,
      })
      .optional(),
    email: z
      .string({
        required_error: error.emailRequired,
      })
      .min(1, error.emailRequired)
      .email(error.emailInvalid),

    travelingDate: z
      .object({
        from: z.date(),
        to: z.date(),
      })
      .refine(
        (value) => {
          // Ensure both "from" and "to" are valid date strings
          return value.from !== null && value.to !== null;
        },
        {
          message:
            "Both 'from' and 'to' dates are required and must be valid dates.",
        }
      ),
  });
}

export type BookingFormInput = z.infer<ReturnType<typeof getBookingFormInput>>;

export function getContactPageFormInput(errors: any) {
  return z.object({
    name: z
      .string({
        required_error: errors.nameRequired,
      })
      .min(1, errors.nameRequired),
    phone: z
      .string({
        required_error: errors.phoneRequired,
      })
      .min(1, errors.phoneRequired),
    email: z
      .string({
        required_error: errors.emailRequired,
      })
      .min(1, errors.emailRequired)
      .email(errors.emailInvalid),
    message: z
      .string({
        required_error: errors.messageRequired,
      })
      .min(1, errors.messageRequired),
    subject: z.string({
      required_error: errors.subjectRequired,
    }),
  });
}
export type ContactPageInput = z.infer<
  ReturnType<typeof getContactPageFormInput>
>;

export function getBecomePartnerFormInput(errors: any) {
  return z.object({
    contactingAbout: z
      .string({
        required_error: errors.companyNameRequired,
      })
      .min(1, errors.companyNameRequired),
    description: z
      .string({
        required_error: errors.serviceRequired,
      })
      .min(1, errors.serviceRequired),
    name: z
      .string({
        required_error: errors.nameRequired,
      })
      .min(1, errors.nameRequired),
    jobTitle: z
      .string({
        required_error: errors.jobTitleRequired,
      })
      .min(1, errors.jobTitleRequired),
    webAddress: z.string().optional(),
    relevantDepartment: z
      .string({
        required_error: errors.relevantDepartmentRequired,
      })
      .min(1, errors.relevantDepartmentRequired),
    email: z
      .string({
        required_error: errors.emailRequired,
      })
      .min(1, errors.emailRequired)
      .email(errors.emailInvalid),
    phone: z
      .string({
        required_error: errors.phoneRequired,
      })
      .min(1, errors.phoneRequired),
  });
}

export type BecomePartnerInput = z.infer<
  ReturnType<typeof getBecomePartnerFormInput>
>;
