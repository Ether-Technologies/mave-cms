// components/Blog/BlogCreator.jsx

import React, { useState, useEffect } from "react";
import { Breadcrumb, Spin, message, Button, Popconfirm } from "antd";
import BlogHeader from "./BlogHeader";
import ActionButtons from "./ActionButtons";
import BlogFormFields from "./BlogFormFields";
import FeaturedImageSelector from "./FeaturedImageSelector";
import router from "next/router";
import instance from "../../axios";
import { RobotOutlined } from "@ant-design/icons";
import BlogEditor from "./BlogEditor";

const BlogCreator = ({ creatorMode, setCreatorMode, fetchBlogs }) => {
  const blog_categories = [
    { id: 1, name: "News", value: "news" },
    { id: 2, name: "Tech", value: "tech" },
    { id: 3, name: "Health", value: "health" },
    { id: 4, name: "Sports", value: "sports" },
    { id: 5, name: "Entertainment", value: "entertainment" },
    { id: 6, name: "Science", value: "science" },
  ];

  const blog_tags = [
    { id: 1, name: "News", value: "news", related: [3, 4, 6], color: "red" },
    {
      id: 2,
      name: "Tech",
      value: "tech",
      related: [1, 2, 3, 4, 5, 6],
      color: "yellow",
    },
    {
      id: 3,
      name: "Health",
      value: "health",
      related: [1, 2, 3, 4, 5, 6],
      color: "green",
    },
    {
      id: 4,
      name: "Sports",
      value: "sports",
      related: [1, 2, 3, 4, 5, 6],
      color: "yellow",
    },
    {
      id: 5,
      name: "Entertainment",
      value: "entertainment",
      related: [1, 2, 3, 4, 5, 6],
      color: "purple",
    },
    {
      id: 6,
      name: "Science",
      value: "science",
      related: [1, 2, 3, 4, 5, 6],
      color: "orange",
    },
  ];

  const [loading, setLoading] = useState(true);
  const [seoEnabled, setSeoEnabled] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null); // Featured image ID
  const [mediaAssets, setMediaAssets] = useState(null);
  const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

  const [meta, setMeta] = useState({
    title_en: "",
    title_bn: "",
    category: "",
    tags: [],
  });

  const [seo, setSeo] = useState({
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const [content, setContent] = useState("");

  const fetchMediaAssets = async () => {
    try {
      const response = await instance.get("/media");
      if (response.status === 200) {
        setMediaAssets(response.data);
      } else {
        console.error("Error fetching media assets: ", response.data);
      }
    } catch (error) {
      console.error("Error fetching media assets: ", error);
    }
  };

  useEffect(() => {
    fetchMediaAssets();
    setLoading(false);
  }, []);

  const { title_en, title_bn, category, tags } = meta;
  const { seoTitle, seoDescription, seoKeywords } = seo;

  const generateId = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const postBlog = async () => {
    setLoading(true);
    try {
      const response = await instance.post("/pages", {
        page_name_en: title_en,
        page_name_bn: title_bn,
        type: "Blog",
        slug: slugify(title_en),
        head: {
          seoTitle: seoTitle,
          seoDescription: seoDescription,
          seoKeywords: seoKeywords,
        },
        additional: {
          category: category,
          tags: tags,
        },
        body: [
          {
            _id: generateId(18),
            type: "blog-content",
            _category: "root",
            data: [
              {
                type: "description",
                value: content,
              },
              {
                type: "media",
                id: featuredImage,
              },
            ],
          },
        ],
      });
      if (response.status === 201) {
        console.log("Blog created successfully: ", response.data);
        fetchBlogs();
        router.push("/blogs");
        message.success("Blog created successfully!");
      }
    } catch (error) {
      console.log("Error creating blog: ", error);
      message.error("Failed to create blog. Please try again.");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <BlogHeader />

      {/* Breadcrumb */}
      <Breadcrumb className="mb-4 px-6">
        <Breadcrumb.Item onClick={() => router.push("/")}>Home</Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => router.push("/blogs")}>
          Blogs
        </Breadcrumb.Item>
        <Breadcrumb.Item>Create Blog</Breadcrumb.Item>
      </Breadcrumb>
      {/* Blog Creation Form */}
      <div className="flex flex-col space-y-6 px-6">
        {/* Featured Image Selector */}
        <FeaturedImageSelector
          featuredImage={featuredImage}
          setFeaturedImage={setFeaturedImage}
          mediaAssets={mediaAssets}
        />

        {/* Blog Form Fields */}
        <BlogFormFields
          meta={meta}
          setMeta={setMeta}
          seo={seo}
          setSeo={setSeo}
          seoEnabled={seoEnabled}
          setSeoEnabled={setSeoEnabled}
          blog_categories={blog_categories}
          blog_tags={blog_tags}
        />

        {/* Blog Editor */}
        <BlogEditor
          content={content}
          setContent={setContent}
          onContentChange={(newContent) => setContent(newContent)}
        />

        {/* Action Buttons */}
        <ActionButtons
          onCreate={postBlog}
          onCancel={() => {
            setCreatorMode(!creatorMode);
            router.push("/blogs");
          }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default BlogCreator;
