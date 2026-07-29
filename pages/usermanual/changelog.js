import React, { useEffect, useState } from "react";
import { Layout, Timeline, Tag, Button, Breadcrumb, Radio } from "antd";
import moment from "moment";
import changelog from "./changelog.json";
import {
  HomeOutlined,
  SwapOutlined,
  BugOutlined,
  StarOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
  ToolOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import NavItems from "../../components/ui/NavItems";
import { useAuth } from "../../src/context/AuthContext";

const Changelog = () => {
  const { Content } = Layout;
  const [changeLogs, setChangeLogs] = useState([]);
  const [reverse, setReverse] = useState(false);
  const [filter, setFilter] = useState("all");
  const { user, token } = useAuth();

  useEffect(() => {
    const sortedLogs = changelog.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setChangeLogs(sortedLogs);
  }, []);

  const filteredLogs =
    filter === "all"
      ? changeLogs
      : changeLogs.filter((log) => log.type === filter);

  const getVersionColor = (type) => {
    switch (type) {
      case "major":
        return "#cf1322";
      case "minor":
        return "#096dd9";
      case "patch":
        return "#389e0d";
      default:
        return "#000000";
    }
  };

  const getChangeTypeConfig = (type) => {
    switch (type) {
      case "Bug Fixes":
      case "BugFix":
        return {
          color: "#ff4d4f",
          bgColor: "bg-red-50/70",
          borderColor: "border-red-200",
          hoverBorder: "hover:border-red-400",
          icon: <BugOutlined className="text-red-500" />,
          title: "Bug Fix",
          titleIcon: <ToolOutlined className="text-red-500" />,
          className: "hover:shadow-red-100",
        };
      case "Features":
      case "Feature":
        return {
          color: "#52c41a",
          bgColor: "bg-green-50/70",
          borderColor: "border-green-200",
          hoverBorder: "hover:border-green-400",
          icon: <StarOutlined className="text-green-500" />,
          title: "New Feature",
          titleIcon: <ThunderboltOutlined className="text-green-500" />,
          className: "hover:shadow-green-100",
        };
      default:
        return {
          color: "#1890ff",
          bgColor: "bg-blue-50/70",
          borderColor: "border-blue-200",
          hoverBorder: "hover:border-brand",
          icon: <PlusCircleOutlined className="text-brand" />,
          title: "Update",
          titleIcon: <CheckCircleOutlined className="text-brand" />,
          className: "hover:shadow-blue-100",
        };
    }
  };

  return (
    <div className="mavecontainer">
      <NavItems user={user} token={token} />
      <Layout className="site-layout-background pt-20 pr-10 pb-10 bg-transparent">
        <Content className="p-10 bg-white/80 backdrop-blur-sm rounded-2xl min-h-10 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Breadcrumb
                items={[
                  {
                    title: <HomeOutlined />,
                    href: "/",
                  },
                  {
                    title: "User Manual",
                  },
                  {
                    title: "Changelog",
                  },
                ]}
              />
            </div>
            <div className="flex items-center gap-4">
              <Radio.Group
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                buttonStyle="solid"
                className="shadow-sm"
              >
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="major">Major</Radio.Button>
                <Radio.Button value="minor">Minor</Radio.Button>
                <Radio.Button value="patch">Patch</Radio.Button>
              </Radio.Group>
              <Button
                icon={<SwapOutlined />}
                onClick={() => setReverse(!reverse)}
                style={{ transform: "rotate(90deg)" }}
                className="shadow-sm hover:shadow-md transition-all duration-300"
              />
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-theme mb-2">
              Mave Changelogs
            </h1>
            <p className="text-gray-500">Track all updates and improvements</p>
          </div>

          <Timeline
            mode="alternate"
            pending={
              <div className="text-gray-400 italic">
                More updates coming soon...
              </div>
            }
            reverse={reverse}
            className="px-4"
          >
            {filteredLogs?.map((log, index) => (
              <Timeline.Item
                key={index}
                label={
                  <div className="text-gray-500 font-medium">
                    {moment(log.date).format("DD MMM YYYY")}
                  </div>
                }
                style={{
                  paddingBottom: "32px",
                  fontSize: "1.1em",
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-2xl font-bold text-theme m-0">
                    v{log.version}
                  </h3>
                  <Tag
                    color={getVersionColor(log.type)}
                    className="rounded-full px-3 uppercase text-xs font-semibold"
                  >
                    {log.type || "unspecified"}
                  </Tag>
                </div>
                <div className="space-y-4">
                  {Object.entries(log.changes)?.map(([type, changeList]) => {
                    const config = getChangeTypeConfig(type);
                    return (
                      <div key={type} className="space-y-3">
                        <div className="flex items-center gap-2">
                          {config.titleIcon}
                          <span className="font-semibold text-gray-700">
                            {config.title}
                          </span>
                        </div>
                        {changeList?.map((change, i) => (
                          <div
                            key={i}
                            className={`p-4 rounded-xl border ${config.bgColor} ${config.borderColor} ${config.hoverBorder} transition-all duration-300 hover:shadow-lg ${config.className}`}
                          >
                            <div className="flex gap-3">
                              <div className="mt-1">{config.icon}</div>
                              <div className="text-gray-700">{change}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Content>
      </Layout>
    </div>
  );
};

export default Changelog;
