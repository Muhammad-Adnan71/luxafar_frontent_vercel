"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/CMS/components-ui/shadcn/ui/avatar";
import CustomTable from "components/CMS/components-ui/table";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";
import PageTitle from "components/CMS/components-ui/PageTitle";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";
import CreateTestimonial from "components/CMS/side-drawers/createTestimonial";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { TestimonialResponse } from "@utils/types";
import {
  apiChangeSortTestimonialService,
  apiDeleteTestimonial,
  apiGetAllTestimonials,
  apiUpdateTestimonial,
} from "@utils/services/testimonial";
import { reorder } from "@utils/functions";
import { handleApiError } from "@utils/api-helpers";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

function Testimonials() {
  const { toast } = useToast();
  const [testimonialData, setTestimonialData] = useState<TestimonialResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEdit: false,
  });
  const router = useRouter();
  const [selectedRow, setSelectedRow] = useState();
  useEffect(() => {
    getTestimonialData();
  }, []);

  const getTestimonialData = async () => {
    setIsLoading(true);
    const response = await apiGetAllTestimonials();
    if (response.status === "success") {
      setTestimonialData(response.data);
      setIsLoading(false);
    }
  };
  const handleDelete = async (row: any) => {
    try {
      const response = await apiDeleteTestimonial(row.id);

      setTestimonialData((prev) =>
        prev.filter((item) => item.id !== response.data.id)
      );
      toast({
        title: "Testimonial Deleted Successfully",
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const resetModalState = () => {
    setModalState((prev) => ({
      isEdit: false,
      isOpen: false,
    }));
  };
  const handleOnCreate = async (feature: any) => {
    resetModalState();
    setTestimonialData((prev) => [feature, ...prev]);
  };
  const handleOnEdit = (editFeature: any) => {
    resetModalState();
    setTestimonialData((prev) =>
      prev.map((feature: any) => {
        if (feature.id === editFeature.id) return editFeature;
        else return feature;
      })
    );
  };
  const handleActiveFeature = async (value: boolean, row: any) => {
    try {
      const id = Number(row.id);
      setTestimonialData((prev: any) => {
        return prev.map((item: any) =>
          row.id === item.id ? { ...item, isActive: value } : item
        );
      });
      const { clientImageMedia, destinationImageMedia, ...rest } = row;

      await apiUpdateTestimonial(id, {
        ...rest,
        isActive: value,
      });
      toast({
        title: `Testimonial ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    } catch (error: any) {
      handleApiError(error);
    }
  };

  const tableHeader = [
    {
      key: "id",
      name: "id",
    },
    {
      key: "clientName",
      name: "client",
      render: (value: any, row: any) => (
        <div className="flex relative items-center gap-4 justify-start text-sm pl-10">
          <Avatar className=" w-8 h-8 left-0">
            <AvatarImage src={row.clientImageMedia?.desktopMediaUrl} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="">
            <p className=" font-semibold">{row.clientName}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {row.clientLocation}
            </p>
          </div>
        </div>
      ),
    },

    {
      name: "Active ",
      key: "isActive",
      render: (value: boolean, row: any) => (
        <Switch
          checked={value}
          onCheckedChange={(value: any) => handleActiveFeature(value, row)}
        />
      ),
    },
  ];
  const handleDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }
    const sortPosition = result.source.index - result.destination.index;
    const destinationItem = testimonialData[result.destination.index];
    const draggedItem = testimonialData.find(
      (ele) => ele.id === Number(result.draggableId)
    )!;
    const items = testimonialData
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
        setTestimonialData(items as TestimonialResponse[]);
        await apiChangeSortTestimonialService({
          sourceId: Number(result.draggableId),
          sortPosition,
          destinationIdSortId,
        });

        toast({ title: "Testimonial Sort Saved", variant: "success" });
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <PageTitle classes="mb-1">General Testimonials</PageTitle>
        <div className="flex justify-between items-center gap-3">
          <Button
            className="flex items-center gap-1 "
            onClick={() => {
              setModalState((prev) => ({
                isOpen: true,
                isEdit: false,
              }));
            }}
          >
            <PlusIcon className="w-4 h-4" aria-hidden="true" />
            Create Testimonial
          </Button>
          <Button
            className="flex items-center gap-1"
            onClick={() => router.push("testimonials/destinations")}
          >
            <MapPin className="w-4 h-4" aria-hidden="true" />
            By Destination
          </Button>
        </div>
      </div>
      <CustomTable
        isPageSizeEnable={false}
        onDragEnd={handleDragEnd}
        isDraggable
        isLoading={isLoading}
        tableContent={testimonialData}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onEdit: (row: any) => {
            setSelectedRow(row);
            setModalState((prev) => ({
              isOpen: true,
              isEdit: true,
            }));
          },
          onDelete: (row: any) => handleDelete(row),
        }}
      />
      <CreateTestimonial
        testimonialLength={testimonialData.length}
        isOpen={modalState.isOpen}
        setIsOpen={resetModalState}
        isEdit={modalState.isEdit}
        selectedRow={selectedRow}
        onCreate={(testimonial: any) => handleOnCreate(testimonial)}
        onEdit={(testimonial: any) => handleOnEdit(testimonial)}
      />
    </>
  );
}
export default Testimonials;
