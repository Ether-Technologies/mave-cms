import { message } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PackagesTopbar from "./components/PackagesTopbar";
import PackagesTable from "./components/PackagesTable";
import { packageApi } from "../../../utils/packageApi";

export default function PackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("2");
  const [createPackage, setCreatePackage] = useState(false);

  const menuItems = [
    {
      key: "1",
      title: "Categories",
      link: "/ecommerce/categories",
    },
    {
      key: "2",
      title: "Packages",
      link: "/ecommerce/packages",
    },
    {
      key: "3",
      title: "Customers",
      link: "/ecommerce/customers",
    },
    {
      key: "4",
      title: "Orders",
      link: "/ecommerce/orders",
    },
  ];

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        message.error("Error loading user data");
      }
    }
  }, []);

  useEffect(() => {
    if (router.pathname === "/ecommerce/packages") {
      setActive("2");
    }
  }, [router.pathname]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await packageApi.getAll();
      if (response.success) {
        setPackages(response.packages); 
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);


  if (!currentUser) {
    return null; 
  }

  return (
    <div className="mavecontainer">
      <PackagesTopbar
        menuItems={menuItems}
        active={active}
        setActive={setActive}
        setCreatePackage={setCreatePackage}
        createPackage={createPackage}
        fetchPackages={fetchPackages}
        currentUser={currentUser}
      />
      <PackagesTable
        packages={packages}
        fetchPackages={fetchPackages}
        setPackages={setPackages}
        currentUser={currentUser}
        loading={loading}
      />
    </div>
  );
}
