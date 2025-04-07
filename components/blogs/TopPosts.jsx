// components/Blog/TopPosts.jsx

import React, { useState, useEffect } from "react";
import { Input, Typography, Select, Card, Space, Tag } from "antd";
import {
  SearchOutlined,
  FireOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import router from "next/router";
import SocialMediaLinks from "./SocialMediaLinks";

const { Title } = Typography;
const { Option } = Select;

const TopPosts = ({ blogs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("views");
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    let result = [...blogs];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (blog) =>
          blog.page_name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.head?.seoDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "views":
          return (b.stats?.views || 0) - (a.stats?.views || 0);
        case "likes":
          return (b.stats?.likes || 0) - (a.stats?.likes || 0);
        case "comments":
          return (b.stats?.comments || 0) - (a.stats?.comments || 0);
        case "recent":
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

    setFilteredBlogs(result.slice(0, 5)); // Show top 5 posts
  }, [blogs, searchTerm, sortBy]);

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <Card className="border border-gray-300 rounded-lg">
      <div className="flex flex-col gap-4">
        {/* Search and Sort Controls */}
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Search for blogs"
            className="w-full"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={sortBy} onChange={setSortBy} className="w-full">
            <Option value="views">Most Viewed</Option>
            <Option value="likes">Most Liked</Option>
            <Option value="comments">Most Commented</Option>
            <Option value="recent">Most Recent</Option>
          </Select>
        </div>

        {/* Top Posts List */}
        <div className="space-y-4">
          <Title level={4} className="flex items-center gap-2">
            <FireOutlined className="text-orange-500" />
            Top Posts
          </Title>
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => router.push(`/blogs/${blog.id}`)}
            >
              <h4 className="text-theme font-medium mb-1 line-clamp-1">
                {blog.page_name_en}
              </h4>
              <Space size="small" className="text-xs text-gray-500">
                <span>
                  <ClockCircleOutlined className="mr-1" />
                  {calculateReadingTime(blog.body?.[0]?.data?.[0]?.value)} min
                  read
                </span>
                <span>
                  <EyeOutlined className="mr-1" />
                  {blog.stats?.views || 0} views
                </span>
              </Space>
              {blog.additional?.category && (
                <Tag color="blue" className="mt-2">
                  {blog.additional.category}
                </Tag>
              )}
            </div>
          ))}
        </div>

        {/* Social Media Links */}
        <div className="mt-6">
          <Title level={4}>Follow us on social media</Title>
          <SocialMediaLinks />
        </div>
      </div>
    </Card>
  );
};

export default TopPosts;
