// pages/form-responses/[id].jsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin, Alert, Button } from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import FormResponsesTable from "../../../components/FormResponses/FormResponsesTable";
import instance from "../../../axios";
import { useAuth } from "../../../src/context/AuthContext";

const FormResponsesPage = () => {
  const router = useRouter();
  const { id } = router.query; // Form ID from the URL
  const { user } = useAuth();

  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formInfo, setFormInfo] = useState(null);

  // Function to fetch form information
  const fetchFormInfo = async () => {
    if (!id) return;
    try {
      const response = await instance.get(`/form_builder/${id}`);
      if (response.status === 200) {
        setFormInfo(response.data);
      }
    } catch (err) {
      console.error("Error fetching form info:", err);
    }
  };

  // Function to fetch form responses
  const fetchResponses = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(`/form-submission`, {
        params: { form_id: id },
      });

      if (response.status === 200) {
        // Ensure that form_data is an object; if not, handle accordingly
        const sanitizedData = response.data.map((item) => ({
          ...item,
          form_data:
            item.form_data && typeof item.form_data === "object"
              ? item.form_data
              : {},
        }));

        // Sort responses by ID in descending order (newest first)
        const sortedData = sanitizedData.sort((a, b) => b.id - a.id);
        setResponses(sortedData);
      } else {
        setError("Failed to fetch form responses.");
      }
    } catch (err) {
      console.error("Error fetching form responses:", err);
      setError("An error occurred while fetching form responses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFormInfo();
      fetchResponses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={fetchResponses}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .modern-table .ant-table-thead > tr > th {
          background: orange;
          color: white;
          font-weight: 600;
          border: none;
          padding: 16px 12px;
        }
        
        .modern-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #fed7aa;
          padding: 12px;
        }
        
        .modern-table .ant-table-tbody > tr:hover > td {
          background: #fef3c7 !important;
        }
        
        .modern-table .ant-pagination {
          padding: 16px 24px;
          background: #fffbeb;
          border-top: 1px solid #fed7aa;
        }
        
        .modern-table .ant-btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .modern-table .ant-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
      `}</style>

      <div className="min-h-screen bg-white">
        <div className="mavecontainer py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
              >
                Back
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchResponses}
                loading={loading}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
              >
                Refresh
              </Button>
            </div>

            {/* Form Info Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-600 px-8 py-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Form Responses
                  {formInfo && (
                    <span className="text-xl text-yellow-100 ml-3">
                      {formInfo.title}
                    </span>
                  )}
                </h1>
                {formInfo && (
                  <p className="text-yellow-100 text-lg">
                    {formInfo.description?.replace(/<[^>]+>/g, '') || 'No description available'}
                  </p>
                )}
              </div>

              <div className="px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">{responses.length}</span>
                      </div>
                      <div>
                        <p className="text-sm text-yellow-600 font-medium">Total Responses</p>
                        <p className="text-2xl font-bold text-yellow-700">{responses.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">📊</span>
                      </div>
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Form ID</p>
                        <p className="text-2xl font-bold text-orange-700">#{id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">⚡</span>
                      </div>
                      <div>
                        <p className="text-sm text-amber-600 font-medium">Status</p>
                        <p className="text-2xl font-bold text-amber-700">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Responses Table */}
          <FormResponsesTable
            responses={responses}
            refreshData={fetchResponses}
            currentUser={user}
          />
        </div>
      </div>
    </>
  );
};

export default FormResponsesPage;
