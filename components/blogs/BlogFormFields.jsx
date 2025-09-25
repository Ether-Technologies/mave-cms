// components/Blog/BlogFormFields.jsx

import React, { useState } from "react";
import { Input, Select, Switch, Card, Tabs, Form, Space, Tooltip } from "antd";
import {
  InfoCircleOutlined,
  GlobalOutlined,
  TagOutlined,
} from "@ant-design/icons";
import SEOFields from "./SEOFields";
import RichTextEditor from "../RichTextEditor";

const { Option } = Select;
const { TabPane } = Tabs;

const BlogFormFields = ({
  meta,
  setMeta,
  seo,
  setSeo,
  seoEnabled,
  setSeoEnabled,
  blog_categories,
  blog_tags,
}) => {
  const { title_en, title_bn, category, tags } = meta;
  const [activeTab, setActiveTab] = useState("basic");

  const handleMetaChange = (field, value) => {
    setMeta({ ...meta, [field]: value });
  };

  const handleSeoChange = (field, value) => {
    setSeo({ ...seo, [field]: value });
  };

  return (
    <Card className="w-full">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <GlobalOutlined />
              Basic Info
            </span>
          }
          key="basic"
        >
          <div className="flex flex-col space-y-6">
            {/* Blog Titles */}
            <Form.Item
              label="Blog Title (English)"
              required
              tooltip="The main title of your blog post in English"
            >
              <Input
                placeholder="Enter blog title"
                className="text-lg font-medium"
                value={title_en}
                onChange={(e) => handleMetaChange("title_en", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Blog Title (Bangla)"
              tooltip="The title of your blog post in Bangla"
            >
              <Input
                placeholder="Enter blog title in Bangla"
                className="text-lg font-medium"
                value={title_bn}
                onChange={(e) => handleMetaChange("title_bn", e.target.value)}
              />
            </Form.Item>

            {/* Category Selection */}
            <Form.Item
              label="Category"
              required
              tooltip="Select the main category for your blog post"
            >
              <Select
                placeholder="Select blog category"
                className="text-lg font-medium"
                value={category}
                onChange={(value) => handleMetaChange("category", value)}
                showSearch
              >
                {blog_categories.map((cat) => (
                  <Option key={cat.id} value={cat.value}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Tags Selection */}
            <Form.Item
              label="Tags"
              tooltip="Add relevant tags to help readers find your content"
            >
              <Select
                mode="tags"
                placeholder="Select blog tags"
                className="text-lg font-medium"
                value={tags}
                onChange={(value) => handleMetaChange("tags", value)}
                showSearch
              >
                {blog_tags.map((tag) => (
                  <Option key={tag.id} value={tag.value}>
                    {tag.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </TabPane>

        <TabPane
          tab={
            <span>
              <TagOutlined />
              SEO Settings
            </span>
          }
          key="seo"
        >
          <div className="flex flex-col space-y-6">
            {/* SEO Toggle */}
            <Form.Item>
              <div className="flex items-center">
                <Switch
                  checkedChildren="SEO Enabled"
                  unCheckedChildren="SEO Disabled"
                  checked={seoEnabled}
                  onChange={(checked) => setSeoEnabled(checked)}
                  className="mr-4"
                />
                <span className="text-lg font-medium">Enable SEO</span>
              </div>
            </Form.Item>

            {/* SEO Fields */}
            {seoEnabled && (
              <>
                <SEOFields seo={seo} setSeo={setSeo} />

                {/* Advanced SEO Settings */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-4">
                    Advanced SEO Settings
                  </h4>
                  <Form.Item
                    label="Canonical URL"
                    tooltip="The preferred URL for this content if it exists in multiple places"
                  >
                    <Input
                      placeholder="Enter canonical URL"
                      value={seo.canonicalUrl}
                      onChange={(e) =>
                        handleSeoChange("canonicalUrl", e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Meta Robots"
                    tooltip="Control how search engines index and follow links on this page"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select meta robots directives"
                      value={seo.metaRobots}
                      onChange={(value) => handleSeoChange("metaRobots", value)}
                    >
                      <Option value="index">index</Option>
                      <Option value="noindex">noindex</Option>
                      <Option value="follow">follow</Option>
                      <Option value="nofollow">nofollow</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Structured Data"
                    tooltip="Add JSON-LD structured data for rich results"
                  >
                    <RichTextEditor
                      defaultValue={seo.structuredData}
                      onChange={(html) =>
                        handleSeoChange("structuredData", html)
                      }
                      editMode={true}
                      maxLength={2000}
                    />
                  </Form.Item>
                </div>
              </>
            )}
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default BlogFormFields;
