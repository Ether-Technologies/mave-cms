import React, { useEffect, useState } from "react";
import { Layout, Timeline, Tag, Button, Breadcrumb, Radio } from "antd";
import moment from "moment";
import changelog from "./changelog.json";
import { HomeOutlined, SwapOutlined } from "@ant-design/icons";
import NavItems from "../../components/ui/NavItems";
import { useAuth } from "../../src/context/AuthContext";

const Changelog = () => {
  const { Content } = Layout;
  const [changeLogs, setChangeLogs] = useState([]);
  const [reverse, setReverse] = useState(false);
  const [filter, setFilter] = useState("all");
  const { user, token } = useAuth();

  useEffect(() => {
    // Sort the changelog by date in descending order
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

  return (
    <div className="mavecontainer">
      <NavItems user={user} token={token} />
      <Layout className="site-layout-background pt-20 pr-10 pb-10 bg-transparent">
        <Content className="p-10 bg-white rounded-lg min-h-10">
          <div className="flex justify-between items-center mb-6">
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
              />
            </div>
          </div>

          <h1 className="text-4xl font-semibold text-theme text-center w-full mb-10">
            Mave Changelogs
          </h1>

          <Timeline
            mode="alternate"
            pending="More to come..."
            reverse={reverse}
          >
            {filteredLogs?.map((log, index) => (
              <Timeline.Item
                key={index}
                label={moment(log.date).format("DD MMM YYYY")}
                style={{
                  paddingBottom: "20px",
                  fontSize: "1.1em",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-2xl font-semibold text-theme m-0">
                    v{log.version}
                  </h3>
                  <Tag color={getVersionColor(log.type)}>
                    {log.type || "unspecified"}
                  </Tag>
                </div>
                <>
                  {Object.entries(log.changes)?.map(([type, changeList]) =>
                    changeList?.map((change, i) => (
                      <div
                        key={i}
                        className="mb-2 p-4 rounded-lg bg-white shadow-sm border-2 border-gray-200 hover:border-theme hover:shadow-md hover:scale-105 transition-all duration-300"
                      >
                        <Tag color={type === "BugFix" ? "red" : "green"}>
                          {type}
                        </Tag>
                        {change}
                      </div>
                    ))
                  )}
                </>
              </Timeline.Item>
            ))}
          </Timeline>
        </Content>
      </Layout>
    </div>
  );
};

export default Changelog;
