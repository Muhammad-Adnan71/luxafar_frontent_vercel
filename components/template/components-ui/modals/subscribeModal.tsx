import React, { useEffect, useState } from "react";
import Input from "@template-components/input";
import Paragraph from "@template-components/paragraph";
import Button from "@template-components/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import Success from "./successDialogue";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  FooterSubscribeInput,
  getFooterSubscribeFormInput,
} from "@utils/validations/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPostForms } from "@utils/services/forms";
import Subheading from "@template-components/sub-heading";
import { cn } from "@utils/functions";
import plane from "@public/template/luxafarlogo.png";
import modalImage1 from "@public/template/modal-adventure.png";
import Image from "next/image";
import usePreloader from "store/usePreloader";

export default function SubscribeModal({ dictionary }: { dictionary?: any }) {
  const { placeholder, subscribeModal, button, errors, locale } = dictionary;
  const [isFormLoading, setIsFormLoading] = useState(false);
  const { isLoading } = usePreloader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setIsOpen(true);
      }, 30000);
    }
  }, [isLoading]);

  const { executeRecaptcha } = useGoogleReCaptcha();
  const methods = useForm<FooterSubscribeInput>({
    resolver: zodResolver(getFooterSubscribeFormInput({ errors })),
    mode: "onBlur",
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmitHandler: SubmitHandler<FooterSubscribeInput> = async (
    values: any
  ) => {
    setIsFormLoading(true);
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    executeRecaptcha("enquiryFormSubmit").then(
      async (gReCaptchaToken: string) => {
        const response = await apiPostForms({
          ...values,
          gReCaptchaToken,
          type: "popups",
          formType: "Popup",
        });
        setIsFormLoading(false);
        if (response.status === "success") {
          setIsOpen(false);
          reset();
          setIsModalOpen(true);
        }
      }
    );
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        {/* <Dialog.DialogTrigger asChild>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
            type="button"
            buttonType="button"
            classes={` xl:text-[11px] w-full max-sm:w-fit !py-4 z-0 after:z-0`}
            text={"open"}
          />
        </Dialog.DialogTrigger> */}
        <Dialog.Portal>
          <Dialog.Overlay className="bg-[black] bg-opacity-[0.447] data-[state=open]:animate-overlayShow fixed inset-0 min-h-[490px]" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] min-h-[490px] max-w-[750px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[url('/template/modal1bg.png')] bg-cover bg-center  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none max-sm:overflow-y-auto z-50">
            <button
              className="text-secondary-color hover:bg-quaternary-color focus:shadow-cms-secondary-color absolute top-[20px] right-[25px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_1px] z-[20] focus:outline-none z-[-9] border-secondary-color border-[1px]"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            >
              <Cross1Icon className="w-4 h-4" />
            </button>

            <div className="w-full relative pt-[40px] px-[40px] max-sm:px-[30px]">
              <Image
                src={modalImage1}
                alt="image"
                className="absolute bottom-[0] right-[0] w-[280px] h-auto max-lg:w-[230px] max-sm:w-[180px] max-[425px]:w-[160px]"
              />
              <Subheading
                classes={cn([
                  "font-[700] text-[30px] max-xl:text-[24px] max-lg:text-[23px] max-sm:text-[22px] leading-[1.2] w-[70%] max-md:w-full text-[#7F671F] mb-1",
                ])}
              >
                {subscribeModal.heading}
              </Subheading>
              <Paragraph classes="text-[20px] max-sm:text-[14px] text-[#002831] font-[700]">
                {subscribeModal.subHeading}
              </Paragraph>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <div className="w-1/2 max-sm:w-full">
                    <div className="">
                      <Input
                        name="name"
                        classes={
                          "py-[15px] px-8 mb-5 max-sm:mb-4 max-sm:py-[18px] max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[#f2eeeb] !bg-opacity-80 border-[#7F671F] border-[1px] text-quaternary-color text-quaternary-color placeholder:text-quaternary-color"
                        }
                        placeholder={placeholder.name}
                      />
                      <Input
                        name="email"
                        classes={
                          "py-[15px] px-8 mb-5 max-sm:mb-4 max-sm:py-[18px] max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[#f2eeeb] !bg-opacity-80 border-[#7F671F] border-[1px] text-quaternary-color text-quaternary-color placeholder:text-quaternary-color"
                        }
                        placeholder={placeholder.email}
                      />
                    </div>
                    <div className="mt-3 max-sm:mt-0 max-sm:flex-col max-sm:gap-y-5">
                      <Button
                        isLoading={isFormLoading}
                        type="button"
                        buttonType="submit"
                        classes="px-8 max-sm:px-6 !text-[14px] !py-[10px] max-sm:!text-[12px]"
                        text={button.subscribe}
                      />
                    </div>
                  </div>
                </form>
              </FormProvider>
              <div className="w-[130px] py-5 max-sm:w-[100px]">
                <Image
                  src={plane}
                  alt="luxafar logo"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Success
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        // message={successModal.message}
        // title={successModal.heading}
      />
    </>
  );
}
