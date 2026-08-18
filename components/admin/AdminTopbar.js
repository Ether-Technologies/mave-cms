import { BankOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function AdminTopbar({
  title = "Administration",
  actionLabel,
  onAction,
  showAction = false,
}) {
  return (
    <div
      className="top-nav"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "4px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <BankOutlined
          style={{
            fontSize: 30,
            border: "1px solid #f0f0f0",
            padding: 7,
            borderRadius: 5,
          }}
        />
        <h3
          style={{
            fontSize: "1.3rem",
            fontWeight: 500,
          }}
        >
          {title}
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        {showAction && (
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              backgroundColor: "var(--maveyellow)",
              color: "white",
            }}
            icon={<PlusCircleOutlined />}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
