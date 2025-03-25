// components/PageBuilder/PageCard.jsx

import {
  CloseCircleOutlined,
  DeleteFilled,
  EditOutlined,
  PlusCircleOutlined,
  CopyOutlined,
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
      title={`${type} ID-${page.id} : ${page.page_name_en}`}
      extra={
        <div className="flex space-x-2 transition-all duration-300">
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/page-builder/${page.id}`)}
            className="mavebutton"
          >
            Edit {type}
          </Button>
          <Button
            type="default"
            icon={
              expandedPageId === page.id ? (
                <CloseCircleOutlined />
              ) : (
                <PlusCircleOutlined />
              )
            }
            onClick={() => handleExpand(page.id)}
            className="rounded-md"
          >
            {expandedPageId === page.id ? "Collapse" : "Expand"}
          </Button>
        </div>
      }
      bordered
      className="shadow-md"
    >
      {expandedPageId === page.id && (
        <div className="mt-4">
          {isEditing ? (
            <PageEditForm
              page={page}
              onSubmit={confirmEdit}
              onCancel={cancelEditing}
            />
          ) : (
            <PageInfoDisplay page={page} />
          )}

          {/* Action Buttons when not editing */}
          {!isEditing && (
            <div className="flex space-x-4 mt-4 transition-all duration-300">
              <Button
                icon={<EditOutlined />}
                onClick={startEditing}
                className="mavebutton"
              >
                Edit {type} Info
              </Button>
              <Button
                icon={<CopyOutlined />}
                onClick={() => handleDuplicatePage(page.id)}
                className="mavebutton"
              >
                Duplicate {type}
              </Button>
              <Popconfirm
                title="Are you sure you want to delete this page?"
                onConfirm={() => handleDeletePage(page.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteFilled />} className="mavecancelbutton">
                  Delete {type}
                </Button>
              </Popconfirm>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PageCard;
