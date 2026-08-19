import { Typography, Button } from "antd";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import changelog from "../../src/data/changelog.json";
import { BugOutlined, GiftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function PromoPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState();

  // Helper function to get the latest changelog entry
  const getLatestChangelogEntry = () => {
    const sortedChangelog = [...changelog].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return sortedChangelog[0];
  };

  useEffect(() => {
    const shown = sessionStorage.getItem("promoPopupShown");
    if (!shown) {
      setShowPopup(true);
      sessionStorage.setItem("promoPopupShown", "true");
    }
  }, []);

  useEffect(() => {
    // Fetch user data from local storage
    setUser(JSON.parse(localStorage.getItem("user")));

    // Debug changelog data
    const latestEntry = getLatestChangelogEntry();
  }, []);
  const handleClose = () => setShowPopup(false);
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Outer container with possible scrolling */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-md shadow-md overflow-auto flex flex-col md:flex-row">
        {/* Left Column */}
        <div className="relative flex-1 h-64 md:h-auto min-h-[300px]">
          {/* The mockup image container */}
          <div className="absolute inset-0">
            <div className="relative w-full flex items-center justify-center h-full pl-1">
              <Image
                src="/images/mockup.png"
                alt="Promotion"
                width={600}
                height={540}
                objectFit="cover"
                className="rounded-md border-2 border-gray-300 shadow-inner"
              />
            </div>
          </div>

          {/* Gift box crowned on top */}
          {/* <div className="absolute left-1/2 -top-10 -translate-x-1/2 z-[60]">
            <Image
              src="/images/Congratulations.png"
              alt="Gift Box"
              width={80}
              height={80}
              className="object-contain"
            />
          </div> */}
        </div>

        {/* Right Column */}
        <div className="relative flex-1 p-6 flex flex-col">
          <Button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 border-none shadow-none"
            aria-label="Close Promotion Popup"
          >
            &times;
          </Button>

          <Title level={3} className="mb-2">
            Welcome back, {user?.name || "Guest"}
          </Title>

          <Paragraph className="text-sm text-gray-500">
            Here's what we added while you were away:
          </Paragraph>

          {/* Example tags */}
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs">
              New
            </span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">
              Update
            </span>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs">
              BugFix
            </span>
          </div>

          {/* Changelog Content */}
          <div className="mt-4">
            <Title level={4} className="text-md font-semibold">
              Features
            </Title>
            {(() => {
              const latestEntry = getLatestChangelogEntry();
              const features = latestEntry?.changes?.Features;
              console.log("Debug - Latest entry:", latestEntry);
              console.log("Debug - Features array:", features);
              console.log("Debug - Features length:", features?.length);

              if (features && features.length > 0) {
                return features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <GiftOutlined className="text-violet-500" />
                    <Paragraph key={i} className="text-sm text-gray-500">
                      {feat}
                    </Paragraph>
                  </div>
                ));
              } else {
                return (
                  <Paragraph className="text-sm text-gray-500">
                    No new features in this update
                  </Paragraph>
                );
              }
            })()}

            <Title level={4} className="text-md font-semibold mt-4">
              Bug Fixes
            </Title>
            {(() => {
              const latestEntry = getLatestChangelogEntry();
              const bugFixes = latestEntry?.changes?.["Bug Fixes"];

              if (bugFixes && bugFixes.length > 0) {
                return bugFixes.map((fix, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <BugOutlined className="text-red-500" />
                    <Paragraph key={i} className="text-sm text-gray-500">
                      {fix}
                    </Paragraph>
                  </div>
                ));
              } else {
                return (
                  <Paragraph className="text-sm text-gray-500">
                    No bug fixes in this update
                  </Paragraph>
                );
              }
            })()}

          </div>
        </div>
      </div>
    </div>
  );
}
