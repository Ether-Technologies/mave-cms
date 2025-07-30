// const UserList = ({ users, onEdit, onDelete }) => {
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Col, Input, Popconfirm, Row, Select, message } from "antd";
import { useState, useEffect } from "react";
import instance from "../../../axios";
import Loader from "../../Loader";

const UserList = ({
  users,
  importedData,
  setUsers,
  onEdit,
  onDelete,
  fetchUsers,
}) => {
  // const [users, setUsers] = useState([]);
  const [createUser, setCreateUser] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [userEdit, setUserEdit] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [modifiedUserData, setModifiedUserData] = useState({});

  useEffect(() => {
    // Check if passwords match and update state
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e, inputName) => {
    switch (inputName) {
      case "name":
        setName(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        emailValidation(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "confirmPassword":
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
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

  const handleUserInputChange = (fieldName, value) => {
    setModifiedUserData({
      ...modifiedUserData,
      [fieldName]: value,
    });
  };

  const handleUpdateUser = async (id) => {
    setLoading(true);
    const updatedUser = {
      ...users.find((user) => user.id === id),
      ...modifiedUserData,
    };
    try {
      const response = await instance.put(`/admin/user/${id}`, updatedUser);
      if (response.status === 200) {
        console.log("User Updated Successfully");
        setUsers(users?.map((user) => (user.id === id ? updatedUser : user)));
        setUserEdit(false);
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUserEdit = (user) => {
    setUserEdit(true);
    setEditUserId(user?.id);
    setModifiedUserData({
      name: user?.name,
      email: user?.email,
      role_id: user?.role_id,
    });
  };

  const handleDeleteUser = async (id) => {
    setLoading(true);
    try {
      const response = await instance.delete(`/admin/user/${id}`);
      if (response.status === 200) {
        console.log("User Deleted Successfully");
        message.success("User Deleted Successfully");
        setUsers(users.filter((user) => user.id !== id));
        fetchUsers();
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const emailValidation = (email) => {
    const emailRegEx =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*@(gmail\.com|mave\.cms|webable\.digital)$/;
    if (!email.trim()) {
      setEmailMessage("Email is required. (e.g.: username@gmail.com)");
      setValidEmail(false);
      return;
    }
    if (emailRegEx.test(email)) {
      setEmailMessage("Email is valid");
      setValidEmail(true);
    } else {
      setEmailMessage(
        "Email is invalid. Please use @gmail.com as email extension"
      );
      setValidEmail(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isSubmitDisabled = !validEmail || !passwordsMatch;

  return (
    <div style={{ marginTop: "4rem" }}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <Col
              style={{
                marginBottom: "1rem",
                padding: "2rem",
                borderRadius: "5px",
              }}
            >
              <Row
                gutter={16}
                style={{
                  backgroundColor: "#ceedff",
                  padding: "1rem 1em",
                  borderRadius: "5px",
                  marginTop: "2rem",
                }}
              >
                <Col span={9}>
                  <h3 style={{ fontWeight: "bold" }}>Name</h3>
                </Col>
                <Col span={9}>
                  <h3 style={{ fontWeight: "bold" }}>Email</h3>
                </Col>
                <Col span={4}>
                  <h3 style={{ fontWeight: "bold" }}>Role</h3>
                </Col>
                <Col span={2}>
                  <h3 style={{ fontWeight: "bold" }}>Actions</h3>
                </Col>
              </Row>
              {users?.map((user) => (
                <Row
                  gutter={16}
                  style={{
                    marginTop: "1rem",
                    backgroundColor: "#ceedff",
                    padding: "1rem 1em",
                    borderRadius: "5px",
                  }}
                  key={user.id}
                >
                  <Col span={9}>
                    {userEdit && user?.id == editUserId ? (
                      <Input
                        defaultValue={user?.name}
                        onChange={(e) =>
                          handleUserInputChange("name", e.target.value)
                        }
                      />
                    ) : (
                      user?.name
                    )}
                  </Col>
                  <Col span={9}>
                    {userEdit && user?.id == editUserId ? (
                      <Input
                        defaultValue={user?.email}
                        onChange={(e) =>
                          handleUserInputChange("email", e.target.value)
                        }
                      />
                    ) : (
                      user?.email
                    )}
                  </Col>
                  <Col span={4}>
                    {userEdit && user?.id == editUserId ? (
                      <Select
                        defaultValue={
                          roles2.find((role) => role.id == user?.role_id)?.id
                        }
                        onChange={(value) =>
                          handleUserInputChange("role_id", value)
                        }
                        style={{ width: "100%" }}
                        showSearch
                      >
                        {roles2?.map((role) => (
                          <Select.Option value={role.id} key={role.id}>
                            {role.name}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : user?.role_id ? (
                      roles2.find((role) => role.id == user?.role_id)?.name
                    ) : (
                      "Guest"
                    )}
                  </Col>
                  <Col span={2}>
                    {userEdit && user?.id == editUserId ? (
                      <div className="flexed-center">
                        <Button
                          icon={<CheckOutlined />}
                          style={{ marginRight: "1rem" }}
                          onClick={() => handleUpdateUser(user?.id)}
                        />
                        <Button
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => setUserEdit(false)}
                        />
                      </div>
                    ) : (
                      <div className="flexed-center" style={{ gap: "1em" }}>
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: "var(--theme)",
                            color: "white",
                            padding: "0.5rem 1rem",
                          }}
                          onClick={() => handleUserEdit(user)}
                        >
                          <EditOutlined />
                        </Button>
                        <Popconfirm
                          title="Are you sure to delete this user?"
                          onConfirm={() => handleDeleteUser(user?.id)}
                          onCancel={() => message.info("User not deleted")}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            danger
                            type="primary"
                            style={{
                              padding: "0.5rem 1rem",
                            }}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Popconfirm>
                      </div>
                    )}
                  </Col>
                </Row>
              ))}
            </Col>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
