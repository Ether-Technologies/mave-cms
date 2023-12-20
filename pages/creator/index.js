import React, { useState, useEffect } from "react";
import {
  Layout,
  Switch,
  Select,
  Button,
  Collapse,
  Image,
  Input,
  message,
  Modal,
} from "antd";
import { useRouter } from "next/router";
import {
  MenuOutlined,
  PicCenterOutlined,
  SlidersOutlined,
  IdcardOutlined,
  FormOutlined,
  FontSizeOutlined,
  BoxPlotOutlined,
  SettingOutlined,
  ProfileOutlined,
  SwitcherOutlined,
  FileImageFilled,
  AlignLeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusSquareOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import Link from "next/link";
const { Sider, Content } = Layout;
const { Option } = Select;
import RichTextEditor from "../../components/RichTextEditor";
import instance from "../../axios";
import bodyParser from "../../utils/sectionperser";
import ComponentParse from "../../components/creator/ComponentParser";
import ScrollToButton from "../../components/ScrollToBottomButton";
const Creator = () => {
  const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;
  const [collapsed, setCollapsed] = useState(false);
  const [creatorMode, setCreatorMode] = useState(null);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [media, setMedia] = useState([]);
  const [menus, setMenus] = useState([]);
  const [navbars, setNavbars] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [cards, setCards] = useState([]);
  const [forms, setForms] = useState([]);
  const [footers, setFooters] = useState([]);
  const [pressReleases, setPressReleases] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const Option = Select.Option;
  const [pageData, setPageData] = useState();
  const [showPageData, setShowPageData] = useState([]);
  const [newSection, setNewSection] = useState();
  const [newSectionComponents, setNewSectionComponent] = useState([]);

  const [canvas, setCanvas] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedSectionId, setEditedSectionId] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  // New members
  const [selectedComponentType, setSelectedComponentType] = useState(null);
  const [existingData, setExistingData] = useState([]);
  const [selectedExistingData, setSelectedExistingData] = useState(null);
  const [fetchedComponent, setFetchedComponent] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [updateResponse, setUpdateResponse] = useState();

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    const localCreatormode = localStorage.getItem("creatorMode");
    localCreatormode ? setCreatorMode(localCreatormode) : setCreatorMode(false);
  }, []);

  const componentgallery = new Map([
    [
      "Title",
      {
        type: "Title",
        icon: FontSizeOutlined,
        iconpath: "/images/icons/Text.svg",
        slug: "title",
      },
    ],
    [
      "Paragraph",
      {
        type: "Paragraph",
        icon: AlignLeftOutlined,
        iconpath: "/images/icons/Paragraph.svg",
        slug: "paragraph",
      },
    ],
    [
      "Inner Section",
      {
        type: "Inner Section",
        icon: SettingOutlined,
        iconpath: "/images/icons/InnerSection.svg",
        slug: "inner_sections",
      },
    ],
    [
      "Media",
      {
        type: "media",
        icon: FileImageFilled,
        iconpath: "/images/icons/Image.svg",
        slug: "medias",
      },
    ],
    [
      "Menu",
      {
        type: "menu",
        icon: MenuOutlined,
        iconpath: "/images/icons/Menu.svg",
        slug: "menus",
      },
    ],
    [
      "Navbar",
      {
        type: "navbar",
        icon: PicCenterOutlined,
        iconpath: "/images/icons/Header.svg",
        slug: "navbars",
      },
    ],
    [
      "Slider",
      {
        type: "slider",
        icon: SlidersOutlined,
        iconpath: "/images/icons/Carousel.svg",
        slug: "sliders",
      },
    ],
    [
      "Card",
      {
        type: "card",
        icon: IdcardOutlined,
        iconpath: "/images/icons/Card.svg",
        slug: "cards",
      },
    ],
    [
      "Form",
      {
        type: "form",
        icon: FormOutlined,
        iconpath: "/images/icons/Form.svg",
        slug: "forms",
      },
    ],
    [
      "Footer",
      {
        type: "footer",
        icon: BoxPlotOutlined,
        iconpath: "/images/icons/Footer.svg",
        slug: "footers",
      },
    ],
    [
      "Press Release",
      {
        type: "press_release",
        icon: ProfileOutlined,
        iconpath: "/images/icons/NewsPress.svg",
        slug: "press_release",
      },
    ],
    [
      "Events",
      {
        type: "event",
        icon: SwitcherOutlined,
        iconpath: "/images/icons/Event.svg",
        slug: "events",
      },
    ],
  ]);

  const fetchComponents = async (data) => {
    try {
      setLoading(true);
      const responses = await instance.get(`/${data.toLowerCase()}`);
      if (responses?.status === 200) {
        setFetchedComponent(responses?.data);
      }
    } catch (error) {
      message.error("Error fetching components");
      console.log(error);
    }
    setLoading(false);
  };

  //   Fetching page data
  const pid = router.query.id;
  const handleFormChange = (fieldName, value, type) => {
    const filteredArray = fetchedComponent?.filter((item) =>
      value.includes(item.id)
    );
    const resultArray = filteredArray.map(
      ({
        id,
        media_files,
        description_bn,
        description_en,
        link_url,
        title_bn,
        title_en,
      }) => ({
        id,
        _mave: {
          description_bn,
          description_en,
          link_url,
          title_bn,
          title_en,
          media_files: media_files,
        },
        type,
      })
    );
    setNewSectionComponent([...resultArray]);
  };
  function generateRandomId(length) {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  }

  const sectionData = {
    _id: generateRandomId(16),
    type: "",
    _category: "root",
    data: newSectionComponents,
  };
  let postDataBody;
  if (!newSectionComponents.length) {
    postDataBody = showPageData;
  } else {
    postDataBody = [...showPageData, sectionData];
  }
  const postData = {
    slug: "home",
    type: "Page",
    favicon_id: 10,
    page_name_en: "Home",
    page_name_bn: "হোম",
    head: {
      meta_title: "Home Page",
      meta_description: "This is a home page of the MAVE CMS",
      meta_keywords: ["home", "Page", "CMS", "Builder"],
    },
    body: postDataBody,
  };

  const handleSubmit = async () => {
    try {
      const response = await instance.put(`/pages/${pid}`, postData);
      if (response?.status === 200) {
        setUpdateResponse(response.data);
      }
    } catch (error) {
      message.error(error.message);
      console.log("Error updating press release", error);
    }
  };
  const fetchPageData = async () => {
    try {
      setLoading(true);
      if (pid) {
        const pageDataResponse = await instance.get(`/pages/${pid}`);
        if (pageDataResponse.status === 200) {
          setPageData(pageDataResponse?.data);
        }
      }
    } catch (error) {
      message.error("Error fetching page data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, [pid]);
  const convertedSectionData = bodyParser(pageData);
  useEffect(() => {
    setShowPageData(convertedSectionData);
  }, [pageData]);
  // console.log("showPageData", showPageData);

  const handleCloseSectionModal = () => {
    const updatedSection = showPageData.pop();
    setCanvas(false);
    setShowPageData(showPageData);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await instance.put(`/pages/${pid}`, pageData);
      if (response.status === 200) {
        message.success("Page saved successfully");
      } else {
        message.error("Error saving page");
      }
      setLoading(false);
    } catch (error) {
      message.error("Error saving page");
      console.log(error);
      setLoading(false);
    }
  };

  const handleEditClick = (sectionId) => {
    setEditedSectionId(sectionId);
    setEditMode(!editMode);
  };

  const handleNavbarSelect = (selectedNavbarId) => {
    console.log("selectedNavbarId", selectedNavbarId);
  };
  const handleCardSelect = (selectedCardIds) => {
    const selectedCardDetails = selectedCardIds.map((id) => JSON.parse(id));
    console.log("selectedCardDetails", selectedCardDetails);
  };

  const handleMediaSelect = (selectedMediaId) => {
    console.log("selectedMediaId", selectedMediaId);
  };

  const handleMenuSelect = (selectedMenuId) => {
    console.log("selectedMenuId", selectedMenuId);
  };

  const handleTitleChange = (value) => {
    console.log("Title changed", value);
  };

  const handleDescriptionChange = (value) => {
    console.log("Description changed", value);
  };

  const handleSliderSelect = (selectedSliderId) => {
    console.log("selectedSliderId", selectedSliderId);
  };

  const handlePressReleaseSelect = (selectedPressReleaseId) => {
    console.log("selectedPressReleaseId", selectedPressReleaseId);
  };

  return (
    <>
      <div className="ViewContainer">
        <div className="ViewContentContainer">
          <div
            className="creator-canvas"
            style={{
              position: "relative",
            }}
          >
            <div>
              {showPageData?.map((section, index) => (
                <section
                  className=""
                  style={{
                    width: "1170px",
                    padding: "20px 30px",
                    border: "1px solid var(--themes)",
                  }}
                  key={section?._id}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px 30px",
                      borderRadius: 10,
                      color: "white",
                      background: "var(--theme)",
                      marginBottom: 20,
                    }}
                  >
                    <h1>Section {index + 1}</h1>
                    <Button
                      style={{
                        margin: "10px",
                        backgroundColor: "var(--themes",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "1.2rem",
                        padding: "0.6rem 1rem",
                        height: "auto",
                      }}
                      onClick={() => handleEditClick(section?._id)}
                    >
                      Edit Mode
                    </Button>
                  </div>
                  {console.log("Section ID: ", section?._id)}

                  <ComponentParse
                    section={section?.data}
                    // editMode={editMode}
                    editMode={editMode && editedSectionId == section?._id}
                    onNavbarSelect={handleNavbarSelect}
                    onCardSelect={handleCardSelect}
                    onMediaSelect={handleMediaSelect}
                    onMenuSelect={handleMenuSelect}
                    onTitleChange={handleTitleChange}
                    onDescriptionChange={handleDescriptionChange}
                    onSliderSelect={handleSliderSelect}
                    onPressReleaseSelect={handleSliderSelect}
                  />
                  {editMode && (
                    <center>
                      <Button
                        style={{
                          margin: "10px",
                          backgroundColor: "var(--theme",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          fontSize: "1.2rem",
                          padding: "0.6rem 1rem",
                          marginBottom: "3rem",
                          height: "auto",
                        }}
                        onClick={() => {
                          setEditMode(false);
                          setEditedSectionId(null);
                          console.log("sectionData", sectionData);
                        }}
                      >
                        Save
                      </Button>
                    </center>
                  )}
                </section>
              ))}
            </div>
            {/* {console.log("newSectionComponents", sectionData)} */}
            <div>
              {newSectionComponents.length > 0 && (
                <section
                  className=""
                  style={{
                    width: "1170px",
                    padding: "20px 30px",
                    border: "1px solid var(--black)",
                  }}
                >
                  <h1
                    style={{
                      color: "white",
                      borderRadius: 10,
                      border: "1px solid var(--gray)",
                      padding: "20px 30px",
                      background: "#0d0d0d",
                      marginBottom: 20,
                    }}
                  >
                    Section {showPageData.length + 1}
                  </h1>
                  <Button
                    style={{
                      margin: "10px",
                      backgroundColor: "var(--themes",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "1.2rem",
                      padding: "0.6rem 1rem",
                      marginBottom: "3rem",
                      height: "auto",
                    }}
                    onClick={() => setEditMode(!editMode)}
                  >
                    Edit Mode
                  </Button>

                  <ComponentParse section={sectionData?.data} />
                </section>
              )}
            </div>

            <center>
              {canvas && (
                <div
                  className="flexed-center"
                  style={{
                    width: "50vw",
                    height: "300px",
                    border: "2px dashed var(--black)",
                    borderRadius: "10px",
                  }}
                >
                  {selectionMode ? (
                    <div>
                      {fetchedComponent && selectedComponentType === "card" && (
                        <div style={{ width: "40vw" }}>
                          <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ width: "100%" }}
                            placeholder="Select Tabs"
                            onChange={(value) =>
                              handleFormChange(
                                "card_ids",
                                value,
                                selectedComponentType
                              )
                            }
                          >
                            {fetchedComponent?.map((card, index) => (
                              <Select.Option key={index} value={card.id}>
                                {card.title_en}
                              </Select.Option>
                            ))}
                          </Select>
                          <Button onClick={() => setSelectionMode(false)}>
                            Ok
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Button
                        style={{
                          margin: "10px",
                          backgroundColor: "var(--themes",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          fontSize: "1.2rem",
                          padding: "0.6rem 1rem",
                          marginBottom: "3rem",
                          height: "auto",
                        }}
                        icon={<PlusSquareOutlined />}
                        onClick={() => handleSubmit()}
                      >
                        Submit
                      </Button>
                      <Button
                        style={{
                          margin: "10px",
                          backgroundColor: "var(--themes",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          fontSize: "1.2rem",
                          padding: "0.6rem 1rem",
                          marginBottom: "3rem",
                          height: "auto",
                        }}
                        icon={<PlusSquareOutlined />}
                        onClick={() => setModalVisible(true)}
                      >
                        Add Components
                      </Button>
                      <Button
                        danger
                        style={{
                          margin: "10px",
                          border: "none",
                          borderRadius: "5px",
                          fontSize: "1.2rem",
                          padding: "0.6rem 1rem",
                          marginBottom: "3rem",
                          height: "auto",
                          border: "1px solid red",
                        }}
                        icon={<CloseCircleFilled />}
                        onClick={() => {
                          handleCloseSectionModal();
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {!selectionMode && (
                <Button
                  style={{
                    margin: "10px",
                    backgroundColor: "var(--themes",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "1.6rem",
                    padding: "1rem 2rem",
                    marginBottom: "2rem",
                    height: "auto",
                    position: "absolute",
                    right: 0,
                  }}
                  onClick={() => {
                    setCanvas(true);
                  }}
                >
                  Add Sections
                </Button>
              )}
            </center>

            <Modal
              width={1000}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              open={modalVisible}
              onCancel={() => {
                setModalVisible(false);
              }}
              footer={
                <>
                  <Button
                    onClick={() => {
                      setModalVisible(false);
                      setSelectedComponentType(null);
                      setSelectedExistingData(null);
                    }}
                  >
                    Close
                  </Button>
                </>
              }
            >
              <div
                className="flexed-center"
                style={{
                  width: "55vw",
                  height: "auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gridGap: "1.5rem",
                  padding: "2rem",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Array.from(componentgallery.entries()).map(
                  ([componentKey, component], index) => (
                    <div
                      key={index}
                      className="flexed-center"
                      onClick={() => {
                        setSelectedComponentType(component.type);
                      }}
                    >
                      <Button
                        style={{
                          width: "100%",
                          height: "auto",
                          border: "none",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          fetchComponents(component.slug);
                          setSelectedComponentType(component.type);
                          setModalVisible(false);
                          setSelectionMode(true);
                        }}
                      >
                        <img
                          src={component.iconpath}
                          style={{ width: "7rem", height: "7rem" }}
                        />
                      </Button>
                    </div>
                  )
                )}
              </div>
            </Modal>

            <Modal>
              <Select
                style={{ width: "100%" }}
                placeholder="Select a card"
                onChange={(value) => {
                  setSelectedExistingData(
                    cards.find((card) => card._id === value)
                  );
                }}
              >
                {cards.map((card) => (
                  <Option value={card._id}>{card.title}</Option>
                ))}
              </Select>
            </Modal>
          </div>
          <ScrollToButton />
        </div>
      </div>
    </>
  );
};
export default Creator;
