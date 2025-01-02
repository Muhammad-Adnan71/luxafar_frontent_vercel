import { z } from "zod";

export function getBespokeQuestionFormInput(errors: any) {
  return z.object({
    id: z.number({}).optional(),
    name: z
      .string({
        required_error: errors.nameRequired,
      })
      .min(1, errors.nameRequired),
    email: z
      .string({
        required_error: errors.emailRequired,
      })
      .min(1, errors.emailRequired)
      .email(errors.emailInvalid),
    otherCountry: z
      .string({
        required_error: "otherCountry title is required",
      })
      .nullish(),
    countryCode: z
      .string({
        required_error: "description title is required",
      })
      .nullish(),

    phoneNumber: z
      .string({
        required_error: errors.phoneRequired,
      })
      .min(1, errors.phoneRequired),

    preferredCountry: z
      .string({
        required_error: "description title is required",
      })
      .nullish(),

    tripDays: z
      .string({
        required_error: "description title is required",
      })
      .nullish(),
    bespokeFormQuestionAndAnswer: z
      .array(
        z
          .object({
            answer: z
              .union([z.string(), z.array(z.string())])
              .nullish()
              .optional(),
            additionalText: z.string().nullish().optional(),
          })
          .nullish()
          .optional()
      )
      .nullish()
      .optional(),

    whereDidYouHear: z
      .string({
        required_error: "otherCountry title is required",
      })
      .nullish()
      .optional(),
    social: z
      .string({
        required_error: "otherCountry title is required",
      })
      .nullish()
      .optional(),
    referralName: z
      .string({
        required_error: "otherCountry title is required",
      })
      .nullish()
      .optional(),
    other: z
      .string({
        required_error: "otherCountry title is required",
      })
      .nullish()
      .optional(),
    travelingDate: z
      .object({
        from: z.date().optional().nullable(),
        to: z.date().optional().nullable(),
      })
      .optional()
      .nullable(),
  });
}
export type BespokeQuestionInput = z.infer<
  ReturnType<typeof getBespokeQuestionFormInput>
>;
