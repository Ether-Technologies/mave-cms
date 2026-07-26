import { useState, useEffect, useCallback } from "react";
import { Breadcrumb, Button, Modal } from "antd";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../src/context/AuthContext";
import TenantTable from "../../components/tenants/TenantTable";
import CreateTenant from "../../components/tenants/CreateTenant";

export default function Tenants() {
  const { user } = useAuth();
  const router = useRouter();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const roleName = (
      user?.role_mave?.name ||
      user?.role_mave?.title ||
      user?.role ||
      ""
    ).toLowerCase();
    const isAdmin =
      roleName === "admin" ||
      user?.is_admin === true ||
      String(user?.role_id) === "1";
    if (user && !isAdmin) {
      router.replace("/");
    }
  }, [user, router]);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tenants");
      const data = await res.json();
      setTenants(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch tenants:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleCreated = () => {
    setModalVisible(false);
    fetchTenants();
  };

  return (
    <div className="mavecontainer">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumb
          style={{ margin: "16px 0", fontWeight: "600" }}
          separator=">"
          items={[
            {
              title: (
                <Link href="/">
                  <HomeOutlined />
                </Link>
              ),
            },
            { title: "Tenants" },
          ]}
        />
        <Button
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          style={{
            backgroundColor: "var(--theme)",
            color: "white",
            borderColor: "var(--theme)",
            marginY: "16px",
          }}
        >
          Create Tenant
        </Button>
      </div>

      <TenantTable tenants={tenants} loading={loading} onRefresh={fetchTenants} />

      <Modal
        title="Create Tenant"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <CreateTenant onSuccess={handleCreated} />
      </Modal>
    </div>
  );
}
