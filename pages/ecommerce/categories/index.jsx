import { message } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CategoriesTopbar from "./components/CategoriesTopbar";
import CategoriesTable from "./components/CategoriesTable";
import { categoryApi } from "../../../utils/categoryApi";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("1");
  const [createCategory, setCreateCategory] = useState(false);

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

  // Get current user from localStorage
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
    if (router.pathname === "/ecommerce/categories") {
      setActive("1");
    }
  }, [router.pathname]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getAll();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);



  if (!currentUser) {
    return null; 
  }

  return (
    <div className="mavecontainer">
      <CategoriesTopbar
        menuItems={menuItems}
        active={active}
        setActive={setActive}
        setCreateCategory={setCreateCategory}
        createCategory={createCategory}
        fetchCategories={fetchCategories}
        currentUser={currentUser}
      />
      <CategoriesTable
        categories={categories}
        fetchCategories={fetchCategories}
        setCategories={setCategories}
        currentUser={currentUser}
        loading={loading}
      />
    </div>
  );
}
