import React, { useEffect, useState } from "react";
import { Image, Layout, Button, Modal, message } from "antd";
import { useRouter } from "next/router";
import NavItems from "./ui/NavItems";
import SideMenuItems from "./ui/SideMenuItems";
import Loader from "./Loader";
import { useAuth } from "../src/context/AuthContext";
import { useMenuRefresh } from "../src/context/MenuRefreshContext";
import { publicPages, allowSignup, isProtectedPage } from "../config/routes";

const { Sider, Content, Header } = Layout;

const SiteContent = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const currentRoute = router.pathname;
  const { refreshMenu } = useMenuRefresh();

  // State for login modal (optional, can be removed if not needed)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine if the current page is public or protected
  const isPublicPage = publicPages.includes(currentRoute);
  const isProtected = isProtectedPage(currentRoute);

  useEffect(() => {
    console.log("Allow Signup:", allowSignup); // Debugging
  }, [allowSignup]);

  useEffect(() => {
    // Theme initialization
    try {
      const storedTheme = localStorage.getItem("darkmode");
      if (storedTheme) {
        setTheme(storedTheme === "true" ? "dark" : "light");
      }
    } catch (error) {
      console.warn("localStorage is not available. Using default theme.");
    }

    const handleThemeChange = () => {
      try {
        const updatedTheme = localStorage.getItem("darkmode");
        if (updatedTheme) {
          setTheme(updatedTheme === "true" ? "dark" : "light");
        }
      } catch (error) {
        console.warn("localStorage is not available. Theme not updated.");
      }
    };

    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isProtected && !token) {
      // Redirect to login if the page is protected and the user is not authenticated
      router.push("/login");
    } else if (
      isPublicPage &&
      token &&
      currentRoute !== "/usermanual/changelog" &&
      currentRoute !== "/portfolio"
    ) {
      // Redirect to home if the user is authenticated and tries to access a public page
      // EXCEPT for the changelog page
      router.push("/");
    } else if (currentRoute === "/signup" && !allowSignup) {
      // Redirect to login if signup is not allowed
      router.push("/login");
      message.info("Signup is not allowed at this time.");
    }
  }, [
    token,
    loading,
    currentRoute,
    router,
    isProtected,
    isPublicPage,
    allowSignup,
  ]);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  if (loading) return <Loader />;

  if (isPublicPage) {
    // Render public pages without layout
    return <Content className="min-h-screen">{children}</Content>;
  }

  // Determine if the sidebar should be displayed
  const shouldShowSidebar = token && isProtected;

  return (
    <Layout className="min-h-screen">
      {/* Fixed Header */}
      <Header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center px-4 md:px-8">
        <NavItems
          user={user}
          token={token}
          handleLogout={logout}
          theme={theme}
          setTheme={setTheme}
        />
      </Header>

      <Layout className="pt-16">
        {/* Conditionally render the Side Navigation */}
        {shouldShowSidebar && (
          <div className="fixed">
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={handleCollapse}
              theme={theme}
              width={260}
              style={{ height: "80vh" }}
              className="top-0 left-0 px-2 z-40 rounded-r-2xl mt-5
                bg-white shadow-lg transition-all duration-300 overflow-y-auto"
              breakpoint="lg"
              collapsedWidth={80}
              trigger={null}
            >
              <div className="flex pt-10">
                <SideMenuItems
                  token={token}
                  user={user}
                  handleLogout={logout}
                  setIsModalOpen={setIsModalOpen} // Pass the setter
                  collapsed={collapsed}
                  theme={theme}
                  setTheme={setTheme}
                />
              </div>
            </Sider>
          </div>
        )}

        {/* Main Content Area */}
        <Layout
          className={`transition-all duration-300 ${shouldShowSidebar
              ? collapsed
                ? "lg:ml-[80px]" // Adjusted to match collapsedWidth
                : "lg:ml-[260px]" // Match the width of Sider
              : ""
            }`}
        >
          {/* Conditionally render the Collapse Button only for protected pages and public with layout pages when authenticated */}
          {shouldShowSidebar && (
            <div
              className={`hidden lg:flex fixed lg:top-20 z-40
                ${collapsed
                  ? "left-[50px] lg:left-[52px]"
                  : "left-[260px] lg:left-[235px]"
                } transition-all duration-300
                `}
            >
              <Image
                src={
                  collapsed
                    ? "/icons/mave_icons/expand.svg"
                    : "/icons/mave_icons/collapse.svg"
                }
                alt={collapsed ? "Expand" : "Collapse"}
                width={40}
                height={40}
                preview={false}
                className="cursor-pointer collapse-button border-0 transition-all duration-300"
                onClick={handleCollapse}
              />
            </div>
          )}

          <Content className="flex-1 py-4 md:py-8 bg-gray-100">
            {/* Responsive Container */}
            <div className="mx-auto">{children}</div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SiteContent;
