// components/formbuilder/MaveFormsList.jsx
import React, { useState, useEffect, useContext } from "react";
import { Drawer, Popconfirm, Input, Spin, Button, Badge } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EditOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import instance from "../../axios";
import MaveFormElements from "./MaveFormElements";
import { FormBuilderContext } from "../../src/context/FormBuilderContext";
import { useGlobalRefresh } from "../../src/context/MenuRefreshContext";

const MaveFormsList = ({ onSelectForm, selectedFormId, onFormCountChange }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changeFormsView, setChangeFormsView] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { reset } = useContext(FormBuilderContext);

  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  useGlobalRefresh(fetchForms);

  useEffect(() => {
    if (selectedFormId) {
      setDrawerVisible(true);
    } else {
      setDrawerVisible(false);
    }
  }, [selectedFormId]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await instance.get("/form_builder");
      if (response.status === 200) {
        const list = response.data ?? [];
        setForms(list);
        onFormCountChange?.(list.length);
      } else {
        setError("Failed to fetch forms");
      }
    } catch (err) {
      setError("An error occurred while fetching forms");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      await instance.delete(`/form_builder/${formId}`);
      setForms((prev) => {
        const next = prev.filter((f) => f.id !== formId);
        onFormCountChange?.(next.length);
        return next;
      });
      if (selectedFormId === formId) {
        onSelectForm(null);
        reset();
      }
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const filteredForms = forms.filter(
    (form) =>
      form.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  if (!forms.length) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-100 mb-6">
          <FileTextOutlined className="text-4xl text-[#3498db]" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No forms yet</h3>
        <p className="text-gray-600 mb-6">Create your first form to get started</p>
        <Button
          type="primary"
          size="large"
          onClick={() => router.push("/formbuilder/create-form")}
          className="bg-gradient-to-r from-[#3498db] to-[#2980b9] border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          Create Your First Form
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Controls — matches Cards/Menus/Gallery layout */}
      <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl shadow-md border border-gray-200/50 p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96 group">
          <Input
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<SearchOutlined className="text-gray-400 group-hover:text-brand transition-colors duration-200" />}
            className="rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:border-brand transition-all h-10 shadow-sm bg-gradient-to-r from-white to-gray-50 [&_.ant-input]:bg-transparent [&_.ant-input]:font-medium"
            size="large"
            suffix={
              searchQuery && (
                <CloseOutlined
                  className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200"
                  onClick={() => setSearchQuery("")}
                />
              )
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 hidden sm:inline">View:</span>
          <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setChangeFormsView(false)}
            className={`p-2.5 rounded-lg transition-all duration-200 ${!changeFormsView
              ? "bg-gradient-to-r from-brand to-brand-dark text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-white"
              }`}
          >
            <AppstoreOutlined className="text-lg" />
          </button>
          <button
            onClick={() => setChangeFormsView(true)}
            className={`p-2.5 rounded-lg transition-all duration-200 ${changeFormsView
              ? "bg-gradient-to-r from-brand to-brand-dark text-white shadow-md"
              : "text-gray-600 hover:text-gray-800 hover:bg-white"
              }`}
          >
            <UnorderedListOutlined className="text-lg" />
          </button>
          </div>
        </div>
      </div>
      </div>

      <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl shadow-md border border-gray-200/50 p-6 backdrop-blur-sm">
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600 animate-fade-in">
          Found {filteredForms.length} {filteredForms.length === 1 ? "form" : "forms"}
        </div>
      )}

      {/* No Results */}
      {filteredForms.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <SearchOutlined className="text-3xl text-gray-400" />
          </div>
          <p className="text-gray-600">No forms match your search</p>
        </div>
      )}

      {/* List View */}
      {changeFormsView && filteredForms.length > 0 && (
        <div className="space-y-4">
          {filteredForms.map((form, index) => (
            <div
              key={form.id}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-[#3498db] transition-all duration-300 transform hover:-translate-y-1 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#3498db] to-[#2980b9] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <FileTextOutlined className="text-xl text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-[#3498db] transition-colors duration-200">
                        {form.title || "Untitled Form"}
                      </h3>
                      <Badge
                        count={`ID: ${form.id}`}
                        style={{ backgroundColor: "#3498db", color: "#ffffff", fontWeight: 500 }}
                      />
                    </div>
                  </div>
                  <p
                    className="text-gray-600 text-sm line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: form.description || "No description provided",
                    }}
                  />
                </div>

                <div className="flex sm:flex-col gap-2 flex-wrap">
                  <button
                    onClick={() => onSelectForm(form.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <EyeOutlined />
                    <span className="hidden sm:inline text-sm font-medium">Preview</span>
                  </button>
                  <button
                    onClick={() => router.push(`/formbuilder/edit-form?id=${form.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <EditOutlined />
                    <span className="hidden sm:inline text-sm font-medium">Edit</span>
                  </button>
                  <button
                    onClick={() => router.push(`/formbuilder/form-responses/${form.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    <FileTextOutlined />
                    <span className="hidden sm:inline text-sm font-medium">Responses</span>
                  </button>
                  <Popconfirm
                    title="Delete this form?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDeleteForm(form.id)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105 shadow-sm">
                      <DeleteOutlined />
                      <span className="hidden sm:inline text-sm font-medium">Delete</span>
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {!changeFormsView && filteredForms.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form, index) => (
            <div
              key={form.id}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#3498db] transition-all duration-300 transform hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Card Header */}
              <div className="h-32 bg-gradient-to-br from-[#3498db] via-[#2980b9] to-orange-500 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileTextOutlined className="text-5xl text-white/20" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge
                    count={`ID: ${form.id}`}
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(10px)" }}
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#3498db] transition-colors duration-200 line-clamp-1">
                  {form.title || "Untitled Form"}
                </h3>
                <p
                  className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[60px]"
                  dangerouslySetInnerHTML={{
                    __html: form.description || "No description provided",
                  }}
                />

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectForm(form.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-all duration-200 hover:scale-105 text-sm font-medium shadow-sm"
                  >
                    <EyeOutlined />
                    Preview
                  </button>
                  <button
                    onClick={() => router.push(`/formbuilder/edit-form?id=${form.id}`)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 hover:scale-105 text-sm font-medium shadow-sm"
                  >
                    <EditOutlined />
                    Edit
                  </button>
                  <button
                    onClick={() => router.push(`/formbuilder/form-responses/${form.id}`)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 hover:scale-105 text-sm font-medium shadow-sm"
                  >
                    <FileTextOutlined />
                    Responses
                  </button>
                  <Popconfirm
                    title="Delete this form?"
                    description="This action cannot be undone."
                    onConfirm={() => handleDeleteForm(form.id)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <button className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:scale-105 text-sm font-medium shadow-sm">
                      <DeleteOutlined />
                      Delete
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      </div>

      {/* Enhanced Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3498db] to-[#2980b9] rounded-lg flex items-center justify-center">
              <FileTextOutlined className="text-white text-lg" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">Form Preview</div>
              <div className="text-xs text-gray-500">ID: {selectedFormId}</div>
            </div>
          </div>
        }
        placement="right"
        onClose={() => onSelectForm(null)}
        open={drawerVisible}
        width="60vw"
        className="form-drawer"
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              router.push(`/formbuilder/edit-form?id=${selectedFormId}`);
              onSelectForm(null);
            }}
            className="bg-gradient-to-r from-[#3498db] to-[#2980b9] border-0 hover:shadow-lg transition-all duration-200"
          >
            Edit Form
          </Button>
        }
      >
        {selectedFormId && (
          <div className="animate-fade-in">
            <MaveFormElements
              formId={selectedFormId}
              setDrawerVisible={setDrawerVisible}
            />
          </div>
        )}
      </Drawer>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out backwards;
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out backwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MaveFormsList;
