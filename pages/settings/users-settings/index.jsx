import { message } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import instance from "../../../axios";
import UsersTopbar from "../../../components/settings/user/UsersTopbar";
import UserTable from "../../../components/settings/userv2/UserTable";

const initialLogs = [
  {
    id: 1,
    timestamp: "2024-07-01 10:00:00",
    user: "John Doe",
    action: "Login",
    details: "User logged in",
  },
  {
    id: 2,
    timestamp: "2024-07-01 11:00:00",
    user: "Jane Smith",
    action: "Edit",
    details: "Edited an article",
  },
  // Add more logs as needed
];

export default function usersSettingsPage() {
  const router = useRouter();
  const [users, setUsers] = useState();
  const [roles, setRoles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [logs, setLogs] = useState(initialLogs);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("1");
  const [createUser, setCreateUser] = useState(false);

  const menuItems = [
    {
      key: "1",
      title: "Users",
      link: "/settings/users-settings",
    },
    {
      key: "2",
      title: "Registration",
      link: "/settings/user-registration",
    },
    {
      key: "3",
      title: "Access Control",
      link: "/settings/access-control",
    },
    {
      key: "4",
      title: "Role Permission",
      link: "/settings/role-permission",
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
    if (router.pathname === "/settings/users-settings") {
      setActive("1");
    }
  }, [router.pathname]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/admin/users");
      if (res.status === 200) {
        setUsers(res.data);
      }
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await instance.get("/roles");
      if (res.status === 200) {
        // If roles array is empty, create default roles
        if (!res.data || res.data.length === 0) {
          setRoles([
            { id: 1, title: "Admin" },
            { id: 2, title: "User" },
          ]);
        } else {
          setRoles(res.data);
        }
      } else {
        console.error("Failed to fetch roles:", res);
        message.error("Failed to fetch roles");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      // Set default roles if API fails
      setRoles([
        { id: 1, title: "Admin" },
        { id: 2, title: "User" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);
    const items = {
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    };
    try {
      const response = await instance.post("/admin/register", items);
      if (response.status === 201) {
        console.log("User created successfully");
        message.success("User created successfully");
        setCreateUser(false);
        fetchUsers();
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Debug logs
  useEffect(() => {
    console.log("Current User:", currentUser);
    console.log("Roles:", roles);
  }, [currentUser, roles]);

  if (!currentUser) {
    return null; // or a loading spinner
  }

  return (
    <div className="mavecontainer">
      <UsersTopbar
        menuItems={menuItems}
        active={active}
        setActive={setActive}
        setCreateUser={setCreateUser}
        createUser={createUser}
        fetchUsers={fetchUsers}
        roles={roles}
        currentUser={currentUser}
      />
      <UserTable
        users={users}
        fetchUsers={fetchUsers}
        setUsers={setUsers}
        roles={roles}
        currentUser={currentUser}
      />
    </div>
  );
}
