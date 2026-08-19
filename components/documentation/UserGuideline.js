import React, { useState } from "react";
import { Typography, Tabs, Steps, Button } from "antd";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

const UserGuideline = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTabKey, setCurrentTabKey] = useState("1");

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Login",
      content: (
        <div>
          <Title level={3}>Login</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Navigate to the Login Page"
              description="Click the 'Login' button located on the left sidebar."
            />
            <Step
              title="Enter Credentials"
              description="A popup will appear. Enter your email address and password provided by the admin in the respective input fields."
            />
            <Step
              title="Submit"
              description="Click the 'Login' button to log in."
            />
            <Step
              title="New User Registration"
              description="If you are not a registered user, please contact your admin for access."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Profile Management",
      content: (
        <div>
          <Title level={3}>Profile Management</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Profile"
              description="Click the 'Profile' button in the left sidebar."
            />
            <Step
              title="View User Information"
              description="Your user information will be displayed in a table format."
            />
            <Step
              title="Admin Access"
              description="If you are an admin, you will have the ability to view and modify the details of other registered users within the organization."
            />
            <Step
              title="Create New Users"
              description="Admins can create new user accounts as needed."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Dashboard",
      content: (
        <div>
          <Title level={3}>Dashboard</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Dashboard"
              description="Open the home page to view live counts for pages, media, navbars, sliders, and other content."
            />
            <Step
              title="Open content"
              description="Click a stat card to go to that section, or use recent pages and activity to jump into an item."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Logout",
      content: (
        <div>
          <Title level={3}>Logout</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Logout Options"
              description="You can log out either by clicking the 'Logout' button on the top right corner avatar or from the left navigation bar under the 'MAVE admin' dropdown menu."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Gallery",
      content: (
        <div>
          <Title level={3}>Gallery</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Gallery"
              description="Click 'Components > Gallery' from the left navigation bar."
            />
            <Step
              title="View Media Files"
              description="The gallery contains three tabs: Images, Videos, and Docs."
            />
            <Step
              title="Media Actions"
              description="Hover over a media file to see options for viewing information, updating, deleting, copying public link, viewing, or downloading."
            />
            <Step
              title="Sync and Filter"
              description="Use the 'Sync' and 'Filter' buttons at the top right to refresh data and apply filters."
            />
            <Step
              title="Upload Media"
              description="Click the cloud icon to open a draggable upload field. Select or drag media files to upload."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Menu Items",
      content: (
        <div>
          <Title level={3}>Menu Items</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Menu Items"
              description="Click 'Menu Items' from the left navigation bar."
            />
            <Step
              title="Create New Menu Item"
              description="Click 'Add New Menu Item' and fill in the required information. Select a parent menu if necessary or choose 'No Parent' for an independent item."
            />
            <Step
              title="Manage Menu Items"
              description="Use the 'Edit' button to update information and the 'Delete' button to remove items."
            />
            <Step
              title="Sort Menu Items"
              description="Use the 'Sort By' button to arrange items."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Menus",
      content: (
        <div>
          <Title level={3}>Menus</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Menus"
              description="Click 'Menus' from the left navigation bar."
            />
            <Step
              title="Create New Menu"
              description="Click 'Add New Menu,' select existing menu items, and click 'Create.'"
            />
            <Step
              title="Update Menus"
              description="Use the 'Edit' button to modify menu details and the 'Delete' button to remove menus."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Navbars",
      content: (
        <div>
          <Title level={3}>Navbars</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Navbars"
              description="Click 'Components > Navbars' from the left navigation bar."
            />
            <Step
              title="Create New Navbar"
              description="Click 'Add New Navbar,' fill in the required fields, select a logo, and choose a menu to assign."
            />
            <Step
              title="Manage Navbars"
              description="Use the 'Edit' button to update information and the 'Delete' button to remove navbars."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Cards",
      content: (
        <div>
          <Title level={3}>Cards</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Cards"
              description="Click 'Components > Cards' from the left navigation bar."
            />
            <Step
              title="Create New Card"
              description="Click 'Add Card,' fill in the required fields, select a page and media, and click 'Create Card.'"
            />
            <Step
              title="Manage Cards"
              description="Click the eye icon to view details, the edit button to update information, and the delete button to remove cards."
            />
            <Step
              title="Search and Filter"
              description="Use the top bar functionalities to search, filter, sort, and change the view type."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Sliders",
      content: (
        <div>
          <Title level={3}>Sliders</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Sliders"
              description="Click 'Components > Sliders' from the left navigation bar."
            />
            <Step
              title="Create New Slider"
              description="Click 'Add Slider,' fill in the required fields, select media/cards, and click 'Create.'"
            />
            <Step
              title="Manage Sliders"
              description="Use the 'Edit' button to update information and the 'Delete' button to remove sliders."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Press Release",
      content: (
        <div>
          <Title level={3}>Press Release</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Press Releases"
              description="Click 'Components > Press Release' from the left navigation bar."
            />
            <Step
              title="Create New Press Release"
              description="Click 'Add Press Release,' fill in the required fields, and click 'Create.'"
            />
            <Step
              title="Manage Press Releases"
              description="Use the 'Edit' button to update information and the 'Delete' button to remove press releases."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Events",
      content: (
        <div>
          <Title level={3}>Events</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Events"
              description="Click 'Components > Events' from the left navigation bar."
            />
            <Step
              title="Create New Event"
              description="Click 'Add Event,' fill in the required fields, select media items, and click 'Create.'"
            />
            <Step
              title="Manage Events"
              description="Use the 'Edit' button to update information and the 'Delete' button to remove events."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Forms",
      content: (
        <div>
          <Title level={3}>Forms</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Forms"
              description="Click 'Components > Forms' from the left navigation bar."
            />
            <Step
              title="Create New Form"
              description="(Upcoming updates will include new form creation functionality.)"
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Footers",
      content: (
        <div>
          <Title level={3}>Footers</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Footers"
              description="Click 'Components > Footers' from the left navigation bar."
            />
            <Step
              title="Create New Footer"
              description="Click 'Add Footer,' fill in the required fields, and click 'Create.'"
            />
            <Step
              title="Manage Footers"
              description="Use the 'Edit' button to update information and the 'Delete' button to remove footers."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Form Responses",
      content: (
        <div>
          <Title level={3}>Form Responses</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Form Responses"
              description="Click 'Form Responses' from the left navigation bar."
            />
            <Step
              title="Manage Form Responses"
              description="Change the status of messages, export data, and apply filters using the provided functionalities."
            />
          </Steps>
        </div>
      ),
    },
    {
      title: "Page Builder",
      content: (
        <div>
          <Title level={3}>Page Builder</Title>
          <Steps direction="vertical" current={currentStep}>
            <Step
              title="Access Page Builder"
              description="Click 'Creator Studio > Pages' from the left navigation bar."
            />
            <Step
              title="Create New Page"
              description="Click 'Create New,' enter the page name in your desired languages, and click 'Create Page.'"
            />
            <Step
              title="Add Sections"
              description="Click 'Add Section,' enter the section title, and click 'Create Section.'"
            />
            <Step
              title="Add Components"
              description="Click 'Add Components,' select the desired component, and provide the necessary information."
            />
            <Step
              title="Edit Sections"
              description="Click 'Edit Mode' to update sections or add additional components."
            />
            <Step
              title="Refresh"
              description="If needed, refresh your browser to reset any unsaved changes."
            />
          </Steps>
        </div>
      ),
    },
  ];

  // Add this function to handle moving to the next tab
  const moveToNextTab = () => {
    const nextTabIndex = parseInt(currentTabKey, 10) + 1;
    if (nextTabIndex <= steps.length) {
      setCurrentTabKey(nextTabIndex.toString());
      setCurrentStep(0); // Reset to the first step of the next tab
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <center>
        <Title level={2}>User Guideline</Title>
      </center>
      <Tabs defaultActiveKey="1" centered type="card" tabPosition="left">
        {steps?.map((step, index) => (
          <TabPane tab={step.title} key={index + 1}>
            {step.content}
            <div className="steps-action" style={{ marginTop: "24px" }}>
              {currentStep > 0 && (
                <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button type="primary" onClick={() => next()}>
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    if (parseInt(currentTabKey, 10) < steps.length) {
                      moveToNextTab();
                    } else {
                      alert("All steps completed!");
                    }
                  }}
                >
                  Done
                </Button>
              )}
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default UserGuideline;
