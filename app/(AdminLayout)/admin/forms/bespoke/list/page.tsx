"use client";
import React, { useEffect, useState } from "react";

import CustomTable from "components/CMS/components-ui/table";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { BespokeQuestionResponse } from "@utils/types";

import { handleApiError } from "@utils/api-helpers";
import { useRouter } from "next/navigation";
import {
  apiChangeSortBespokeQuestionService,
  apiGetAllBespokeQuestion,
} from "@utils/services/bespoke";

function BespokeQuestions() {
  const { toast } = useToast();
  const [bespokeQuestionsData, setBespokeQuestionsData] = useState<
    BespokeQuestionResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    getbespokeQuestionsData();
  }, []);

  const getbespokeQuestionsData = async () => {
    setIsLoading(true);
    const response = await apiGetAllBespokeQuestion();
    if (response.status === "success") {
      setBespokeQuestionsData(response.data);
      setIsLoading(false);
    }
  };

  const tableHeader = [
    {
      key: "id",
      name: "id",
    },
    {
      key: "question",
      name: "question",
    },
  ];
  const handleDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }
    const sortPosition = result.source.index - result.destination.index;
    const destinationItem: BespokeQuestionResponse =
      bespokeQuestionsData[result.destination.index];

    const draggedItem: BespokeQuestionResponse = bespokeQuestionsData.find(
      (ele) => ele.id === Number(result.draggableId)
    )!;

    const partners = bespokeQuestionsData
      .map((ele: any) => {
        if (ele.id === Number(result.draggableId)) {
          return {
            ...ele,
            sortId: Number(destinationItem.sortId),
          };
        } else if (
          sortPosition < 0 &&
          draggedItem?.sortId >= ele?.sortId &&
          destinationItem?.sortId <= ele?.sortId
        ) {
          return {
            ...ele,
            sortId: ele.sortId + 1,
          };
        } else if (
          sortPosition > 0 &&
          destinationItem?.sortId >= ele?.sortId &&
          draggedItem?.sortId <= ele?.sortId
        ) {
          return {
            ...ele,
            sortId: ele.sortId - 1,
          };
        } else return ele;
      })
      .sort((a, b) => b.sortId - a.sortId);

    const destinationIdSortId = Number(destinationItem.sortId);
    if (sortPosition) {
      try {
        setBespokeQuestionsData(partners as BespokeQuestionResponse[]);
        await apiChangeSortBespokeQuestionService({
          sourceId: Number(result.draggableId),
          sortPosition,
          destinationIdSortId,
        });

        toast({ title: "Partners Sort Saved", variant: "success" });
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <PageTitle classes="mb-1">Bespoke Question List</PageTitle>
        <div className="flex justify-between items-center gap-3">
          <Button
            className="flex items-center gap-1 "
            onClick={() => router.push("/admin/forms/bespoke/edit")}
          >
            <PlusIcon className="w-4 h-4" aria-hidden="true" />
            Edit Bespoke Question
          </Button>
        </div>
      </div>
      <CustomTable
        isPageSizeEnable={false}
        onDragEnd={handleDragEnd}
        isDraggable
        isLoading={isLoading}
        tableContent={bespokeQuestionsData}
        tableHeadings={tableHeader}
      />
    </>
  );
}
export default BespokeQuestions;
