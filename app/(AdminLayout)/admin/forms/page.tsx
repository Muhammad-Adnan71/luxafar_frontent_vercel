"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "components/CMS/components-ui/table";
import { useSearchParams } from "next/navigation";
import PageTitle from "components/CMS/components-ui/PageTitle";
import FormDataDrawer from "components/CMS/side-drawers/formDrawers";
import { FormResponse } from "@utils/types";
import { apiGetAllFormsService } from "@utils/services/forms";
import { convertDateIntoFormattedDateAndTime } from "@utils/functions";

const Forms = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [selectedRow, setSelectedRow] = useState<FormResponse>();
  const [formData, setFormData] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
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
      key: "name",
      name: "name",
      render: (value: any, row: any) => {
        return (
          <>
            <div className="flex relative gap-3 pl-[25px] justify-center">
              {row.status === "unread" && (
                <div className="text-[8px] absolute left-0 font-[500] text-[rgb(0,255,0)]">
                  NEW
                </div>
              )}
              {value}
            </div>
          </>
        );
      },
    },
    {
      key: "email",
      name: "User Email",
    },

    ...(type !== "booking"
      ? [
          {
            name: "Type of Form",
            key: "type",
          },
        ]
      : []),

    ...(type === "booking"
      ? [
          {
            key: "destination",
            name: "destination",
            render: (value: any, row: any) => {
              return (
                <>
                  <div className="flex relative gap-3 pl-[25px] justify-center">
                    {row?.tours?.tourDestinations
                      ?.map((ele: any) => ele.destination.name)
                      ?.toString()}
                  </div>
                </>
              );
            },
          },
        ]
      : []),
    ...(type === "booking"
      ? [
          {
            key: "tour",
            name: "tour",
            render: (value: any, row: any) => {
              return (
                <>
                  <div className="flex relative gap-3 pl-[25px] justify-center">
                    {row?.tours?.title}
                  </div>
                </>
              );
            },
          },
        ]
      : []),

    {
      name: "Created At",
      key: "createdAt",
      render: (value: any, row: any) => {
        return <>{convertDateIntoFormattedDateAndTime(value)}</>;
      },
    },
  ];

  const getForm = async () => {
    setIsLoading(true);
    const response = await apiGetAllFormsService({
      type: type ?? "",
      pageSize: pageSize.toString(),
      pageNum: currentPage.toString(),
      searchParams: searchValue,
    });
    if (response.status === "success") {
      setFormData(response.data);
      console.log(response.data);
      setCount(response.count);
      setIsLoading(false);
    }
  };
  const handleSuccess = (form: FormResponse) => {
    setFormData((prev: any) => {
      return prev.map((value: any) => (form.id === value.id ? form : value));
    });
  };

  useEffect(() => {
    getForm();
  }, [searchParams, pageSize, currentPage, searchValue]);
  const handlePageSize = (value: number) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };
  const handlePagination = (value: number) => {
    setCurrentPage(value);
  };
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <PageTitle classes="mb-0">
        {!type ? "Forms" : "Forms - " + type}
      </PageTitle>
      <CustomTable
        onSearch={handleSearch}
        onPagination={handlePagination}
        currentPage={currentPage}
        count={count}
        onPageSize={handlePageSize}
        pageSize={pageSize}
        isLoading={isLoading}
        tableContent={formData}
        tableHeadings={tableHeader}
        isActionButtons={true}
        actionHandles={{
          onView: (row: any) => {
            setSelectedRow(row);
            setModalState((prev) => ({
              isOpen: true,
              isEdit: true,
            }));
          },
        }}
      />
      <FormDataDrawer
        onSuccess={handleSuccess}
        isOpen={modalState.isOpen}
        setIsOpen={() =>
          setModalState((prev) => ({
            isEdit: false,
            isOpen: false,
          }))
        }
        selectedRow={selectedRow as FormResponse}
      />
    </div>
  );
};

export default Forms;
