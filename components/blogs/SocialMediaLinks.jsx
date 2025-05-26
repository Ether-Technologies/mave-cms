// components/Blog/SocialMediaLinks.jsx

import React from "react";
import {
  FacebookOutlined,
  LinkedinOutlined,
  InstagramFilled,
} from "@ant-design/icons";

const SocialMediaLinks = () => {
  return (
    <div className="flex gap-4">
      <FacebookOutlined
        className="text-2xl text-yellow-600 cursor-pointer"
        onClick={() => window.open("https://facebook.com", "_blank")}
      />
      <LinkedinOutlined
        className="text-2xl text-yellow-700 cursor-pointer"
        onClick={() => window.open("https://linkedin.com", "_blank")}
      />
      <InstagramFilled
        className="text-2xl text-pink-600 cursor-pointer"
        onClick={() => window.open("https://instagram.com", "_blank")}
      />
    </div>
  );
};

export default SocialMediaLinks;
