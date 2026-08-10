import { BankOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";

export default function AdminTopbar({
  menuItems,
  active,
  title = "Administration",
  actionLabel,
  onAction,
  showAction = false,
}) {
  return (
    <div
      className="top-nav"
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 6fr 1fr",
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
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 16,
            fontWeight: 400,
          }}
        >
          {menuItems?.map((item) => (
            <div
              key={item.key}
              style={{
                color: active === item.key ? "var(--maveyellow)" : "black",
                textDecoration: active === item.key ? "underline" : "none",
                textUnderlineOffset: 20,
                fontWeight: 500,
              }}
            >
              <Link href={item.link}>{item.title}</Link>
            </div>
          ))}
        </div>
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
