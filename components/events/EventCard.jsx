// components/Events/EventCard.jsx

import {
  CloseCircleOutlined,
  DeleteFilled,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Popconfirm } from "antd";
import React from "react";
import { useRouter } from "next/router";
import EventInfoDisplay from "./EventInfoDisplay";

const EventCard = ({
  event,
  handleExpand,
  expandedEventId,
  handleDeleteEvent,
}) => {
  const router = useRouter();

  return (
    <Card
      title={`Event ID-${event.id} : ${event.page_name_en}`}
      extra={
        <div className="flex space-x-2 transition-all duration-300">
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/events/${event.id}`)}
            className="mavebutton"
          >
            Edit Event
          </Button>
          <Button
            type="default"
            icon={
              expandedEventId === event.id ? (
                <CloseCircleOutlined />
              ) : (
                <PlusCircleOutlined />
              )
            }
            onClick={() => handleExpand(event.id)}
            className="rounded-md"
          >
            {expandedEventId === event.id ? "Collapse" : "Expand"}
          </Button>
        </div>
      }
      bordered
      className="shadow-md"
    >
      {expandedEventId === event.id && (
        <div className="mt-4">
          <EventInfoDisplay event={event} />

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-4 transition-all duration-300">
            <Popconfirm
              title="Are you sure you want to delete this event?"
              onConfirm={() => handleDeleteEvent(event.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button icon={<DeleteFilled />} className="mavecancelbutton">
                Delete Event
              </Button>
            </Popconfirm>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EventCard;
