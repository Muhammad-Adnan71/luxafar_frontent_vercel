"use client";
import React, { useMemo, useState } from "react";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@template-components/input";
import Breadcrumbs from "@template-components/breadcrumbs";
import Button from "@template-components/button";
import TextArea from "@template-components/textArea";
import { useGoogleReCaptcha } from "libraries/google-recaptcha";
import {
  BecomePartnerInput,
  getBecomePartnerFormInput,
} from "@utils/validations/form.schema";
import { apiPostBecomePartnerForms } from "@utils/services/forms";
import FormRadio from "@template-components/form/formRadio";
import { BespokeQuestionResponse } from "@utils/types";
import FormCheckboxMulti from "@template-components/form/formCheckBoxMulti";
import { WEB_ROUTES } from "@utils/constant";
import Success from "@template-components/modals/successDialogue";
import Container from "components/template/container";
import { pathNameByLocale } from "@utils/functions";

const BecomePartnerForm = ({
  questions,
  dictionary,
}: {
  dictionary: any;
  questions: BespokeQuestionResponse[];
}) => {
  const {
    button,
    breadCrumb,
    becomeAPartnerPage,
    placeholder,
    successModal,
    errors,
    locale,
  } = dictionary;
  const breadCrumbs = [
    { name: breadCrumb.home, url: pathNameByLocale(locale, "/") },
    {
      name: breadCrumb.becomeAPartner,
      url: pathNameByLocale(locale, WEB_ROUTES.BECOME_A_PARTNER),
    },
  ];
  const questionType: any = {
    "1": "Single Choice",
    "2": "Multiple Choice",
    "3": "Text",
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const methods = useForm<BecomePartnerInput>({
    resolver: zodResolver(getBecomePartnerFormInput({ ...errors })),
    mode: "onBlur",
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  const onSubmitHandler: SubmitHandler<any> = async (values: any) => {
    setIsLoading(true);
    const { becomePartnerFormQuestionAndAnswer, ...rest } = values;
    const becomePartnerFormQuestionAndAnswerData = questions.map(
      (ele, index) => ({
        questionId: ele.id,
        ...becomePartnerFormQuestionAndAnswer[index],
      })
    );

    let submitDataQuestions = becomePartnerFormQuestionAndAnswerData.map(
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
        const response = await apiPostBecomePartnerForms({
          ...values,
          becomePartnerFormQuestionAndAnswer: submitDataQuestions,
          gReCaptchaToken,
        });
        if (response.status === "success") {
          setIsLoading(false);
          setIsModalOpen(true);
          reset();
        }
      }
    );
  };

  return (
    <div>
      <Container>
        <div className="flex max-md:flex-col max-lg:gap-x-8 max-md:gap-y-6 justify-between gap-x-14 mb-20">
          <div className="w-2/5 max-md:w-full">
            <Breadcrumbs
              breadcrumbs={breadCrumbs}
              classes="mb-10 max-sm:hidden"
            />
            <MainHeading
              classes={`mb-8 md:text-[42px] lg:text-[55px]  ${
                locale === "ru"
                  ? "[&>span>br]:hidden xl:text-[59px]"
                  : " xl:text-[65px]"
              }`}
            >
              {becomeAPartnerPage.heading}
            </MainHeading>
            <Paragraph htmlText={becomeAPartnerPage.paragraph}></Paragraph>
          </div>
          <div className="w-[50%] max-md:w-full mb-20">
            <Paragraph>{becomeAPartnerPage.contactingAbout}</Paragraph>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div>
                  <Input
                    name="contactingAbout"
                    classes={
                      "py-[15px] px-8 mb-5 max-sm:mb-4 max-sm:py-[18px] max-sm:placeholder:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder={placeholder.companyName}
                  />
                  <TextArea
                    rows={8}
                    name="description"
                    classes={
                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder={placeholder.productService}
                  />
                  <Input
                    name="webAddress"
                    classes={
                      "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                    }
                    placeholder={placeholder.websiteAddress}
                  />
                  <div className="mb-14 mt-10">
                    <>
                      {questions.map((item, index) => {
                        return (
                          <div className="mb-10" key={index}>
                            <Paragraph classes="max-sm:text-[12px] max-sm:leading-[1.3] capitalize">
                              {item.question}
                            </Paragraph>
                            {questionType[item.type] === "Single Choice" && (
                              <>
                                <FormRadio
                                  optionClasses="w-[24%]"
                                  name={`becomePartnerFormQuestionAndAnswer.${index}.answer`}
                                  options={item.bespokeQuestionOptions.map(
                                    (ele: any) => ({
                                      label: ele.label,
                                      value: ele.label,
                                    })
                                  )}
                                />

                                {item.addOtherOption && (
                                  <Input
                                    name={`becomePartnerFormQuestionAndAnswer.${index}.additionalText`}
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
                                  name={`becomePartnerFormQuestionAndAnswer.${index}.answer`}
                                  options={item.bespokeQuestionOptions.map(
                                    (ele: any) => ({
                                      label: ele.label,
                                      value: ele.label,
                                    })
                                  )}
                                />
                                {item.addOtherOption && (
                                  <Input
                                    name={`becomePartnerFormQuestionAndAnswer.${index}.additionalText`}
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
                                name={`becomePartnerFormQuestionAndAnswer.${index}.answer`}
                                classes={
                                  "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90 placeholder:capitalize"
                                }
                                placeholder={item.textPlaceholder}
                              />
                            )}
                          </div>
                        );
                      })}
                    </>
                  </div>
                  <div className="mb-10">
                    <Paragraph>
                      {becomeAPartnerPage.contactDetailHeading}
                    </Paragraph>
                    <Input
                      name="name"
                      classes={
                        "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                      }
                      placeholder={placeholder.yourName}
                    />
                    <Input
                      name="jobTitle"
                      classes={
                        "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                      }
                      placeholder={placeholder.jobTitle}
                    />
                    <Input
                      name="email"
                      classes={
                        "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                      }
                      placeholder={placeholder.contactEmail}
                    />
                    <Input
                      name="phone"
                      classes={
                        "py-[15px] px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-5 max-sm:mb-4 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-transparent bg-[#092730] !bg-opacity-100 opacity-90"
                      }
                      placeholder={placeholder.contactTelePhone}
                    />
                  </div>
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
              </form>
            </FormProvider>
            <Success
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              message={successModal.message}
              title={successModal.heading}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BecomePartnerForm;
