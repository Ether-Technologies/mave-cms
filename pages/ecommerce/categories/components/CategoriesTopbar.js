import { PlusCircleOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";
import CategoryForm from "./CategoryForm";

export default function CategoriesTopbar({
    menuItems,
    active,
    setCreateCategory,
    createCategory,
    fetchCategories,
    currentUser,
}) {
    // Check if user has permission to create categories
    const canCreateCategory = currentUser?.role_id === "2";

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
                    Category Management
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
                {/* {canCreateCategory && (
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: "var(--maveyellow)",
                            color: "white",
                            borderColor: "var(--maveyellow)",
                        }}
                        icon={<PlusCircleOutlined />}
                        onClick={() => setCreateCategory(true)}
                        disabled={active !== "1"}
                    >
                        Add Category
                    </Button>
                )} */}
                {createCategory && (
                    <CategoryForm
                        visible={createCategory}
                        onCancel={() => setCreateCategory(false)}
                        fetchCategories={fetchCategories}
                        currentUser={currentUser}
                    />
                )}
            </div>
        </div>
    );
}
