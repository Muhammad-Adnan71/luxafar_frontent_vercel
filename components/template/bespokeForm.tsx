"use client";
import React, { useEffect, useState } from "react";
import Container from "./container";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import SelectInput from "@template-components/select";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@template-components/input";
import Breadcrumbs from "@template-components/breadcrumbs";
import { cn, pathNameByLocale } from "@utils/functions";
import Button from "@template-components/button";
import { BespokeQuestionResponse } from "@utils/types";
import { apiTemplateDestinations } from "@utils/services/destination";
import FormRadio from "@template-components/form/formRadio";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { apiBespokeForm } from "@utils/services/bespoke";
import CodeInput from "@template-components/codeInput";
import Success from "@template-components/modals/successDialogue";
import FormCheckboxMulti from "@template-components/form/formCheckBoxMulti";
import {
  BespokeQuestionInput,
  getBespokeQuestionFormInput,
} from "@utils/validations/bespokeform.schema";
import useBespokeStore from "store/useBespoke";
import { WEB_ROUTES, countriesCode } from "@utils/constant";
import { DatePickerWithRange } from "@template-components/form/formDatePicker";

const BespokeForm = ({
  questions,
  dictionary,
}: {
  dictionary: any;
  questions: BespokeQuestionResponse[];
}) => {
  const bespokeStore = useBespokeStore();
  const [destination, setDestination] = useState<any>([]);
  const [selectedCode, setSelectedCode] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [whereDidYouHear, setWhereDidYouHear] = useState("");
  const {
    button,
    breadCrumb,
    successModal,
    placeholder,
    bespokePage,
    errors,
    locale,
  } = dictionary;
  const [selectedDestination, setSelectedDestination] = useState<string>();
  const breadCrumbs = [
    { name: breadCrumb.home, url: pathNameByLocale(locale, "/") },
    {
      name: breadCrumb.bespokeHoliday,
      url: pathNameByLocale(locale, WEB_ROUTES.BESPOKE_HOLIDAY),
    },
  ];

  const methods = useForm<BespokeQuestionInput>({
    resolver: zodResolver(getBespokeQuestionFormInput({ ...errors })),
    values: bespokeStore.bespokeResponse,
    mode: "onBlur",
  });
  const { reset, handleSubmit } = methods;

  const questionType: any = {
    "1": "Single Choice",
    "2": "Multiple Choice",
    "3": "Text",
  };

  useEffect(() => {
    getDestination();
  }, []);
  useEffect(() => {
    setSelectedCode(bespokeStore?.bespokeResponse?.selectedCode);
  }, [bespokeStore]);

  useEffect(() => {
    setSelectedDestination(bespokeStore?.bespokeResponse?.selectedDestination);
  }, [destination]);

  const getDestination = async () => {
    const response = await apiTemplateDestinations();
    if (response.status === "success") {
      setDestination(
        response.data.map((ele: any) => ({
          label: ele.name,
          value: ele.name,
        }))
      );
    }
  };

  const onSubmitHandler: SubmitHandler<any> = async (values: any) => {
    setIsLoading(true);

    const { travelingDate, bespokeFormQuestionAndAnswer, ...rest } = values;
    const bespokeFormQuestionAndAnswerData = questions.map((ele, index) => ({
      questionId: ele.id,

      ...bespokeFormQuestionAndAnswer[index],
    }));

    let submitDataQuestions = bespokeFormQuestionAndAnswerData.map(
      (ele: any) => {
        return {
          ...ele,
          answer: ele?.answer ? ele?.answer.toString() : "",
        };
      }
    );
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    executeRecaptcha("enquiryFormSubmit").then(
      async (gReCaptchaToken: string) => {
        try {
          const response = await apiBespokeForm({
            ...rest,
            travelingStartDate: travelingDate?.from,
            travelingEndDate: travelingDate?.to,
            countryCode: selectedCode,
            preferredCountry: selectedDestination,
            bespokeFormQuestionAndAnswer: submitDataQuestions,
            gReCaptchaToken,
          });
          if (response.status === "success") {
            setIsLoading(false);
            setTimeout(() => {
              window.open(
                "https://calendly.com/bespoke-holidays/",
                "_blank",
                "noopener,noreferrer"
              );
            }, 1000);

            bespokeStore.reset();
            setIsModalOpen(true);
            setSelectedCode("");
            setSelectedDestination("");
            setWhereDidYouHear("");
            reset();
          }
        } catch (error) {
          setIsLoading(false);
        }
      }
    );
  };
  const handleCheckbox = (value: string) => {
    setWhereDidYouHear(value);
  };

  return (
    <div>
      <Container>
        <div className="flex max-md:flex-col max-lg:gap-x-8 justify-between gap-x-14 mb-40 max-sm:mb-20">
          <div className="w-2/5 max-md:w-full">
            <Breadcrumbs
              breadcrumbs={breadCrumbs}
              classes="mb-10 max-sm:hidden"
            />
            <MainHeading
              isHeadingH1={true}
              classes={
                "mb-8 md:text-[42px] lg:text-[55px] xl:text-[65px] 2xl:text-[74px]"
              }
            >
              {bespokePage.letsPlan} <br /> {bespokePage.your}{" "}
              <strong className="inline text-secondary-color">
                {bespokePage.journey}
              </strong>
            </MainHeading>
            <Paragraph classes="max-sm:text-[12px] max-sm:leading-[1.3]">
              {bespokePage.paragraph}
            </Paragraph>
          </div>
          <div className="w-[55%] max-md:w-full">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div>
                  <Input
                    name="name"
                    classes={
                      "py-[15px] px-8 mb-5 max-sm:mb-4 max-sm:py-[18px] max-sm:placeholder:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder={placeholder.name}
                  />
                  <Input
                    name="email"
                    classes={
                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder={placeholder.email}
                  />
                  <div className="flex max-lg:gap-x-1 max-sm:gap-x-2 gap-x-6 justify-between mb-1 max-sm:mb-4">
                    <div className="w-1/5 max-lg:w-[22%] max-sm:w-[32%] rounded-md relative border-[#6F6A5A] ">
                      <CodeInput
                        name="countryCode"
                        placeHolder={placeholder.code}
                        onChange={(value: any) => {
                          setSelectedCode(value.split(" ")?.[0]);
                        }}
                        classes={cn([
                          "py-[15px] px-8 mb-5 max-sm:mb-4 max-sm:py-[18px] max-sm:text-center placeholder:opacity-60  placeholder:!text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90  max-sm:h-[54px] opacity-90 placeholder:text-[#949393] leading-[1] max-sm:mb-0 [&>.arrowIcon]:!right-[5px] [&>.arrowIcon]:opacity-80",
                        ])}
                        value={selectedCode as string}
                        items={[
                          ...countriesCode.map((item: any, index: any) => ({
                            value: item.code.toString(),
                            label: `${item.code}  ${item.name}`,
                          })),
                        ]}
                      />
                    </div>
                    <div className="w-3/4">
                      <Input
                        name="phoneNumber"
                        classes={
                          "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center  placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                        }
                        placeholder={placeholder.phone}
                      />
                    </div>
                  </div>
                  <SelectInput
                    name="preferredCountry"
                    placeHolder={placeholder.destination}
                    onChange={(value: any) => setSelectedDestination(value)}
                    classes={cn([
                      "py-[15px] px-8 mb-5 max-sm:mb-4 max-sm:py-[18px] max-sm:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 max-sm:h-[54px] opacity-90 placeholder:text-[#949393] leading-[1] max-sm:mb-4 [&>.arrowIcon]:!right-[5px] [&>.arrowIcon]:opacity-80",
                    ])}
                    value={selectedDestination as string}
                    items={[
                      ...destination,
                      {
                        label: placeholder.somewhereElse,
                        value: "somewhere else",
                      },
                    ]}
                  />
                  {selectedDestination === "somewhere else" && (
                    <Input
                      name="otherCountry"
                      classes={
                        "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                      }
                      placeholder={placeholder.otherCountry}
                    />
                  )}
                  <DatePickerWithRange
                    className={`${
                      locale === "ru"
                        ? "max-sm:[&_button]:px-3 [&_span]:whitespace-nowrap bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                        : " bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 mb-4 max-sm:!text-[12px]"
                    }`}
                    name="travelingDate"
                    placeholderClassName="text-[14px] max-sm:!text-[12px]"
                    placeholder={placeholder.whenIsTheHoliday}
                    errorMessage={errors?.travelingDate?.message}
                  />
                  <Input
                    name="tripDays"
                    classes={
                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder={placeholder.tripLength}
                  />
                  <>
                    {questions?.map((item, index) => {
                      return (
                        <div className="mb-10" key={index}>
                          <Paragraph classes="max-sm:text-[12px] max-sm:leading-[1.3] capitalize">
                            {item.question}
                          </Paragraph>
                          {questionType[item.type] === "Single Choice" && (
                            <>
                              <FormRadio
                                name={`bespokeFormQuestionAndAnswer.${index}.answer`}
                                options={item.bespokeQuestionOptions?.map(
                                  (ele: any) => ({
                                    label: ele.label,
                                    value: ele.label,
                                  })
                                )}
                              />

                              {item.addOtherOption && (
                                <Input
                                  name={`bespokeFormQuestionAndAnswer.${index}.additionalText`}
                                  classes={
                                    "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 placeholder:capitalize"
                                  }
                                  placeholder={item.textPlaceholder}
                                />
                              )}
                            </>
                          )}
                          {questionType[item.type] === "Multiple Choice" && (
                            <>
                              <FormCheckboxMulti
                                name={`bespokeFormQuestionAndAnswer.${index}.answer`}
                                options={item.bespokeQuestionOptions?.map(
                                  (ele: any) => ({
                                    label: ele.label,
                                    value: ele.label,
                                  })
                                )}
                              />
                              {item.addOtherOption && (
                                <Input
                                  name={`bespokeFormQuestionAndAnswer.${index}.additionalText`}
                                  classes={
                                    "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 placeholder:capitalize"
                                  }
                                  placeholder={item.textPlaceholder}
                                />
                              )}
                            </>
                          )}
                          {questionType[item.type] === "Text" && (
                            <Input
                              name={`bespokeFormQuestionAndAnswer.${index}.answer`}
                              classes={
                                "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 placeholder:capitalize"
                              }
                              placeholder={item.textPlaceholder}
                            />
                          )}
                        </div>
                      );
                    })}
                    <Paragraph classes="max-sm:text-[12px] max-sm:leading-[1.3] capitalize">
                      {placeholder.whereDidYouHearAboutUs}
                    </Paragraph>
                    <FormRadio
                      onChange={handleCheckbox}
                      name={`whereDidYouHear`}
                      options={[
                        {
                          label: placeholder.socialMedia,
                          value: "social Media",
                        },
                        {
                          label: placeholder.google,
                          value: "google",
                        },
                        {
                          label: placeholder.emailMarketing,
                          value: "email marketing",
                        },
                        {
                          label: placeholder.clientReferral,
                          value: "client referral",
                        },
                        {
                          label: placeholder.other,
                          value: "other",
                        },
                      ]}
                    />
                    {whereDidYouHear === "social Media" && (
                      <FormRadio
                        name={`social`}
                        options={[
                          {
                            label: placeholder.instagram,
                            value: "instagram",
                          },
                          {
                            label: placeholder.facebook,
                            value: "facebook",
                          },
                          {
                            label: placeholder.linkedin,
                            value: "linkedin",
                          },
                        ]}
                      />
                    )}
                    {whereDidYouHear === "client referral" && (
                      <Input
                        name="referralName"
                        classes={
                          "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                        }
                        placeholder={placeholder.clientName}
                      />
                    )}
                    {whereDidYouHear === "other" && (
                      <Input
                        name="other"
                        classes={
                          "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                        }
                        placeholder={placeholder.other}
                      />
                    )}
                  </>
                </div>
                <div className="max-md:text-center">
                  <Button
                    isLoading={isLoading}
                    type="button"
                    buttonType="submit"
                    classes="px-8 max-sm:px-10 !text-[14px] !py-[10px] max-sm:!text-[12px]"
                    text={button.submit}
                  />
                </div>
                <Success
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  message={successModal.message}
                  title={successModal.heading}
                />
              </form>
            </FormProvider>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BespokeForm;
