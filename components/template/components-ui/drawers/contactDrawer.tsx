import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@template-components/button";
import MainHeading from "@template-components/heading";
import Input from "@template-components/input";
import TextArea from "@template-components/textArea";

import { ChevronLeftIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useGoogleReCaptcha } from "libraries/google-recaptcha";
import { apiPostForms } from "@utils/services/forms";
import Success from "@template-components/modals/successDialogue";
import {
  getContactFormInput,
  ContactInput,
} from "@utils/validations/form.schema";
import SearchSelectInput from "@template-components/searchSelect";
import { apiTemplateDestinations } from "@utils/services/destination";
import { Locale } from "i18n.config";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";

function ContactDrawer({
  dictionary,
  lang,
}: {
  dictionary: any;
  lang: Locale;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { errors, placeholder, button, contactDrawer, dropdown } = dictionary;
  const { toast } = useToast();

  const methods = useForm<ContactInput>({
    resolver: zodResolver(getContactFormInput(errors)),
    mode: "onBlur",
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  // if (!pagesWithStickyContactDrawer.includes(pathName)) return "";
  const [destinations, setDestinations] = useState<
    {
      label: string;
      value: string;
    }[]
  >();
  const [selectedDestination, setSelectedDestination] = useState<any>({});

  const getDestinations = async () => {
    const response = await apiTemplateDestinations({ locale: lang });
    if (response?.status === "success") {
      setDestinations(
        response?.data.map((destination: any) => ({
          label: destination?.name,
          value: destination?.id?.toString(),
        }))
      );
    }
  };

  useEffect(() => {
    if (isOpen === true) {
      getDestinations();
    }
  }, [isOpen]);

  const handleDestination = (value: string) => {
    setSelectedDestination({
      id: value,
      name: destinations?.find((ele: any) => ele?.value == value)?.label,
    });
  };

  const onSubmitHandler: SubmitHandler<ContactInput> = async (values: any) => {
    setIsLoading(true);
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    executeRecaptcha("enquiryFormSubmit").then(
      async (gReCaptchaToken: string) => {
        try {
          const response = await apiPostForms({
            ...values,
            formType: "Side bar",
            gReCaptchaToken,
            destination: selectedDestination.name,
          });
          if (response?.status === "success") {
            setSelectedDestination({});
            setIsLoading(false);
            setIsOpen(false);
            reset();
            setIsModalOpen(true);
          }
        } catch (error) {
          setIsLoading(false);
        }
      }
    );
  };

  return (
    <>
      <div
        className={`${
          isOpen ? "w-full z-[59] h-[100svh] absolute top-0 left-0" : ""
        }`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed top-[50svh]  translate-y-[-50%]  transition-all duration-300 bg-quaternary-color z-[99] py-8 max-sm:py-7 max-sm:px-5 px-10 w-[400px] max-sm:w-[290px] ${
            isOpen ? "right-[0px] " : "right-[-400px] max-sm:right-[-290px] "
          }`}
        >
          <div className="h-[606px]">
            <MainHeading
              classes={
                "!text-[22px] text-secondary-color  text-center !leading-0  mx-auto leading-[1.1] mb-5"
              }
            >
              {contactDrawer.contactHeading}
            </MainHeading>
            <div className="relative  mx-auto pb-5 z-20  max-sm:pb-2 ">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <Input
                    name="name"
                    classes={
                      "py-[14px]  px-8 mb-[18px]  max-sm:placeholder:text-center placeholder:opacity-100 max-sm:placeholder:text-[12px] placeholder:text-[12px] bg-quaternary-color !bg-opacity-100 opacity-90 max-sm:py-[10px]"
                    }
                    placeholder={placeholder.name}
                  />
                  <Input
                    name="email"
                    classes={
                      "py-[14px]  px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-[18px] placeholder:opacity-100 max-sm:placeholder:text-[12px] placeholder:text-[12px] bg-quaternary-color !bg-opacity-100 opacity-90 max-sm:py-[10px]"
                    }
                    placeholder={placeholder.email}
                  />
                  <Input
                    name="phone"
                    classes={
                      "py-[14px]  px-8 max-sm:py-[18px] max-sm:placeholder:text-center mb-[18px] placeholder:opacity-100 max-sm:placeholder:text-[12px] placeholder:text-[12px] bg-quaternary-color !bg-opacity-100 opacity-90 max-sm:py-[10px]"
                    }
                    placeholder={placeholder.phone}
                  />
                  <SearchSelectInput
                    onChange={handleDestination}
                    value={selectedDestination.id as string}
                    placeHolder={placeholder.destination}
                    items={destinations}
                    classNameSpan="!text-[12px] !text-[#949393]"
                    className={`${
                      lang !== "en" ? " leading-[.9]" : ""
                    } rounded-[5px] py-[20px]  px-8  max-sm:placeholder:text-center mb-[18px] placeholder:opacity-100 max-sm:placeholder:text-[12px] placeholder:text-[12px] bg-quaternary-color !bg-opacity-100 opacity-90 max-sm:py-[10px] justify-start [&>span>span]:text-[rgba(148,147,147,.9)] border-[rgba(166,151,105,.7)] max-sm:justify-center [&>span]:text-[#949393] `}
                    classNameContent="z-[99] "
                  />
                  <TextArea
                    name="message"
                    rows={10}
                    classes={
                      "py-[14px]  px-8  max-sm:placeholder:text-center mb-[18px] placeholder:opacity-100 max-sm:placeholder:text-[12px] placeholder:text-[12px] bg-quaternary-color !bg-opacity-100 opacity-90 max-sm:py-[10px]"
                    }
                    placeholder={placeholder.message}
                  />
                  <div className="text-center">
                    <Button
                      type="button"
                      buttonType="submit"
                      classes="px-8 py-2  !w-[120px]"
                      text={button.send}
                      isLoading={isLoading}
                    />
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
      <Success
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        message="Our Travel Specialist will get in touch with you shortly."
        title="Thank You"
      />

      <div
        className={`fixed  translate-y-[-50%]  top-[50vh] top-[50svh] max-sm:top-![50svh] transition-all  duration-300  bg-secondary-color z-[20] px-1 py-5 max-lg:py-4 rounded-tl-2xl rounded-bl-2xl max-lg:rounded-tl-xl max-lg:rounded-bl-xl max-lg:px-[2px] cursor-pointer max-sm:py-3 ${
          isOpen ? "right-[400px] max-sm:right-[290px]" : "right-[0]"
        }`}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <ChevronLeftIcon
          className={`ml-auto text-[#0F4150] h-6 w-6   max-sm:h-5 max-sm:w-5 ${
            isOpen ? "rotate-180" : "rotate-0"
          } `}
        />
      </div>
    </>
  );
}

export default ContactDrawer;
