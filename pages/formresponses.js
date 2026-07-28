import {
  Col,
  Modal,
  Row,
  Tabs,
  message,
  Button,
  Select,
  Input,
  Breadcrumb,
} from "antd";
import React, { useState, useEffect } from "react";
import ContactUsResponses from "../components/ContactUsResponses";
import { CopyOutlined, HomeFilled } from "@ant-design/icons";
import router from "next/router";

const FormResponses = () => {
  return (
    <div className="mavecontainer">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumb
          style={{
            fontSize: "1.2em",
            marginBottom: "1em",
          }}
          items={[
            {
              href: "/",
              title: <HomeFilled />,
            },
            {
              title: "Components",
            },
            {
              title: "Menu Items",
              menu: {
                items: [
                  {
                    title: "Gallery",
                    onClick: () => router.push("/gallery"),
                  },
                  {
                    title: "Menus Items",
                    onClick: () => router.push("/menus?tab=items"),
                  },
                  {
                    title: "Menus",
                    onClick: () => router.push("/menus"),
                  },
                  {
                    title: "Navbars",
                    onClick: () => router.push("/navbars"),
                  },
                  {
                    title: "Sliders",
                    onClick: () => router.push("/sliders"),
                  },
                  {
                    title: "Cards",
                    onClick: () => router.push("/cards"),
                  },
                  {
                    title: "Forms",
                    onClick: () => router.push("/forms"),
                  },
                  {
                    title: "Footers",
                    onClick: () => router.push("/footer"),
                  },
                ],
              },
            },
          ]}
        />
        <Button
          type="primary"
          style={{
            backgroundColor: "var(--theme)",
            borderColor: "var(--theme)",
            color: "white",
            borderRadius: "10px",
            fontSize: "1.2em",
          }}
          icon={<CopyOutlined />}
          onClick={() => {
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/formresponses`
            );
            message.success("API Endpoint Copied");
          }}
        >
          Copy API Endpoint
        </Button>
      </div>

      <div>
        {/* <Tabs defaultActiveKey="1" type="card" size="large">
                        <Tabs.TabPane tab="Contact Us" key="1">
                            <ContactUsResponses />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="System Demand" key="2">
                            <SystemDemand />
                        </Tabs.TabPane>
                    </Tabs> */}
        {/* <ContactUsResponses /> */}
      </div>
    </div>
  );
};

export default FormResponses;
