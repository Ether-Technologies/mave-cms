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
  const [isMobile, setIsMobile] = useState(false);
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const currentRoute = router.pathname;
  const { refreshMenu } = useMenuRefresh();

  // State for login modal (optional, can be removed if not needed)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine if the current page is public or protected
  const isPublicPage = publicPages.includes(currentRoute);
  const isProtected = isProtectedPage(currentRoute);

  useEffect(() => {}, [allowSignup]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);

      // Auto-collapse sidebar on smaller screens
      if (width < 1024) {
        setCollapsed(true);
      } else if (width >= 1440) {
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Don't show loader for page-builder pages
  if (loading && !currentRoute.includes("/page-builder")) return <Loader />;

  if (isPublicPage) {
    // Render public pages without layout
    return <Content className="min-h-screen">{children}</Content>;
  }

  // Determine if the sidebar should be displayed
  const shouldShowSidebar = token && isProtected;

  // Calculate dynamic widths for better responsiveness
  const sidebarWidth = collapsed ? 80 : 260;
  const contentMargin = shouldShowSidebar ? sidebarWidth : 0;

  return (
    <Layout className="min-h-screen overflow-x-hidden">
      {/* Fixed Header */}
      <Header
        className="mave-shell-header fixed top-0 left-0 right-0 z-50 flex 
      items-center px-3 sm:px-4 md:px-6 lg:px-8 h-14 border-0 shadow-none"
      >
        <NavItems
          user={user}
          token={token}
          handleLogout={logout}
          theme={theme}
          setTheme={setTheme}
        />
      </Header>

      <Layout className="pt-14">
        {/* Conditionally render the Side Navigation */}
        {shouldShowSidebar && (
          <div className="fixed top-14 left-0 bottom-0 z-40">
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={handleCollapse}
              theme={theme}
              width={260}
              style={{
                height: "calc(100vh - 3.5rem)",
                minHeight: "calc(100vh - 3.5rem)",
                maxHeight: "calc(100vh - 3.5rem)",
              }}
              className="mave-shell-sider px-2 rounded-none
                transition-all duration-300 overflow-y-auto overflow-x-hidden
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              breakpoint="lg"
              collapsedWidth={80}
              trigger={null}
            >
              <div className="flex pt-6 pb-4">
                <SideMenuItems
                  token={token}
                  user={user}
                  handleLogout={logout}
                  setIsModalOpen={setIsModalOpen}
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
          className="transition-all duration-300 ease-in-out min-h-[calc(100vh-3.5rem)]"
          style={{
            marginLeft:
              shouldShowSidebar && !isMobile ? `${contentMargin}px` : "0",
            width:
              shouldShowSidebar && !isMobile
                ? `calc(100vw - ${contentMargin}px)`
                : "100vw",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Conditionally render the Collapse Button */}
          {shouldShowSidebar && !isMobile && (
            <div
              className="hidden lg:flex fixed top-20 z-40 transition-all duration-300"
              style={{
                left: collapsed ? "52px" : "235px",
              }}
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
                className="cursor-pointer collapse-button border-0 transition-all duration-300 hover:scale-110"
                onClick={handleCollapse}
              />
            </div>
          )}

          <Content
            className="mave-shell-content min-h-[calc(100vh-3.5rem)]"
            style={{
              width: "100%",
              maxWidth: "100%",
              padding: 0,
              boxSizing: "border-box",
            }}
          >
            {/* Content wrapper */}
            <div
              style={{ width: "100%", height: "100%", boxSizing: "border-box" }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SiteContent;
