import { message } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CustomersTable from "./components/CustomersTable";
import CustomersTopbar from "./components/customerTopbar";
import { userApi } from "../../../utils/customersApi";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("3");

  const menuItems = [
    { key: "1", title: "Categories", link: "/ecommerce/categories" },
    { key: "2", title: "Packages", link: "/ecommerce/packages" },
    { key: "3", title: "Customers", link: "/ecommerce/customers" },
    { key: "4", title: "Orders", link: "/ecommerce/orders" },
  ];

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        message.error("Error loading user data");
      }
    }
  }, []);

  useEffect(() => {
    if (router.pathname === "/ecommerce/customers") {
      setActive("3");
    }
  }, [router.pathname]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getAll();
      if (response.success) {
        setCustomers(response.users || []);
      } else {
        message.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (!currentUser) return null;

  return (
    <div className="mavecontainer">
      <CustomersTopbar
        menuItems={menuItems}
        active={active}
        setActive={setActive}
        currentUser={currentUser}
      />
      <CustomersTable
        customers={customers}
        fetchCustomers={fetchCustomers}
        setCustomers={setCustomers}
        currentUser={currentUser}
        loading={loading}
      />
    </div>
  );
}
