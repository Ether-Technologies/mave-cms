import { useEffect, useState } from "react";
import { Empty, message } from "antd";
import instance from "../../../axios";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import UserTable from "../../../components/settings/userv2/UserTable";
import UserForm from "../../../components/settings/user/UserForm";
import { usePermissions } from "../../../src/hooks/usePermissions";

export default function AdminUsersPage() {
  const { hasPermission, isSuperAdmin, canManagePlatform } = usePermissions();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [createUser, setCreateUser] = useState(false);

  const canViewUsers =
    isSuperAdmin ||
    canManagePlatform ||
    hasPermission("view_users") ||
    hasPermission("admin_all");

  const canCreateUser =
    isSuperAdmin ||
    hasPermission("create_users") ||
    hasPermission("admin_all");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      return;
    }

    try {
      setCurrentUser(JSON.parse(userStr));
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      message.error("Error loading user data");
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await instance.get("/admin/users");
      if (res.status === 200) {
        setUsers(res.data);
      }
    } catch (error) {
      message.error("Failed to fetch users");
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await instance.get("/roles");
      if (res.status === 200 && res.data?.length) {
        setRoles(res.data);
        return;
      }

      setRoles([
        { id: 1, title: "Admin" },
        { id: 2, title: "User" },
      ]);
    } catch (error) {
      setRoles([
        { id: 1, title: "Admin" },
        { id: 2, title: "User" },
      ]);
    }
  };

  useEffect(() => {
    if (canViewUsers) {
      fetchUsers();
      fetchRoles();
    }
  }, [canViewUsers]);

  if (!canViewUsers) {
    return (
      <div className="mavecontainer">
        <Empty description="You do not have permission to manage users." />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="mavecontainer">
      <AdminTopbar
        title="Users"
        actionLabel="Add User"
        showAction={canCreateUser}
        onAction={() => setCreateUser(true)}
      />

      <div style={{ marginTop: 24 }}>
        <UserTable
          users={users}
          fetchUsers={fetchUsers}
          setUsers={setUsers}
          roles={roles}
          currentUser={currentUser}
        />
      </div>

      {createUser && (
        <UserForm
          visible={createUser}
          onCancel={() => setCreateUser(false)}
          fetchUsers={fetchUsers}
          roles={roles}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
