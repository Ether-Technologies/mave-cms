// components/PageBuilder/PageCard.jsx

import {
  CloseCircleOutlined,
  DeleteFilled,
  EditOutlined,
  PlusCircleOutlined,
  CopyOutlined,
  ArrowRightOutlined,
  CaretDownFilled,
  CaretRightOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { Button, Card, message, Popconfirm } from "antd";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PageInfoDisplay from "./PageInfoDisplay";
import PageEditForm from "./PageEditForm";

const PageCard = ({
  page,
  handleExpand,
  expandedPageId,
  handleDeletePage,
  handleEditPageInfo,
  handleDuplicatePage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [type, setType] = useState("Page");

  useEffect(() => {
    if (page?.type === "Event") {
      setType("Event");
    } else if (page?.type === "Blog") {
      setType("Blog");
    } else if (page?.type === "Footer") {
      setType("Footer");
    } else if (page?.type === "Page") {
      setType("Page");
    } else if (page?.type === "Subpage") {
      setType("Subpage");
    } else {
      setType("Unknown");
    }
  }, [page]);

  const router = useRouter();

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const confirmEdit = (updatedData) => {
    handleEditPageInfo(updatedData);
    setIsEditing(false);
  };

  return (
    <Card
      title={
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <span className="text-base md:text-lg font-semibold text-gray-800">
              {type} ID-{page.id}
            </span>
            <span className="text-base md:text-lg font-medium text-theme">
              {page.page_name_en}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              icon={<EditOutlined />}
              onClick={() => router.push(`/page-builder/${page.id}`)}
              className="h-9 px-4 mavebutton"
            />
            <Button
              type="default"
              icon={
                expandedPageId === page.id ? (
                  <CaretDownOutlined />
                ) : (
                  <CaretRightOutlined />
                )
              }
              onClick={() => handleExpand(page.id)}
              className="h-9 px-4 rounded-md border-2 border-gray-200 hover:border-theme transition-colors"
            />
          </div>
        </div>
      }
      bordered={false}
      className="w-full shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg bg-white"
    >
      {expandedPageId === page.id && (
        <div className="w-full mt-4">
          <div className="w-full">
            {isEditing ? (
              <PageEditForm
                page={page}
                onSubmit={confirmEdit}
                onCancel={cancelEditing}
              />
            ) : (
              <PageInfoDisplay page={page} />
            )}
          </div>

          {!isEditing && (
            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                icon={<EditOutlined />}
                onClick={startEditing}
                className="h-9 px-4 mavebutton"
              />
              <Button
                icon={<CopyOutlined />}
                onClick={() => handleDuplicatePage(page.id)}
                className="h-9 px-4 mavebutton"
              />
              <Popconfirm
                title="Are you sure you want to delete this page?"
                onConfirm={() => handleDeletePage(page.id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ className: "mavebutton" }}
                cancelButtonProps={{ className: "mavecancelbutton" }}
              >
                <Button
                  icon={<DeleteFilled />}
                  className="h-9 px-4 mavecancelbutton"
                />
              </Popconfirm>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PageCard;
