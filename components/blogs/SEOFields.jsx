// components/Blog/SEOFields.jsx

import React from "react";
import { Input, Select, Form, Space, Tooltip, Progress } from "antd";
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../RichTextEditor";

const { Option } = Select;

const SEOFields = ({ seo, setSeo }) => {
  const calculateSeoScore = () => {
    let score = 0;
    let total = 0;

    if (seo.seoTitle) {
      total += 1;
      if (seo.seoTitle.length >= 30 && seo.seoTitle.length <= 60) {
        score += 1;
      }
    }

    if (seo.seoDescription) {
      total += 1;
      if (
        seo.seoDescription.length >= 120 &&
        seo.seoDescription.length <= 160
      ) {
        score += 1;
      }
    }

    if (seo.seoKeywords?.length > 0) {
      total += 1;
      if (seo.seoKeywords.length >= 3 && seo.seoKeywords.length <= 10) {
        score += 1;
      }
    }

    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const seoScore = calculateSeoScore();
  const getSeoScoreColor = (score) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-medium">SEO Score</h4>
          <span className="text-sm text-gray-500">
            {seoScore >= 80 ? (
              <CheckCircleOutlined className="text-green-500" />
            ) : (
              <WarningOutlined className="text-yellow-500" />
            )}
          </span>
        </div>
        <Progress
          percent={seoScore}
          status={getSeoScoreColor(seoScore)}
          showInfo={false}
        />
        <p className="text-sm text-gray-500 mt-2">
          {seoScore >= 80
            ? "Great! Your SEO is well optimized."
            : "Consider improving your SEO elements."}
        </p>
      </div>

      {/* Basic SEO Fields */}
      <Form.Item
        label={
          <Space>
            <span>SEO Title</span>
            <Tooltip title="The title that appears in search results (30-60 characters)">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        }
        validateStatus={
          seo.seoTitle?.length >= 30 && seo.seoTitle?.length <= 60
            ? "success"
            : "warning"
        }
        help={
          seo.seoTitle &&
          `${seo.seoTitle.length} characters (recommended: 30-60)`
        }
      >
        <Input
          placeholder="Enter SEO title"
          value={seo.seoTitle}
          onChange={(e) => setSeo({ ...seo, seoTitle: e.target.value })}
          maxLength={60}
          showCount
        />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <span>Meta Description</span>
            <Tooltip title="A brief description of your content (120-160 characters)">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        }
        validateStatus={
          seo.seoDescription?.length >= 120 && seo.seoDescription?.length <= 160
            ? "success"
            : "warning"
        }
        help={
          seo.seoDescription &&
          `${seo.seoDescription.length} characters (recommended: 120-160)`
        }
      >
        <RichTextEditor
          defaultValue={seo.seoDescription}
          onChange={(html) => setSeo({ ...seo, seoDescription: html })}
          editMode={true}
          maxLength={160}
        />
      </Form.Item>

      <Form.Item
        label={
          <Space>
            <span>Keywords</span>
            <Tooltip title="Add relevant keywords (3-10 recommended)">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        }
        validateStatus={
          seo.seoKeywords?.length >= 3 && seo.seoKeywords?.length <= 10
            ? "success"
            : "warning"
        }
        help={
          seo.seoKeywords &&
          `${seo.seoKeywords.length} keywords (recommended: 3-10)`
        }
      >
        <Select
          mode="tags"
          placeholder="Enter SEO keywords"
          value={seo.seoKeywords}
          onChange={(value) => setSeo({ ...seo, seoKeywords: value })}
          maxTagCount={10}
          showSearch
        >
          {/* Optionally, predefined keywords can be added here */}
        </Select>
      </Form.Item>

      {/* Social Media Preview */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium mb-4">Social Media Preview</h4>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h5 className="text-sm font-medium text-gray-500 mb-2">Facebook</h5>
            <div className="border border-gray-200 rounded p-2">
              <div className="w-16 h-16 bg-gray-200 rounded mb-2"></div>
              <h6 className="font-medium text-sm">{seo.seoTitle || "Title"}</h6>
              <div
                className="text-xs text-gray-500 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: seo.seoDescription || "Description",
                }}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h5 className="text-sm font-medium text-gray-500 mb-2">Twitter</h5>
            <div className="border border-gray-200 rounded p-2">
              <div className="w-16 h-16 bg-gray-200 rounded mb-2"></div>
              <h6 className="font-medium text-sm">{seo.seoTitle || "Title"}</h6>
              <div
                className="text-xs text-gray-500 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: seo.seoDescription || "Description",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOFields;
