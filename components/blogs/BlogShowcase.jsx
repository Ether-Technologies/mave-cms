// components/Blog/BlogShowcase.jsx

import React, { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import instance from "../../axios";
import BlogShowcaseHeader from "./BlogShowcaseHeader";
import BlogCard from "./BlogCard";
import TopPosts from "./TopPosts";
import SocialMediaLinks from "./SocialMediaLinks";
import router from "next/router";

const BlogShowcase = ({ blogs, setBlogs, fetchBlogs }) => {
  const handleDelete = async (id) => {
    try {
      const response = await instance.delete(`/pages/${id}`);
      if (response.status === 200) {
        message.success("Blog deleted successfully.");
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      message.error("Failed to delete blog.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Blog List */}
        <div className="flex-1 space-y-6">
          {blogs?.map((blog) => (
            <BlogCard key={blog.id} blog={blog} onDelete={handleDelete} />
          ))}
        </div>

        {/* Right Column: Top Posts and Social Media */}
        <div className="md:w-1/3 space-y-6">
          <TopPosts blogs={blogs} />
        </div>
      </div>
    </div>
  );
};

export default BlogShowcase;
