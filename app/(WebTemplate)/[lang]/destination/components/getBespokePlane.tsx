import Container from "components/template/container";
import React, { useState } from "react";
import ImageThumbnails from "@template-components/imageThumbnails";
import SectionTitleHeader from "components/CMS/components-ui/sectionTitleHeader";
import TourCardWrapper from "components/template/container/tourCardWrapper";
import MainHeading from "@template-components/heading";
import Paragraph from "@template-components/paragraph";
import Subheading from "@template-components/sub-heading";
import Input from "@template-components/input";
import TextArea from "@template-components/textArea";
import Button from "@template-components/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "components/CMS/components-ui/shadcn/ui/radio-group";
import { Label } from "components/CMS/components-ui/shadcn/ui/label";
import PlanContactBanner from "@template-components/planContactBanner";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import Gallery from "@template-components/gallery";
import PlaceCardWrapper from "components/template/container/placeCardWrapper";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  ContactHomeInput,
  getContactHomeFormInput,
} from "@utils/validations/form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiPostForms } from "@utils/services/forms";
import Success from "@template-components/modals/successDialogue";
import {
  ContentResponse,
  InspirationResponse,
  TourResponse,
} from "@utils/types";
import { pathNameByLocale, replaceSpacesWithDash } from "@utils/functions";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import { useRouter } from "next/navigation";
import { WEB_ROUTES } from "@utils/constant";
import Testimonials from "@template-components/testimonials";

