// pages/blogs/[blogid].js

import { useEffect, useState } from "react";
import instance from "../../axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { Breadcrumb, Button, Spin, Popconfirm, message } from "antd";
import {
  BookOutlined,
  CommentOutlined,
  EditOutlined,
  EyeFilled,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../../components/RichTextEditor";
import { useSpeech } from "react-text-to-speech";
import BlogEditor from "../../components/blogs/BlogEditor";

export default function BlogPost() {
  const router = useRouter();
  const { blogid } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [blogData, setBlogData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchBlogData = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get(`/pages/${blogid}`);
      if (response.status === 200) {
        setBlogData(response.data);
      }
    } catch (error) {
      console.log("Error fetching blog data: ", error);
      message.error("Failed to fetch blog data.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (blogid) {
      fetchBlogData();
    }
  }, [blogid]);

  console.log("Blog Data: ", blogData);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await instance.put(`/pages/${blogid}`, blogData);
      if (response.status === 200) {
        console.log("Blog updated successfully");
        message.success("Blog updated successfully.");
        setEditMode(false);
      }
    } catch (error) {
      console.log("Error updating blog: ", error);
      message.error("Failed to update blog.");
    }
    setIsLoading(false);
  };

  const { Text, speechStatus, isInQueue, start, pause, stop } = useSpeech({
    text: blogData?.body?.map((blog) => blog?.data[0]?.value).join(" "),
  });

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      pause();
    } else {
      start();
    }
  };

  return (
    <div className="mavecontainer max-w-5xl mx-auto p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Breadcrumb Navigation */}
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item onClick={() => router.push("/")}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item onClick={() => router.push("/blogs")}>
              Blogs
            </Breadcrumb.Item>
            <Breadcrumb.Item>{blogData.page_name_en}</Breadcrumb.Item>
          </Breadcrumb>

          {/* Blog Meta Information */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-bold text-theme mb-2">
              {blogData.page_name_en}
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              {blogData.head?.seoDescription}
            </p>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="/images/profile_avatar.png" // Ensure this path exists
                alt="Author Avatar"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">Atiq Israk</h3>
                <div className="flex items-center gap-2 text-gray-500">
                  <span>11 min read</span>
                  <span>|</span>
                  <span>{new Date(blogData.created_at).toDateString()}</span>
                </div>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex justify-between items-center w-full border-t border-b border-gray-300 py-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-gray-500">
                  <EyeFilled />
                  <span>1000 views</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <CommentOutlined />
                  <span>100 comments</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <BookOutlined className="text-2xl cursor-pointer" />
                <Button
                  icon={
                    isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />
                  }
                  onClick={handlePlayPause}
                  className="mavebutton"
                />
                <ShareAltOutlined className="text-2xl cursor-pointer" />
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(!editMode)}
                  className="mavebutton"
                />
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {blogData.medias_mave?.map((media) => (
              <Image
                key={media.id}
                src={`${MEDIA_URL}/${media.file_path}`}
                alt="Blog Thumbnail"
                width={800}
                height={400}
                className="rounded-lg mb-4"
              />
            ))}

            {/* Blog Body */}
            <div className="prose max-w-none">
              {blogData.body?.map((blog, index) => (
                <div key={index}>
                  {editMode ? (
                    <div className="flex flex-col gap-4">
                      <RichTextEditor
                        editMode={true}
                        editorHtml={blog?.data[0]?.value}
                        onChange={(value) =>
                          setBlogData((prev) => {
                            const updatedBody = [...prev.body];
                            updatedBody[index].data[0].value = value;
                            return { ...prev, body: updatedBody };
                          })
                        }
                        className="h-96 p-4 bg-gray-100 rounded-lg border border-gray-300"
                      />
                      <div className="flex justify-end gap-4">
                        <Button
                          onClick={handleSave}
                          className="mavebutton"
                          loading={isLoading}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditMode(false)}
                          className="mavecancelbutton"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: blog?.data[0]?.value }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Speech Component */}
          <div className="mt-6">
            <div className="flex justify-center gap-4">
              <Button
                icon={
                  isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />
                }
                onClick={handlePlayPause}
                className="mavebutton"
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Popconfirm
                title="Are you sure you want to stop the audio?"
                onConfirm={() => {
                  stop();
                  setIsPlaying(false);
                }}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button
                  icon={<PauseCircleOutlined />}
                  className="mavecancelbutton"
                  disabled={!isPlaying}
                >
                  Stop
                </Button>
              </Popconfirm>
            </div>
            {/* <div className="mt-4">
              <Text />
            </div> */}
          </div>
        </>
      )}
    </div>
  );
}
