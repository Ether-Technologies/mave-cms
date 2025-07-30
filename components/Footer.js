import React, { useEffect, useState } from "react";
import instance from "../axios";
import {
  Button,
  Card,
  Col,
  Collapse,
  Image,
  Input,
  Popconfirm,
  Row,
  Select,
  message,
  notification,
  Breadcrumb,
} from "antd";
import {
  CloseCircleOutlined,
  CloseOutlined,
  CloseSquareFilled,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SyncOutlined,
  HomeFilled,
  CopyOutlined,
} from "@ant-design/icons";
import Loader from "./Loader";
import router from "next/router";
import MediaSelectionModal1 from "./PageBuilder/Modals/MediaSelectionModal.jsx";
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;
const { Panel } = Collapse;
const Footer = () => {
  const [footerData, setFooterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCollapsed1, setIsCollapsed1] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState([]);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [selectedItems, setSelectedItems] = useState("");
  const [selectedItemsColumn3, setSelectedItemsColumn3] = useState("");
  const [selectedItemsColumn4, setSelectedItemsColumn4] = useState("");
  const [selectedItemsBottom, setSelectedItemsBottom] = useState("");
  const [formData, setFormData] = useState({
    title_en: "",
    title_bn: "",
    logo_id: "",
    address1_title_en: "",
    address1_title_bn: "",
    address1_description_en: "",
    address1_description_bn: "",
    address2_title_en: "",
    address2_title_bn: "",
    address2_description_en: "",
    address2_description_bn: "",
    column2_menu_id: "",
    column3_menu_id: "",
    column3_logos: "",
    column4_title_en: "",
    column4_title_bn: "",
    column4_image: "",
    column4_text_en: "",
    column4_text_bn: "",
    column4_description_en: "",
    column4_description_bn: "",
    column4_menu_id: "",
    bottom_menu_id: "",
    logo: [],
    column2_menu: {},
    column3_menu: {},
    column4_menu: {},
    bottom_menu: {},

    // Add more fields as needed
  });

  const handleChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const keysToUpdate = [
    "address1_title_en",
    "address1_title_bn",
    "address1_description_en",
    "address1_description_bn",
    "address2_title_en",
    "address2_title_bn",
    "address2_description_en",
    "address2_description_bn",
    "column4_title_en",
    "column4_title_bn",
    "column4_text_en",
    "column4_text_bn",
    "column4_description_en",
    "column4_description_bn",
    "title_en",
    "title_bn",
    "logo_id",
    "bottom_menu_id",
    "column2_menu_id",
    "column3_menu_id",
    "column4_menu_id",
    "logo",
    "column2_menu",
    "column3_menu",
    "column4_menu",
    "bottom_menu",
  ];

  const updateFormDataFromItems = (items) => {
    const updatedData = { ...formData };
    keysToUpdate?.map((key) => {
      updatedData[key] = items?.[key] || "";
    });
    setFormData(updatedData);
  };

  // Define the onChange event handler for the Select component
  const handleSelectChange = (selectedValues) => {
    setSelectedItems(selectedValues);
    setFormData({
      ...formData,
      column2_menu_id: selectedValues,
    });
  };
  // Define separate onChange event handlers for each Select component

  const handleSelectChangeColumn3 = (selectedValue) => {
    setSelectedItemsColumn3(selectedValue);
    setFormData({
      ...formData,
      column3_menu_id: selectedValue,
    });
  };

  const handleOpenModal1 = () => {
    // Open the modal when the user clicks a button
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    // Close the modal when the user cancels
    setModalVisible(false);
  };

  const handleMediaSelect = (media) => {
    // Handle media selection from the modal
    setSelectedMedia(media);
    setModalVisible(false); // Close the modal
    // Update formData.logo_id if needed
    setFormData({ ...formData, logo_id: media.id });
  };

  const handleSelectChangeColumn4 = (selectedValue) => {
    setSelectedItemsColumn4(selectedValue);
    setFormData({
      ...formData,
      column4_menu_id: selectedValue,
    });
  };

  const handleSelectChangeBottom = (selectedValue) => {
    setSelectedItemsBottom(selectedValue);
    setFormData({
      ...formData,
      bottom_menu_id: selectedValue,
    });
  };
  const handleOpenModal = () => {
    // Open the modal when the user clicks a button
    setModalVisible(true);
  };
  // Event handler for Select component
  const handleSelectChange1 = (value) => {
    // Find the selected media item based on the value
    const selected = mediaList.find((media) => media.id === value);
    setSelectedMedia(selected);
    setFormData({
      ...formData,
      logo_id: value,
    });
  };
  const toggleCollapse = (id, items) => {
    setIsCollapsed(!isCollapsed);
    // setIsCollapsed1(true)
    // setIsActive(!isActive);

    setId(id);
    updateFormDataFromItems(items);
  };
  const toggleCollapseAdd = () => {
    setIsCollapsed1(!isCollapsed1);
  };
  const handleCancelDelete = () => {
    setDeleteItemId(null);
    setDeleteConfirmationVisible(false);
  };
  const showDeleteConfirmation = (id) => {
    setDeleteItemId(id);
    setDeleteConfirmationVisible(true);
  };

  const handleClose = () => {
    toggleCollapseAdd(true);
    setFormData("");
    setSelectedItemsBottom("");
    setSelectedItemsColumn3("");
    setSelectedItemsColumn4("");
    setSelectedItems("");
    setSelectedMedia("");
  };

  const getFooters = async () => {
    try {
      setIsLoading(true);
      const res = await instance.get("/footers");
      setFooterData(res.data?.sort((a, b) => b.id - a.id));
      setIsLoading(false);
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const getMenus = async () => {
    try {
      setIsLoading(true);
      const res = await instance.get("/menus");
      setMenuData(res.data);
      setIsLoading(false);
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const getMedia = async () => {
    try {
      setIsLoading(true);
      const res = await instance.get("/media");
      setMediaList(res.data);
      setIsLoading(false);
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getFooters();
    getMenus();
    getMedia();
  }, []);

  // footer post respose data area
  const handlePost = async () => {
    try {
      setIsLoading(true);
      // Send a put request to the API endpoint
      const res = await instance.post("/footers", formData);
      setData(res.data);
      console.log("Footer Added successfully");
      const getData = async () => {
        try {
          const res = await instance.get("/footers");
          setFooterData(res.data);
          setIsLoading(false);
        } catch (error) {
          message.error("Something went wrong");
        }
      };
      getData();
    } catch (error) {
      // Handle errors, e.g., display an error message or log the error
      console.error("Error deleting data:", error);
    }
  };
  // footer update respose data area
  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      // Send a put request to the API endpoint
      const res = await instance.put(`/footers/${id}`, formData);
      console.log("Footer Updated successfully");
      setData(res.data);
      getFooters();
      setIsLoading(false);
      toggleCollapse(id);
    } catch (error) {
      // Handle errors, e.g., display an error message or log the error
      console.error("Error deleting data:", error);
    }
  };
  // footer Delete respose data area
  const handleDelete = async (id) => {
    try {
      // Send a DELETE request to the API endpoint
      const res = await instance.delete(`/footers/${id}`);
      console.log("Footer deleted successfully");
      const getData = async () => {
        try {
          const res = await instance.get("/footers");

          setFooterData(res.data);
          setIsLoading(false);
        } catch (error) { }
      };
      getData();
    } catch (error) {
      // Handle errors, e.g., display an error message or log the error
      console.error("Error deleting data:", error);
    }
  };
  if (isLoading) return <Loader />;

  return (
    <>
      <div className="mavecontainer">
        <div
          className="TopbarContainer"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // gridTemplateColumns: "1fr 1fr",
            // backgroundColor:"red",
            marginBottom: "1rem",
          }}
        >
          <Breadcrumb
            style={{
              fontSize: "1.2em",
              marginBottom: "1em",
            }}
            items={[
              {
                href: "/",
                title: <HomeFilled />,
              },
              {
                title: "Components",
              },
              {
                title: "Menu Items",
                menu: {
                  items: [
                    {
                      title: "Gallery",
                      onClick: () => router.push("/gallery"),
                    },
                    {
                      title: "Menus Items",
                      onClick: () => router.push("/menuitems"),
                    },
                    {
                      title: "Menus",
                      onClick: () => router.push("/menus"),
                    },
                    {
                      title: "Navbars",
                      onClick: () => router.push("/navbars"),
                    },
                    {
                      title: "Sliders",
                      onClick: () => router.push("/sliders"),
                    },
                    {
                      title: "Cards",
                      onClick: () => router.push("/cards"),
                    },
                    {
                      title: "Forms",
                      onClick: () => router.push("/forms"),
                    },
                    {
                      title: "Footers",
                      onClick: () => router.push("/footer"),
                    },
                  ],
                },
              },
            ]}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Button
              type="primary"
              onClick={() => toggleCollapseAdd()}
              style={{
                backgroundColor: "var(--themes)",
                borderColor: "var(--themes)",
                color: "white",
                borderRadius: "10px",
                fontSize: "1.2em",
                // paddingBottom: "1.8em",
                width: "15em",
              }}
              icon={<PlusCircleOutlined />}
            >
              Add New Footer
            </Button>
            <Button
              type="primary"
              style={{
                backgroundColor: "var(--theme)",
                borderColor: "var(--theme)",
                color: "white",
                borderRadius: "10px",
                fontSize: "1.2em",
              }}
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/footers`
                );
                message.success("API Endpoint Copied");
              }}
            >
              Copy API Endpoint
            </Button>
          </div>
        </div>
        {!isCollapsed1 && (
          <div className="ViewContentContainer1">
            <div>
              <hr />
              <div
                className="update_area"
                style={{ paddingTop: "1rem", marginBottom: "2rem" }}
              >
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col span={8}>
                    <div className="content">
                      <h3>Selected Logo:</h3>
                      <br />
                      {/* Media view */}
                      {selectedMedia && (
                        <Card size="small">
                          <Image
                            src={`${MEDIA_URL}/${selectedMedia.file_path}`}
                            alt={selectedMedia.title}
                            preview={false}
                            width={"100%"}
                            height={"100%"}
                            style={{
                              objectFit: "cover",
                              borderRadius: 10,
                              border:
                                selectedMedia === selectedMedia.id
                                  ? "2px solid #1890ff"
                                  : "none",
                            }}
                          />
                          {/* <p>{selectedMedia.file_name}</p> */}
                        </Card>
                      )}

                      <Button
                        type="primary"
                        onClick={handleOpenModal}
                        style={{ marginTop: "1rem" }}
                      >
                        Change Logo
                      </Button>

                      <MediaSelectionModal1
                        mediaList={mediaList}
                        visible={modalVisible}
                        onCancel={handleModalCancel}
                        onSelect={handleMediaSelect}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Title English:</h3>
                      <Input
                        value={formData.title_en}
                        onChange={(e) => handleChange(e, "title_en")}
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Title Bangla:</h3>
                      <Input
                        value={formData.title_bn}
                        onChange={(e) => handleChange(e, "title_bn")}
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Address1 Title English:</h3>
                      <Input
                        value={formData.address1_title_en}
                        onChange={(e) => handleChange(e, "address1_title_en")}
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Address1 Title Bangla:</h3>
                      <Input
                        value={formData.address1_title_bn}
                        onChange={(e) => handleChange(e, "address1_title_bn")}
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                  </Col>
                  <Col span={8}>
                    <div className="content">
                      <h3>Address1 Description English:</h3>
                      <Input.TextArea
                        rows={1}
                        value={formData.address1_description_en}
                        onChange={(e) =>
                          handleChange(e, "address1_description_en")
                        }
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Address1 Description Bangla:</h3>
                      <Input.TextArea
                        rows={2}
                        value={formData.address1_description_bn}
                        onChange={(e) =>
                          handleChange(e, "address1_description_bn")
                        }
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Address2 Title English:</h3>
                      <Input
                        value={formData.address2_title_en}
                        onChange={(e) => handleChange(e, "address2_title_en")}
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Address2 Title Bangla:</h3>
                      <Input
                        value={formData.address2_title_bn}
                        onChange={(e) => handleChange(e, "address2_title_bn")}
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Address2 Description English:</h3>
                      <Input.TextArea
                        rows={1}
                        value={formData.address2_description_en}
                        onChange={(e) =>
                          handleChange(e, "address2_description_en")
                        }
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Address2 Description Bangla:</h3>
                      <Input.TextArea
                        rows={1}
                        value={formData.address2_description_bn}
                        onChange={(e) =>
                          handleChange(e, "address2_description_bn")
                        }
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Column2 Menu:</h3>
                      {console.log("Menu List: ", menuData)}
                      <Select
                        showSearch
                        // mode="multiple"
                        placeholder="Select menu items"
                        style={{ width: "100%", marginTop: ".5rem" }}
                        value={selectedItems} // Set the selected items from state
                        onChange={handleSelectChange} // Set the event handler
                      >
                        {menuData?.map((item) => (
                          <>
                            <Option key={item.id} value={item?.id}>
                              {item.name}
                            </Option>
                          </>
                        ))}
                      </Select>
                    </div>
                    <br />
                    <div className="content">
                      <h3>Column3 Menu:</h3>
                      <Select
                        showSearch
                        // mode="multiple"
                        placeholder="Select menu items"
                        style={{ width: "100%", marginTop: ".5rem" }}
                        value={selectedItemsColumn3} // Set the selected items from state
                        onChange={handleSelectChangeColumn3} // Set the event handler
                      >
                        {menuData?.map((item) => (
                          <>
                            <Option key={item.id} value={item?.id}>
                              {item.name}
                            </Option>
                          </>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="content">
                      <h3>Column4 Menu:</h3>
                      <Select
                        showSearch
                        // mode="multiple"
                        placeholder="Select menu items"
                        style={{ width: "100%", marginTop: ".5rem" }}
                        value={selectedItemsColumn4} // Set the selected items from state
                        onChange={handleSelectChangeColumn4} // Set the event handler
                      >
                        {menuData?.map((item) => (
                          <>
                            <Option key={item.id} value={item?.id}>
                              {item.name}
                            </Option>
                          </>
                        ))}
                      </Select>
                    </div>

                    <br />
                    <div className="content">
                      <h3>Column4 Title En:</h3>
                      <Input
                        value={formData.column4_title_en}
                        onChange={(e) => handleChange(e, "column4_title_en")}
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Column4 Title Alt:</h3>
                      <Input
                        value={formData.column4_title_bn}
                        onChange={(e) => handleChange(e, "column4_title_bn")}
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Column4 Text En:</h3>
                      <Input
                        value={formData.column4_text_en}
                        onChange={(e) => handleChange(e, "column4_text_en")}
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Column4 Text Alt:</h3>
                      <Input
                        value={formData.column4_text_bn}
                        onChange={(e) => handleChange(e, "column4_text_bn")}
                        style={{ marginTop: ".5rem" }}
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Column4 Description English:</h3>
                      <Input.TextArea
                        rows={2}
                        value={formData.column4_description_en}
                        onChange={(e) =>
                          handleChange(e, "column4_description_en")
                        }
                        style={{ marginTop: ".5rem" }}
                        type="number"
                      />
                    </div>
                    <br />

                    <div className="content">
                      <h3>Column4 Description Bangla:</h3>
                      <Input.TextArea
                        rows={1}
                        value={formData.column4_description_bn}
                        onChange={(e) =>
                          handleChange(e, "column4_description_bn")
                        }
                        style={{ marginTop: ".5rem" }}
                        type="number"
                      />
                    </div>
                    <br />
                    <div className="content">
                      <h3>Bottom Menu:</h3>
                      <Select
                        showSearch
                        // mode="multiple"
                        placeholder="Select menu item"
                        style={{ width: "100%", marginTop: ".5rem" }}
                        value={selectedItemsBottom} // Set the selected items from state
                        onChange={handleSelectChangeBottom} // Set the event handler
                      >
                        {menuData?.map((item) => (
                          <>
                            <Option key={item.id} value={item?.id}>
                              {item.name}
                            </Option>
                          </>
                        ))}
                      </Select>
                    </div>
                  </Col>
                  <Button
                    icon={<SyncOutlined />}
                    style={{
                      marginTop: "1rem",
                      marginLeft: "1rem",
                      backgroundColor: "var(--success)",
                      borderColor: "var(--success)",
                      color: "white",
                      borderRadius: "10px",
                      fontSize: "1.2em",
                      marginRight: "1em",
                      // paddingBottom: "1.8em",
                    }}
                    onClick={() => handlePost()}
                  >
                    Add New Footer
                  </Button>
                  <Button
                    style={{
                      marginTop: "1rem",
                      marginLeft: "1rem",
                      backgroundColor: "var(--themes)",
                      borderColor: "var(--themes)",
                      color: "white",
                      borderRadius: "10px",
                      fontSize: "1.2em",
                      // paddingBottom: "1.8em",
                    }}
                    onClick={() => handleClose()}
                  >
                    <CloseCircleOutlined />
                    Cancel
                  </Button>
                </Row>
              </div>
            </div>
          </div>
        )}
        {footerData?.map((items) => (
          <>
            <div
              key={items.id}
              className="ViewContentContainer1"
              style={{
                backgroundColor: "#000530",
                padding: "3rem",
                color: "#ffff",
                marginBottom: "1rem",
              }}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={8}>
                  <img
                    src={`${MEDIA_URL}/${items?.logo?.file_path}`}
                    width={292}
                    alt=""
                  />
                  <div className="address1" style={{ marginTop: "2rem" }}>
                    <h4>{items?.address1_title_en}</h4>
                    <h4 style={{ color: "#c3c3c3" }}>
                      {items?.address1_description_en}
                    </h4>
                  </div>
                  <div className="address1" style={{ marginTop: "4rem" }}>
                    <h4>{items?.address2_title_en}</h4>
                    <h4 style={{ color: "#c3c3c3" }}>
                      {items?.address2_description_en}
                    </h4>
                  </div>
                </Col>
                <Col span={4}>
                  <h2>{items?.column2_menu?.name}</h2>

                  <h4 style={{ color: "#c3c3c3", marginTop: "1rem" }}>
                    {items?.column2_menu?.menu_items?.map((item) => (
                      <p style={{ color: "#fff", marginTop: "1rem" }}>
                        {item?.title}
                      </p>
                    ))}
                  </h4>
                  {/*  */}
                </Col>
                <Col span={6}>
                  <h2>{items?.column3_menu?.name}</h2>
                  <h4 style={{ color: "#c3c3c3", marginTop: "1rem" }}>
                    {items?.column3_menu?.menu_items?.map((item) => (
                      <p style={{ color: "#fff", marginTop: "1rem" }}>
                        {item?.title}
                      </p>
                    ))}
                  </h4>
                </Col>
                <Col span={6}>
                  <h2>Member Of</h2>

                  <p
                    style={{
                      marginTop: ".5rem",
                      display: "flex",
                      justifyItems: "center",
                      columnGap: "1rem",
                    }}
                  >
                    {" "}
                    {items?.column4_description_en}
                  </p>
                </Col>
                <Col span={24} style={{ marginTop: "1rem" }}>
                  <hr style={{ backgroundColor: "#fff" }} />
                  <div
                    className="buttom_menu"
                    style={{
                      display: "flex",
                      columnGap: "4rem",
                      alignItems: "center",
                      marginTop: "1rem",
                    }}
                  >
                    {/* <h4>© 2022 UNITED AYGAZ LPG LTD.</h4>
                     */}
                    <center>
                      <h4>{items?.column4_description_en}</h4>
                    </center>
                    <h4
                      style={{
                        color: "#c3c3c3",
                        display: "flex",
                        columnGap: "2rem",
                      }}
                    >
                      {items?.bottom_menu?.menu_items?.map((item) => (
                        <>
                          {" "}
                          <p
                            style={{
                              color: "#fff",
                              textTransform: "uppercase",
                            }}
                          >
                            {item?.title}
                          </p>
                        </>
                      ))}
                    </h4>
                  </div>
                </Col>
              </Row>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                columnGap: "1rem",
                height: "fit-content",
                marginBottom: "1rem",
              }}
            >
              <div>
                <Button
                  icon={<EditOutlined />}
                  style={{
                    backgroundColor: "var(--theme)",
                    borderColor: "var(--theme)",
                    color: "white",
                    borderRadius: "10px",
                    fontSize: "1em",
                    marginRight: "1em",
                    // paddingBottom: "1.8em",
                  }}
                  onClick={() => toggleCollapse(items.id, items)}
                >
                  {isCollapsed && id === items.id ? "Edit" : "Update"}
                </Button>
              </div>

              <Popconfirm
                title="Are you sure you want to delete this Footer item?"
                onConfirm={() => handleDelete(items.id)}
                okText="Sure"
                cancelText="Cancel"
                open={deleteConfirmationVisible && deleteItemId === items.id}
                onOpenChange={(visible) => {
                  if (!visible) {
                    handleCancelDelete();
                  }
                }}
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="primary"
                  danger
                  style={{
                    borderRadius: "10px",
                    fontSize: "1em",
                    // paddingBottom: "1.8em",
                  }}
                  onClick={() => showDeleteConfirmation(items.id)}
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              </Popconfirm>
            </div>
            {!isCollapsed && id === items.id && (
              <div className="ViewContentContainer1">
                <div>
                  <hr />
                  <div
                    className="update_area"
                    style={{ paddingTop: "1rem", marginBottom: "2rem" }}
                  >
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col span={8}>
                        <div className="content">
                          <h3>Selected Logo:</h3>
                          <br />
                          {/* Media view */}
                          {selectedMedia ? (
                            <Card size="small">
                              <Image
                                src={`${MEDIA_URL}/${selectedMedia.file_path}`}
                                alt={selectedMedia.title}
                                preview={false}
                                width={"100%"}
                                height={"100%"}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: 10,
                                  border:
                                    selectedMedia === selectedMedia.id
                                      ? "2px solid #1890ff"
                                      : "none",
                                }}
                              />
                              {/* <p>{selectedMedia.file_name}</p> */}
                            </Card>
                          ) : (
                            <Card size="small">
                              <Image
                                src={`${MEDIA_URL}/${items.logo.file_path}`}
                                alt={items.file_name}
                                preview={false}
                                width={"100%"}
                                height={"100%"}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: 10,
                                  border:
                                    selectedMedia === selectedMedia.id
                                      ? "2px solid #1890ff"
                                      : "none",
                                }}
                              />
                            </Card>
                          )}
                          <Button
                            type="primary"
                            onClick={handleOpenModal}
                            style={{ marginTop: "1rem" }}
                          >
                            Change Logo
                          </Button>

                          <MediaSelectionModal1
                            mediaList={mediaList}
                            visible={modalVisible}
                            onCancel={handleModalCancel}
                            onSelect={handleMediaSelect}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Title English:</h3>
                          <Input
                            value={formData.title_en}
                            onChange={(e) => handleChange(e, "title_en")}
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Title Bangla:</h3>
                          <Input
                            value={formData.title_bn}
                            onChange={(e) => handleChange(e, "title_bn")}
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Address1 Title English:</h3>
                          <Input
                            value={formData.address1_title_en}
                            onChange={(e) =>
                              handleChange(e, "address1_title_en")
                            }
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Address1 Title Bangla:</h3>
                          <Input
                            value={formData.address1_title_bn}
                            onChange={(e) =>
                              handleChange(e, "address1_title_bn")
                            }
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                      </Col>
                      <Col span={8}>
                        <div className="content">
                          <h3>Address1 Description English:</h3>
                          <Input.TextArea
                            rows={1}
                            value={formData.address1_description_en}
                            onChange={(e) =>
                              handleChange(e, "address1_description_en")
                            }
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Address1 Description Bangla:</h3>
                          <Input.TextArea
                            rows={2}
                            value={formData.address1_description_bn}
                            onChange={(e) =>
                              handleChange(e, "address1_description_bn")
                            }
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Address2 Title English:</h3>
                          <Input
                            value={formData.address2_title_en}
                            onChange={(e) =>
                              handleChange(e, "address2_title_en")
                            }
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Address2 Title Bangla:</h3>
                          <Input
                            value={formData.address2_title_bn}
                            onChange={(e) =>
                              handleChange(e, "address2_title_bn")
                            }
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Address2 Description English:</h3>
                          <Input.TextArea
                            rows={1}
                            value={formData.address2_description_en}
                            onChange={(e) =>
                              handleChange(e, "address2_description_en")
                            }
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Address2 Description Bangla:</h3>
                          <Input.TextArea
                            rows={1}
                            value={formData.address2_description_bn}
                            onChange={(e) =>
                              handleChange(e, "address2_description_bn")
                            }
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Column2 Menu:</h3>
                          <Select
                            showSearch
                            // mode="multiple"
                            placeholder="Select menu items"
                            style={{ width: "100%", marginTop: ".5rem" }}
                            value={
                              selectedItems
                                ? selectedItems
                                : items?.column2_menu?.name
                            } // Set the selected items from state
                            onChange={handleSelectChange} // Set the event handler
                          >
                            {menuData?.map((item) => (
                              <>
                                <Option key={item.id} value={item?.id}>
                                  {item.name}
                                </Option>
                              </>
                            ))}
                          </Select>
                        </div>
                        <br />
                        <div className="content">
                          <h3>Column3 Menu:</h3>
                          <Select
                            showSearch
                            // mode="multiple"
                            placeholder="Select menu items"
                            style={{ width: "100%", marginTop: ".5rem" }}
                            value={
                              selectedItemsColumn3
                                ? selectedItemsColumn3
                                : items?.column3_menu?.name
                            } // Set the selected items from state
                            onChange={handleSelectChangeColumn3} // Set the event handler
                          >
                            {menuData?.map((item) => (
                              <>
                                <Option key={item.id} value={item?.id}>
                                  {item.name}
                                </Option>
                              </>
                            ))}
                          </Select>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="content">
                          <h3>Column4 Menu:</h3>
                          <Select
                            showSearch
                            // mode="multiple"
                            placeholder="Select menu items"
                            style={{ width: "100%", marginTop: ".5rem" }}
                            value={
                              selectedItemsColumn4
                                ? selectedItemsColumn4
                                : items?.column3_menu?.name
                            } // Set the selected items from state
                            onChange={handleSelectChangeColumn4} // Set the event handler
                          >
                            {menuData?.map((item) => (
                              <>
                                <Option key={item.id} value={item?.id}>
                                  {item.name}
                                </Option>
                              </>
                            ))}
                          </Select>
                        </div>

                        <br />
                        <div className="content">
                          <h3>Column4 Title En:</h3>
                          <Input
                            value={formData.column4_title_en}
                            onChange={(e) =>
                              handleChange(e, "column4_title_en")
                            }
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Column4 Title Alt:</h3>
                          <Input
                            value={formData.column4_title_bn}
                            onChange={(e) =>
                              handleChange(e, "column4_title_bn")
                            }
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Column4 Text En:</h3>
                          <Input
                            value={formData.column4_text_en}
                            onChange={(e) => handleChange(e, "column4_text_en")}
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Column4 Text Alt:</h3>
                          <Input
                            value={formData.column4_text_bn}
                            onChange={(e) => handleChange(e, "column4_text_bn")}
                            style={{ marginTop: ".5rem" }}
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Column4 Description English:</h3>
                          <Input.TextArea
                            rows={2}
                            value={formData.column4_description_en}
                            onChange={(e) =>
                              handleChange(e, "column4_description_en")
                            }
                            style={{ marginTop: ".5rem" }}
                            type="number"
                          />
                        </div>
                        <br />

                        <div className="content">
                          <h3>Column4 Description Bangla:</h3>
                          <Input.TextArea
                            rows={1}
                            value={formData.column4_description_bn}
                            onChange={(e) =>
                              handleChange(e, "column4_description_bn")
                            }
                            style={{ marginTop: ".5rem" }}
                            type="number"
                          />
                        </div>
                        <br />
                        <div className="content">
                          <h3>Bottom Menu:</h3>
                          <Select
                            showSearch
                            // mode="multiple"
                            placeholder="Select menu item"
                            style={{ width: "100%", marginTop: ".5rem" }}
                            value={
                              selectedItemsBottom
                                ? selectedItemsBottom
                                : items?.bottom_menu?.name
                            } // Set the selected items from state
                            onChange={handleSelectChangeBottom} // Set the event handler
                          >
                            {menuData?.map((item) => (
                              <>
                                <Option key={item.id} value={item?.id}>
                                  {item.name}
                                </Option>
                              </>
                            ))}
                          </Select>
                        </div>
                      </Col>
                      <Button
                        icon={<SyncOutlined />}
                        style={{
                          marginTop: "1rem",
                          marginLeft: "1rem",
                          backgroundColor: "var(--success)",
                          borderColor: "var(--success)",
                          color: "white",
                          borderRadius: "10px",
                          fontSize: "1.2em",
                          marginRight: "1em",
                          // paddingBottom: "1.8em",
                        }}
                        onClick={() => handleUpdate()}
                      >
                        Update
                      </Button>
                      <Button
                        style={{
                          marginTop: "1rem",
                          marginLeft: "1rem",
                          backgroundColor: "var(--themes)",
                          borderColor: "var(--themes)",
                          color: "white",
                          borderRadius: "10px",
                          fontSize: "1.2em",
                          // paddingBottom: "1.8em",
                        }}
                        onClick={() => toggleCollapse(true)}
                      >
                        <CloseCircleOutlined />
                        Cancel
                      </Button>
                    </Row>
                  </div>
                </div>
              </div>
            )}
          </>
        ))}
      </div>
    </>
  );
};
export default Footer;