export default function GetBespokePlane({
  destination,
  places,
  about,
  tours,
  blogs,
  gallery,
  locales,
  testimonials,
}: {
  testimonials: any;
  locales: any;
  about?: ContentResponse;
  gallery: any;
  destination?: { name: string; id: string; slug: string };
  places?: { image: any; title: string; description: string }[];
  blogs?: InspirationResponse[];
  tours?: TourResponse[];
}) {
  const {
    planContactBanner,
    button,
    placeholder,
    destinationPage,
    radioButton,
    successModal,
    errors,
    testimonialClientLove,
    locale,
  } = locales;
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const methods = useForm<ContactHomeInput>({
    resolver: zodResolver(getContactHomeFormInput({ ...errors })),
    mode: "onBlur",
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  const onSubmitHandler: SubmitHandler<ContactHomeInput> = async (
    values: any
  ) => {
    setIsLoading(true);
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    executeRecaptcha("enquiryFormSubmit").then(
      async (gReCaptchaToken: string) => {
        const response = await apiPostForms({
          ...values,
          formType: "Contact destination",
          gReCaptchaToken,
          destination: destination?.name,
        });
        if (response.status === "success") {
          setIsLoading(false);
          reset();
          setIsModalOpen(true);
        }
      }
    );
  };

  const destinationName =
    destination &&
    destination?.name?.charAt(0).toUpperCase() + destination?.name?.slice(1);
  const { scroll } = useLocomotiveScroll();

  return (
    <Container>
      <section className="my-20 max-md:mt-16">
        <div className="flex gap-20 w-full max-lg:gap-12 max-md:flex-col">
          <div className="w-[45%] max-md:w-full">
            <MainHeading classes={"pb-16 max-md:pb-5"}>
              {destinationPage.allAbout}
              <strong className="block text-secondary-color !font-heading is-inview">
                {destination?.name}
              </strong>
            </MainHeading>

            <Paragraph
              htmlText={about?.description}
              classes="md:pb-2"
            ></Paragraph>
            {places?.length ? (
              <ImageThumbnails
                locale={locale}
                viewAllPlaces={button.viewAllPlaces}
                thumbnails={places}
                classes="mt-12 max-md:mt-7"
                destination={destination}
              />
            ) : (
              ""
            )}
          </div>
          <div className="w-[55%] max-md:w-full">
            <Subheading classes="!text-[18px] pb-12 pt-10 !font-body uppercase font-semibold max-md:!text-center max-md:!text-[12px] max-md:!pb-8 max-md:!pt-5">
              {destinationPage.contactHeading}
            </Subheading>
            <div className="">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <Input
                    name="name"
                    classes={
                      "py-[20px] px-12 mb-[18px] placeholder:text-white max-sm:py-[14px] max-sm:px-6 max-sm:placeholder:text-center placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[transparent]  opacity-90"
                    }
                    placeholder={placeholder.name}
                  />
                  <Input
                    name="email"
                    classes={
                      "py-[20px] px-12 max-sm:py-[14px] max-sm:px-6 placeholder:text-white max-sm:placeholder:text-center mb-[18px] placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[transparent] opacity-90"
                    }
                    placeholder={placeholder.email}
                  />
                  <Input
                    name="subject"
                    classes={
                      "py-[20px] px-12 max-sm:py-[14px] max-sm:px-6 placeholder:text-white max-sm:placeholder:text-center mb-[18px] placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[transparent] opacity-90"
                    }
                    placeholder={placeholder.subject}
                  />
                  <TextArea
                    rows={10}
                    name="message"
                    classes={
                      "py-[20px] px-12 max-sm:py-[14px] max-sm:px-6 placeholder:text-white max-sm:placeholder:text-center mb-2 placeholder:opacity-60 max-sm:placeholder:text-[12px] placeholder:text-[14px] bg-[transparent] opacity-90"
                    }
                    placeholder={placeholder.message}
                  />
                  <Paragraph classes="opacity-70 pt-3 font-light max-sm:!text-[12px] !text-[18px] max-md:text-center">
                    {destinationPage.receiveUpdates}
                  </Paragraph>
                  <RadioGroup
                    className="flex gap-7 mt-5 mb-10 max-md:justify-center"
                    defaultValue="no"
                  >
                    <div className="flex items-center space-x-3 ">
                      <RadioGroupItem
                        value="yes"
                        id="r2"
                        className="border-secondary-color w-[20px] h-[20px] max-sm:w-[15px] max-sm:h-[15px] border-[2px]"
                      />
                      <Label
                        htmlFor="r2"
                        className="text-[18px] max-sm:text-[14px] opacity-70 font-light"
                      >
                        {radioButton.yes}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="no"
                        id="r3"
                        className="border-secondary-color w-[20px] h-[20px] max-sm:w-[15px] max-sm:h-[15px] border-[2px]"
                      />
                      <Label
                        htmlFor="r3"
                        className="text-[18px] max-sm:text-[14px] opacity-70 font-light"
                      >
                        {radioButton.no}
                      </Label>
                    </div>
                  </RadioGroup>
                  <div className="max-md:text-center">
                    <Button
                      type="button"
                      buttonType="submit"
                      classes="px-14 max-sm:px-12 !text-[14px] !py-[11px] max-sm:!text-[12px]"
                      text={button.send}
                      isLoading={isLoading}
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
        </div>
      </section>

      <div>
        {tours?.length ? (
          <section className="my-20 max-md:mb-10  max-md:mt-0">
            <SectionTitleHeader
              locale={locale}
              buttonURL=""
              buttonClick={(e: any) => {
                e.preventDefault();
                router.push(
                  pathNameByLocale(
                    locale,
                    `/${replaceSpacesWithDash(
                      destination?.slug as string
                    )}?tab=tours`
                  )
                );
                const headerHeight =
                  document.getElementsByTagName("header")[0]?.offsetHeight;
                const innerPageBanner = document.getElementById(
                  "innerPageBanner"
                ) as HTMLElement;
                scroll.scrollTo(innerPageBanner?.offsetHeight + headerHeight, {
                  duration: 500,
                  disableLerp: true,
                });
              }}
              classes="mb-20 max-lg:mb-10"
              title={
                <>
                  {destinationPage.browseOur}
                  <strong className="block text-secondary-color !font-heading">
                    {destinationPage.toursTo} {destination?.name}
                  </strong>
                </>
              }
              buttonText={button.browseAllTours}
            />
            <TourCardWrapper
              locale={locale}
              dictionary={{ destinationPage, button }}
              tours={tours}
            />
            <div className="md:hidden text-center mt-10">
              <Button
                redirect={pathNameByLocale(
                  locale,
                  "/" +
                    `${replaceSpacesWithDash(
                      destination?.slug as string
                    )}?tab=tours`
                )}
                classes="!text-[14px] max-sm:mb-0 max-sm:!text-[12px]"
                text={button.browseAllTours}
              />
            </div>
          </section>
        ) : (
          ""
        )}
      </div>

      <Testimonials
        classes="w-full"
        clientLove={testimonialClientLove}
        testimonials={testimonials}
      />
      <div>
        {places?.length ? (
          <section className="my-20 max-md:mt-0">
            <SectionTitleHeader
              locale={locale}
              buttonURL=""
              classes="mb-20 max-lg:mb-10"
              mainHeadingClasses="max-sm:!text-[42px] max-[430px]:!text-[36px] max-[380px]:!text-[30px]"
              title={destinationPage.browseAttraction}
              buttonText={button.seeAllAttractions}
              buttonClick={(e: any) => {
                e.preventDefault();
                router.push(
                  pathNameByLocale(
                    locale,
                    `/${replaceSpacesWithDash(
                      destination?.slug as string
                    )}?tab=places-to-visit`
                  )
                );
                const headerHeight =
                  document.getElementsByTagName("header")[0]?.offsetHeight;
                const innerPageBanner = document.getElementById(
                  "innerPageBanner"
                ) as HTMLElement;
                scroll.scrollTo(innerPageBanner?.offsetHeight + headerHeight, {
                  duration: 500,
                  disableLerp: true,
                });
              }}
            />
            <PlaceCardWrapper
              locale={locale}
              buttonText={button.readMore}
              destination={destination?.name}
              places={places?.slice(0, 3)}
            />

            <div className="md:hidden text-center mt-10 max-sm:mt-14">
              <Button
                redirect={pathNameByLocale(
                  locale,
                  `/${replaceSpacesWithDash(
                    destination?.slug as string
                  )}?tab=places-to-visit`
                )}
                classes={`!text-[14px] ${
                  locale === "ru"
                    ? "max-sm:!text-[9px]"
                    : "max-sm:!text-[11px] "
                }`}
                text={button.seeAllAttractions}
              />
            </div>
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-20 max-md:mt-0">
        <PlanContactBanner
          title={planContactBanner.heading}
          description={`${planContactBanner.description1} ${destinationName} ${planContactBanner.description2}`}
          buttonText={button.getBespokePlan}
          buttonURL={`${WEB_ROUTES.BESPOKE_HOLIDAY}`}
          locale={locale}
        />
      </section>
      <div>
        {blogs?.length ? (
          <section className="my-20 max-md:mt-0">
            <SectionTitleHeader
              locale={locale}
              classes=" mb-20 max-lg:mb-10 "
              title={
                <>
                  {destinationPage.articlesRelated}
                  <strong className="block text-secondary-color !font-heading">
                    {destinationPage.articlesRelatedTo} {destination?.name}
                  </strong>
                </>
              }
              buttonText={blogs.length > 3 ? button.browseAllInspiration : ""}
              buttonURL={`${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                destination?.slug
              )}`}
            />
            <BlogCardWrapper
              locale={locale}
              readMore={button.readMore}
              showAll={true}
              blogs={blogs?.slice(0, 3)}
              destinationName={destination?.name}
            />
            {blogs.length > 3 && (
              <div className="md:hidden text-center mt-10 max-sm:mt-14">
                <Button
                  redirect={pathNameByLocale(
                    locale,
                    `${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(
                      destination?.slug
                    )}`
                  )}
                  classes="!text-[14px] max-sm:!text-[11px]"
                  text={button.seeAllInspiration}
                />
              </div>
            )}
          </section>
        ) : (
          ""
        )}
      </div>
      <section className="my-20 max-md:mt-0 max-md:mb-0" id="gallery">
        <SectionTitleHeader
          locale={locale}
          classes="mb-20 max-md:mb-14"
          title={
            <>
              <strong className="inline-block text-secondary-color !font-heading">
                {destinationPage.gallery}
              </strong>
            </>
          }
        />
        <Gallery classes="mb-40 max-sm:mb-16" images={gallery} />
      </section>
    </Container>
  );
}
