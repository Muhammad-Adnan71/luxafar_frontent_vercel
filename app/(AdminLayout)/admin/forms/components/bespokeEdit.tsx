"use client";
import React, { useState } from "react";
import PageTitle from "components/CMS/components-ui/PageTitle";
import Card from "components/CMS/components-ui/card";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import SaveButton from "components/CMS/components-ui/saveButton";
import { BespokeQuestionResponse } from "@utils/types";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import FormSkeleton from "components/CMS/components-ui/form/skeleton";
import AddButton from "components/CMS/components-ui/addButton";
import { useRouter } from "next/navigation";
import {
  apiGetAllBespokeQuestion,
  apiPutBespokeQuestion,
} from "@utils/services/bespoke";
import Question from "../components/question";

export default function BespokeEdit() {
  const router = useRouter();

  const methods = useForm<any>({
    // resolver: zodResolver(PagesSchema),
    mode: "onBlur",
    defaultValues: async () => {
      const response = apiGetAllBespokeQuestion();
      const data = (await response).data;
      return { question: data };
    },
  });
  const { toast } = useToast();
  const {
    handleSubmit,
    formState: { isLoading },
  } = methods;
  const { control, register, getValues } = methods;
  const { fields, append, remove, update } = useFieldArray({
    name: "question",
    control,
  });

  const onSubmitHandler: SubmitHandler<any> = async (values) => {
    let data: any = {
      question: values.question.map((ele: any) => {
        return {
          ...ele,
          formType: "bespoke",
        };
      }),
    };

    const response = await apiPutBespokeQuestion(data);
    if (response.status === "success") {
      router.push("/admin/forms/bespoke");
      toast({
        title: `Successfully Updated`,
        variant: "success",
      });
    }
  };
  const handleAddMore = () => {
    append({
      type: "",
      question: "",
      addOtherOption: true,
      textPlaceholder: "",
      sortId: fields.length + 1,
      bespokeQuestionOptions: [
        {
          label: "",
        },
      ],
    });
  };
  return (
    <div className="pb-10 ">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <PageTitle>Bespoke Questions</PageTitle>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <>
              {fields.map((item, index) => {
                return (
                  <Question
                    key={index}
                    {...{ control, register, getValues, update, remove }}
                    questionIndex={index}
                  />
                );
              })}
              <AddButton classes="ml-auto" onClick={handleAddMore} />

              <SaveButton isEdit={true} />
            </>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
