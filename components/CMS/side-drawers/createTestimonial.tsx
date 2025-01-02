import React, { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "components/CMS/components-ui/shadcn/ui/sheet";

import { Label } from "../components-ui/shadcn/ui/label";
import Card from "../components-ui/card";
import CardBody from "../components-ui/cardBody";
import { isFile, removeTags, truncateText } from "@utils/functions";
import FormInput from "../components-ui/form/formInput";
import FormTextEditor from "../components-ui/form/formTextEditor";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import SaveButton from "../components-ui/saveButton";
import { TestimonialInput } from "@utils/validations/testimonial.schema";
import { useToast } from "../components-ui/shadcn/ui/use-toast";
import SingleImageUploader from "../components-ui/singleImageUploader";
import {
  apiPostTestimonialService,
  apiUpdateTestimonial,
} from "@utils/services/testimonial";
import { apiUploadsMediaService } from "@utils/services/uploads";
import { handleApiError } from "@utils/api-helpers";
import FormSelect from "../components-ui/form/formSelect";
import { apiGetAllDestinationService } from "@utils/services/destination";

export type ModalType = {
  isOpen: boolean;
  setIsOpen: () => void;
  onCreate: Function;
  children?: ReactNode;
  isEdit: boolean;
  selectedRow: any;
  onEdit: Function;
  testimonialLength?: number;
  byDestination?: boolean;
};

function CreateTestimonial({
  onCreate,
  isEdit,
  selectedRow,
  isOpen,
  setIsOpen,
  onEdit,
  testimonialLength,
  byDestination,
}: ModalType) {
  const { toast } = useToast();
  const [destinationData, setDestinationData] = useState([]);

  const methods = useForm<TestimonialInput>({
    // resolver: zodResolver(TestimonialSchema),
    mode: "onBlur",
    values: isEdit
      ? {
          ...selectedRow,
          destinationId: selectedRow?.destinationId?.toString(),
        }
      : {},
  });

  const { reset, handleSubmit } = methods;

  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    if (isEdit) {
      const { id, clientImageMedia, destinationImageMedia, ...rest } = values;
      try {
        const id = selectedRow.id;
        const clientImageMediaResponse =
          isFile(clientImageMedia?.desktopMediaUrl) &&
          (await apiUploadsMediaService({
            desktopMediaUrl: clientImageMedia?.desktopMediaUrl as File,
          }));

        const destinationImageMediaResponse =
          isFile(destinationImageMedia?.desktopMediaUrl) &&
          (await apiUploadsMediaService({
            desktopMediaUrl: destinationImageMedia?.desktopMediaUrl as File,
          }));

        const response = await apiUpdateTestimonial(id, {
          ...rest,
          ...(destinationImageMediaResponse && {
            destinationImageMedia: {
              ...destinationImageMedia,
              desktopMediaUrl:
                destinationImageMediaResponse?.data?.[0]?.desktopMediaUrl,
            },
          }),
          ...(clientImageMediaResponse && {
            clientImageMedia: {
              ...clientImageMedia,
              desktopMediaUrl:
                clientImageMediaResponse?.data?.[0]?.desktopMediaUrl,
            },
          }),
        });

        onEdit(response.data);
        toast({
          title: "Testimonial Edited Successfully",
          variant: "success",
        });
        reset();
      } catch (error: any) {
        handleApiError(error);
      }
    } else {
      const { clientImageMedia, destinationImageMedia, ...rest } = values;

      try {
        const clientImageMediaResponse = await apiUploadsMediaService({
          desktopMediaUrl: clientImageMedia?.desktopMediaUrl as File,
        });
        const destinationImageMediaResponse = await apiUploadsMediaService({
          desktopMediaUrl: destinationImageMedia?.desktopMediaUrl as File,
        });

        const response = await apiPostTestimonialService({
          ...rest,
          ...(byDestination ? {} : { sortId: Number(testimonialLength) + 1 }),
          ...(clientImageMediaResponse && {
            clientImageMedia: {
              ...clientImageMedia,
              desktopMediaUrl:
                clientImageMediaResponse.data[0]?.desktopMediaUrl,
            },
          }),
          ...(destinationImageMediaResponse && {
            destinationImageMedia: {
              ...destinationImageMedia,
              desktopMediaUrl:
                destinationImageMediaResponse.data[0]?.desktopMediaUrl,
            },
          }),
        });

        onCreate(response.data);
        toast({
          title: "Testimonial Created Successfully",
          variant: "success",
        });
        reset();
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };

  const apiGetAllDestination = async () => {
    const response = await apiGetAllDestinationService({
      active: "true",
      sortBy: "name",
    });
    if (response?.status === "success") {
      setDestinationData(response.data);
    }
  };

  useEffect(() => {
    reset();

    if (byDestination && isOpen) apiGetAllDestination();
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[800px] h-screen overflow-scroll">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <SheetHeader className="flex justify-between flex-row items-center w-full mb-3">
              <SheetTitle>
                {isEdit
                  ? "Testimonial - " +
                    truncateText(removeTags(selectedRow?.description))
                  : "Create Testimonial"}
              </SheetTitle>
            </SheetHeader>
            <SheetDescription>
              <div>
                <Card>
                  <CardBody>
                    <div className="flex  gap-4">
                      <div className=" w-3/4 ">
                        <div className=" flex  gap-5">
                          <FormInput
                            label="client Name"
                            name="clientName"
                            placeholder="Enter Client Name"
                          />
                        </div>

                        <FormInput
                          label="Client location"
                          name="clientLocation"
                          placeholder="Enter Client Location"
                        />
                        {byDestination && (
                          <FormSelect
                            name="destinationId"
                            label="Destination"
                            options={destinationData.map((item: any) => ({
                              value: item.id.toString(),
                              label: item.name,
                            }))}
                            placeholder="Select Destination"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 mt-5 w-1/4">
                        <SingleImageUploader
                          classes={byDestination ? "h-[200px] mt-5" : ""}
                          name="clientImageMedia"
                          label="Client Image"
                        />
                      </div>
                    </div>

                    <div className="">
                      <FormTextEditor label="testimonial" />
                    </div>
                    <div className=" flex  flex-col mt-5 flex-1 h-[300px]">
                      <Label className=" pb-[6px] block capitalize whitespace-nowrap">
                        Destination Image
                      </Label>
                      <SingleImageUploader name="destinationImageMedia" />
                    </div>
                  </CardBody>
                </Card>
              </div>
            </SheetDescription>
            <SaveButton label="Create Testimonial" isEdit={isEdit} />
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}

export default CreateTestimonial;
