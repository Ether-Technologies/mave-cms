import React, { useEffect, useState } from "react";
import { Layout, message } from "antd";
import { useRouter } from "next/router";
import SideMenuItems from "./ui/SideMenuItems";
import Loader from "./Loader";
import { useAuth } from "../src/context/AuthContext";
import { useMenuRefresh } from "../src/context/MenuRefreshContext";
import { publicPages, allowSignup, isProtectedPage } from "../config/routes";

const { Sider, Content } = Layout;

const SiteContent = ({ children }) => {
  const collapsed = false;
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const currentRoute = router.pathname;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isPublicPage = publicPages.includes(currentRoute);
  const isProtected  = isProtectedPage(currentRoute);

  useEffect(() => {
    if (loading) return;

    if (isProtected && !token) {
      router.push("/login");
    } else if (
      isPublicPage &&
      token &&
      currentRoute !== "/usermanual/changelog" &&
      currentRoute !== "/portfolio"
    ) {
      router.push("/");
    } else if (currentRoute === "/signup" && !allowSignup) {
      router.push("/login");
      message.info("Signup is not allowed at this time.");
    }
  }, [token, loading, currentRoute, router, isProtected, isPublicPage, allowSignup]);

  if (loading && !currentRoute.includes('/page-builder')) return <Loader />;

  if (isPublicPage) {
    return <Content className="min-h-screen">{children}</Content>;
  }

  const shouldShowSidebar = token && isProtected;

  return (
    <Layout className="min-h-screen">
      <Layout>
        {/* Sidebar */}
        {shouldShowSidebar && (
          <div className="fixed" style={{ top: 0, left: 0, bottom: 0, zIndex: 40 }}>
            <Sider
              theme="light"
              width={300}
              trigger={null}
              style={{
                height: "100%",
                background: "#ffffff",
                borderRight: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <SideMenuItems
                token={token}
                user={user}
                handleLogout={logout}
                setIsModalOpen={setIsModalOpen}
                collapsed={false}
              />
            </Sider>
          </div>
        )}

        {/* Main Content */}
        <Layout
          className={`transition-all duration-300 ${
            shouldShowSidebar ? "lg:ml-[300px]" : ""
          }`}
        >
          <Content className="flex-1 bg-white">
            <div className="mx-auto">{children}</div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SiteContent;
