// components/Blog/BlogCard.jsx

import React from "react";
import { Button, Popconfirm, Tooltip, Tag, Space } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  LikeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import router from "next/router";

const BlogCard = ({ blog, onDelete }) => {
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Blog Thumbnail */}
        {blog?.thumbnail && (
          <div className="flex-shrink-0 w-full md:w-48">
            <Image
              src={blog.thumbnail}
              width={192}
              height={128}
              alt="Blog Thumbnail"
              className="rounded-md object-cover w-full h-32 md:h-full"
            />
          </div>
        )}
        {/* Blog Details */}
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag color="yellow">{blog.additional?.category}</Tag>
              {blog.additional?.tags?.map((tag, index) => (
                <Tag key={index} color="geekblue">
                  {tag}
                </Tag>
              ))}
            </div>
            <h3
              className="text-xl font-semibold text-theme cursor-pointer hover:underline mb-2"
              onClick={() => router.push(`/blogs/${blog.id}`)}
            >
              {blog.page_name_en}
            </h3>
            <p className="text-gray-600 line-clamp-2">
              {blog.head?.seoDescription}
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-2">
            <Space size="small">
              <span className="text-sm text-gray-500">
                <ClockCircleOutlined className="mr-1" />
                {calculateReadingTime(blog.body?.[0]?.data?.[0]?.value)} min
                read
              </span>
              <span className="text-sm text-gray-500">
                <LikeOutlined className="mr-1" />
                {blog.stats?.likes || 0}
              </span>
              <span className="text-sm text-gray-500">
                <CommentOutlined className="mr-1" />
                {blog.stats?.comments || 0}
              </span>
            </Space>
            <div className="flex items-center gap-2">
              <Tooltip title="View Blog">
                <Button
                  icon={<EyeOutlined />}
                  className="mavebutton"
                  onClick={() => router.push(`/blogs/${blog.id}`)}
                />
              </Tooltip>
              <Popconfirm
                title="Are you sure you want to delete this blog?"
                onConfirm={() => onDelete(blog.id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Delete Blog">
                  <Button
                    icon={<DeleteOutlined />}
                    className="mavecancelbutton"
                  />
                </Tooltip>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
