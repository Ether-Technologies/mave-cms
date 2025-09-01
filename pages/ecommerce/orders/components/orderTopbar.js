import { AppstoreOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function OrdersTopbar({ menuItems, active, setActive }) {
  return (
    <div
      className="top-nav"
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 6fr 1fr",
        alignItems: "center",
        borderBottom: "4px solid #f0f0f0",
        padding: "16px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <AppstoreOutlined
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
          Order Management
        </h3>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 16,
            fontWeight: 400,
          }}
        >
          {menuItems.map((item) => (
            <div
              key={item.key}
              style={{
                color: active === item.key ? "var(--maveyellow)" : "black",
                textDecoration: active === item.key ? "underline" : "none",
                textUnderlineOffset: 20,
                fontWeight: 500,
              }}
              onClick={() => setActive(item.key)}
            >
              <Link href={item.link}>{item.title}</Link>
            </div>
          ))}
        </div>
      </div>

      <div></div>
    </div>
  );
}
