"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/CMS/components-ui/shadcn/ui/table";
import { Switch } from "components/CMS/components-ui/shadcn/ui/switch";
import TableLoading from "components/CMS/components-ui/table/tableLoading";
import { Button } from "components/CMS/components-ui/shadcn/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/CMS/components-ui/shadcn/ui/tableAccordian";

import { removeTags, truncateText } from "@utils/functions";
import {
  apiChangeSortInspirationsService,
  apiDeleteInspiration,
  apiGenerateRssFeed,
  apiUpdateInspirationStatus,
} from "@utils/services/inspirations";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Menu } from "lucide-react";
import { PlusIcon } from "@radix-ui/react-icons";

import ActionButtons from "components/CMS/components-ui/table/actionButtons";
import Pagination from "components/CMS/components-ui/pagination";
import DeleteAlertDialog from "components/CMS/components-ui/deleteAlertDialog";
import { Input } from "components/CMS/components-ui/shadcn/ui/input";
import CustomSelect from "components/CMS/components-ui/form/select";
import { apiChangeSortPlacesService } from "@utils/services/planServices";
import { handleApiError } from "@utils/api-helpers";
import { useToast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { apiGetNewInspiration } from "@utils/services/sitemap";
import { useRouter } from "next/navigation";
import useDebounce from "hooks/useDebounce";
import { tablePageSizeOptions } from "@utils/constant";
import PageTitle from "components/CMS/components-ui/PageTitle";
import {
  apiChangeSortTestimonialService,
  apiDeleteTestimonial,
  apiGetAllTestimonials,
  apiUpdateTestimonial,
} from "@utils/services/testimonial";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/CMS/components-ui/shadcn/ui/avatar";
import CreateTestimonial from "components/CMS/side-drawers/createTestimonial";

const TestimonialByDestination = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [value, setValue] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState();
  const [testimonials, setTestimonialData] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteRow, setDeleteRow] = useState<any>();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [count, setCount] = useState(0);
  const debouncedValue = useDebounce<string>(value, 500);
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEdit: false,
  });
  const tableHeader = [
    {
      key: "id",
      name: "id",
    },
    {
      key: "clientName",
      name: "client",
      render: (value: any, row: any) => (
        <div className="flex relative items-center gap-4 justify-start text-sm pl-10 w-[300px]">
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
      render: (value: boolean, row: any, parentRow: any) => (
        <Switch
          checked={value}
          onCheckedChange={(value: any) => handleActive(value, row, parentRow)}
        />
      ),
    },
  ];
  const tableHeaderDestination = [
    {
      key: "name",
      name: "destination Name",
    },
  ];

  const handlePageSize = (value: number) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };
  const handlePagination = (value: number) => {
    setCurrentPage(value);
  };
  const handleDeleteAlert = (row: any, parentRow: any) => {
    setOpenDeleteAlert(!openDeleteAlert);
    setDeleteRow({ row, parentRow });
  };
  const handleDelete = async (row: any, parentRow: any) => {
    const id = Number(row.id);
    const response = await apiDeleteTestimonial(id);
    if (response.status === "success") {
      setTestimonialData((prev: any) => {
        return prev.map((ele: any) => {
          if (parentRow.id === ele.id) {
            return {
              ...ele,
              Testimonial: ele.Testimonial.filter(
                (item: any) => item.id !== row.id
              ),
            };
          } else return ele;
        });
      });
      toast({
        title: "Testimonial Deleted Successfully",
        variant: "success",
      });
    }
  };
  const actionHandles = {
    onDelete: handleDelete,
    onEdit: (row: any) => {
      setSelectedRow(row);
      setModalState((prev) => ({
        isOpen: true,
        isEdit: true,
      }));
    },
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  const handleActive = async (value: boolean, row: any, parentRow: any) => {
    const id = Number(row.id);

    setTestimonialData((prev: any) => {
      return prev.map((ele: any) => {
        if (parentRow.id === ele.id) {
          return {
            ...ele,
            Testimonial: ele.Testimonial.map((item: any) =>
              item.id === row.id ? { ...item, isActive: value } : item
            ),
          };
        } else return ele;
      });
    });
    const { clientImageMedia, destinationImageMedia, destinationId, ...rest } =
      row;

    const response = await apiUpdateTestimonial(id, {
      ...rest,
      isActive: value,
    });
    if (response.status === "success") {
      toast({
        title: `Testimonial ${value ? "Active" : "In-Active"} Successfully`,
        variant: "success",
      });
    }
  };
  const handleContinueDelete = () => {
    actionHandles?.onDelete &&
      actionHandles.onDelete(deleteRow?.row, deleteRow?.parentRow);
  };

  const handleDragEnd = async (result: any, parentRow: any) => {
    if (!result.destination) {
      return;
    }
    const sortPosition = result.source.index - result.destination.index;
    const destinationItem: any = testimonials.find(
      (ele: any) => ele.id === parentRow.id
    ).Testimonial[result.destination.index];

    const newResult = Array.from([...testimonials]).map((item: any) => {
      if (item.id === destinationItem.destinationId) {
        const draggedItem = item.Testimonial.find(
          (ele: any) => ele.id === Number(result.draggableId)
        );

        const destinationTestimonial = item.Testimonial.map((ele: any) => {
          if (ele.id === Number(result.draggableId)) {
            return {
              ...ele,
              destinationSortId: Number(destinationItem?.destinationSortId),
            };
          } else if (
            sortPosition < 0 &&
            destinationItem?.destinationSortId >= ele?.destinationSortId &&
            draggedItem?.destinationSortId <= ele?.destinationSortId
          ) {
            return {
              ...ele,
              destinationSortId: ele?.destinationSortId - 1,
            };
          } else if (
            sortPosition > 0 &&
            draggedItem?.destinationSortId >= ele?.destinationSortId &&
            destinationItem?.destinationSortId <= ele?.destinationSortId
          ) {
            return {
              ...ele,
              destinationSortId: ele?.destinationSortId + 1,
            };
          } else return ele;
        }).sort(
          (a: any, b: any) => a?.destinationSortId - b?.destinationSortId
        );

        return {
          ...item,
          Testimonial: destinationTestimonial,
        };
      } else {
        return item;
      }
    });

    if (sortPosition) {
      try {
        setTestimonialData(newResult);
        await apiChangeSortTestimonialService({
          sourceId: Number(result.draggableId),
          sortPosition,
          destinationIdSortId: destinationItem.destinationSortId,
          destinationId: destinationItem.destinationId,
        });

        toast({ title: "Testimonial Sort Saved", variant: "success" });
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };

  const getAllTestimonials = async () => {
    setIsLoading(true);
    const response = await apiGetAllTestimonials({
      pageSize: pageSize.toString(),
      pageNum: currentPage.toString(),
      searchParams: searchValue,
      groupBy: "destination",
    });
    if (response?.status === "success") {
      setTestimonialData(response.data);
      setCount(response.count);
      setIsLoading(false);
    }
  };
  const resetModalState = () => {
    setModalState((prev) => ({
      isEdit: false,
      isOpen: false,
    }));
  };

  const handleOnCreate = async (testimonial: any) => {
    resetModalState();
    setTestimonialData((prev) => {
      const destinationIndex = prev.findIndex(
        (ele) => ele.id === Number(testimonial.destination.id)
      );
      if (destinationIndex === -1) {
        return [
          { name: testimonial.destination.name, Testimonial: [testimonial] },
          ...prev,
        ];
      } else {
        return prev.map((destination, index) => {
          if (index === destinationIndex) {
            return {
              ...destination,
              Testimonial: [...destination.Testimonial, testimonial],
            };
          }
          return destination;
        });
      }
    });
  };
  const handleOnEdit = (testimonial: any) => {
    resetModalState();

    setTestimonialData((prev) => {
      const destinationIndex = prev.findIndex(
        (ele) => ele.id === Number(testimonial.destination.id)
      );
      if (destinationIndex === -1) {
        return [
          {
            name: testimonial.destination.name,
            Testimonial: [testimonial],
          },
          ...prev,
        ];
      } else {
        return prev.map((destination, index) => {
          if (index === destinationIndex) {
            const testimonialIndex = destination.Testimonial.findIndex(
              (ele: any) => ele.id === testimonial.id
            );
            destination.Testimonial[testimonialIndex] = testimonial;
            return {
              ...destination,
            };
          }
          return destination;
        });
      }
    });
  };
  useEffect(() => {
    handleSearch(value);
  }, [debouncedValue]);

  useEffect(() => {
    getAllTestimonials();
  }, [pageSize, currentPage, searchValue]);

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <PageTitle classes="mb-1">Testimonials By Destination</PageTitle>

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
        </div>
      </div>
      <div className="flex mt-2 justify-between ">
        <Input
          placeholder="Search"
          className="w-[200px] text-[14px] placeholder:text-[14px]"
          onChange={(e) => setValue(e.target.value)}
        />
        <div className=" flex w-[120px] ml-auto ">
          <CustomSelect
            onChange={handlePageSize}
            options={tablePageSizeOptions}
            placeholder="Page Size"
            name=""
            value={pageSize?.toString()}
            classes="py-2 text-[12px] mb-2"
          />
        </div>
      </div>
      <div className="mb-10">
        <Table className="relative ">
          <TableHeader className="bg-cms-primary-color dark:bg-gray-800">
            <tr className="text-center  border-cms-primary-color dark:border-gray-800">
              {tableHeaderDestination.map((column: any, index: number) => (
                <TableCell
                  key={index}
                  className="capitalize text-white text-left px-5"
                >
                  {column.name}
                </TableCell>
              ))}
            </tr>
          </TableHeader>
          {isLoading ? (
            <TableLoading tableHeadings={tableHeaderDestination} />
          ) : (
            <TableBody>
              {testimonials.map((row: any, i: number) => {
                return (
                  <TableRow
                    key={i}
                    className="text-center  border-cms-primary-color dark:border-gray-800 "
                  >
                    <td colSpan={tableHeader.length}>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-1">
                          <AccordionTrigger className="px-5 text-white capitalize">
                            {row?.name}
                          </AccordionTrigger>
                          <AccordionContent>
                            <DragDropContext
                              onDragEnd={(result) => handleDragEnd(result, row)}
                            >
                              <Table>
                                <TableHeader className="bg-[#03191f] dark:bg-gray-800  w-full">
                                  <tr className="text-center  border-cms-primary-color dark:border-gray-800 ">
                                    <TableCell className="capitalize text-white"></TableCell>

                                    {tableHeader.map(
                                      (column: any, index: number) => (
                                        <>
                                          <TableCell
                                            key={index}
                                            className="capitalize text-white"
                                          >
                                            {column.name}
                                          </TableCell>
                                        </>
                                      )
                                    )}
                                    <TableCell className="capitalize text-white">
                                      Actions
                                    </TableCell>
                                  </tr>
                                </TableHeader>
                                <Droppable droppableId={"droppable" + i}>
                                  {(provided: any, snapshot: any) => (
                                    <TableBody
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                    >
                                      {row?.Testimonial?.map(
                                        (testimonial: any, i: number) => {
                                          return (
                                            <Draggable
                                              key={testimonial.id}
                                              draggableId={testimonial.id.toString()}
                                              index={i}
                                            >
                                              {(provided: any) => (
                                                <TableRow
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  key={i}
                                                  className="text-center  border-cms-primary-color dark:border-gray-800 w-full  bg-[#03191f] dark:bg-gray-800"
                                                >
                                                  <TableCell className=" text-white w-3">
                                                    <Menu className="w-4" />
                                                  </TableCell>
                                                  {tableHeader.map(
                                                    (heading: any, j: any) => {
                                                      return heading.render ? (
                                                        <TableCell
                                                          key={j}
                                                          className={` text-white`}
                                                        >
                                                          {heading.render(
                                                            testimonial[
                                                              heading.key
                                                            ],
                                                            testimonial,
                                                            row
                                                          )}
                                                        </TableCell>
                                                      ) : (
                                                        <TableCell
                                                          key={j}
                                                          className={` text-white `}
                                                        >
                                                          {
                                                            testimonial[
                                                              heading.key
                                                            ]
                                                          }
                                                        </TableCell>
                                                      );
                                                    }
                                                  )}
                                                  <ActionButtons
                                                    actionHandles={
                                                      actionHandles
                                                    }
                                                    handleDeleteAlert={
                                                      handleDeleteAlert
                                                    }
                                                    row={testimonial}
                                                    parentRow={row}
                                                  />
                                                </TableRow>
                                              )}
                                            </Draggable>
                                          );
                                        }
                                      )}
                                      {provided.placeholder}
                                    </TableBody>
                                  )}
                                </Droppable>
                              </Table>
                            </DragDropContext>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </td>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
        {count && pageSize && count > pageSize ? (
          <Pagination
            onPagination={(currentPage: number) =>
              handlePagination(currentPage)
            }
            totalResults={count}
            resultsPerPage={pageSize}
            currentPage={currentPage}
          />
        ) : (
          ""
        )}
        <DeleteAlertDialog
          openDeleteAlert={openDeleteAlert}
          handleContinueDelete={handleContinueDelete}
          handleDeleteAlert={() => setOpenDeleteAlert(!openDeleteAlert)}
        />
        <CreateTestimonial
          byDestination={true}
          isOpen={modalState.isOpen}
          setIsOpen={resetModalState}
          isEdit={modalState.isEdit}
          selectedRow={selectedRow}
          onCreate={(testimonial: any) => handleOnCreate(testimonial)}
          onEdit={(testimonial: any) => handleOnEdit(testimonial)}
        />
      </div>
    </>
  );
};

export default TestimonialByDestination;
