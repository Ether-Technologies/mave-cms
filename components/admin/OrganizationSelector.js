import { BankOutlined } from "@ant-design/icons";
import { Select, Spin } from "antd";
import { useAuth } from "../../src/context/AuthContext";

export default function OrganizationSelector() {
  const {
    user,
    organization,
    organizations,
    organizationsLoading,
    setSelectedOrganization,
  } = useAuth();

  if (!user?.is_super_admin) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 max-w-full">
      <div
        className="px-3 py-1 rounded-xl text-xs font-semibold text-white
          bg-gradient-to-r from-amber-500 to-orange-600 shadow-md whitespace-nowrap"
        title="Platform Super Admin"
      >
        Super Admin
      </div>
      <BankOutlined className="text-indigo-500 text-base" />
      {organizationsLoading ? (
        <Spin size="small" />
      ) : (
        <Select
          showSearch
          placeholder="Select organization"
          value={organization?.id}
          loading={organizationsLoading}
          className="min-w-[220px]"
          optionFilterProp="label"
          options={organizations.map((org) => ({
            value: org.id,
            label: org.name,
          }))}
          onChange={(organizationId) => {
            const selected = organizations.find(
              (org) => org.id === organizationId
            );
            if (selected) {
              setSelectedOrganization(selected);
            }
          }}
        />
      )}
    </div>
  );
}
