// pages/formbuilder/index.js
import { Button } from "antd";
import router from "next/router";
import MaveFormsShowcase from "./mave-forms-showcase";
import { FormBuilderProvider } from "../../src/context/FormBuilderContext";
import { PlusOutlined, ThunderboltOutlined } from "@ant-design/icons";

export default function FormBuilder() {
  return (
    <FormBuilderProvider>
      <div className="py-10 mb-10 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            >
              <source
                src="https://videos.pexels.com/video-files/29460699/12682140_2560_1440_30fps.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/70"></div>
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-100 rounded-full mb-6 transform hover:scale-105 transition-transform duration-300">
                <ThunderboltOutlined className="text-[#3498db]" />
                <span className="text-sm font-medium text-gray-700">
                  Powerful Form Builder
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4
               bg-gradient-to-r from-[#3498db] via-[#2980b9] to-orange-500 bg-clip-text 
               text-transparent animate-gradient">
                Create Beautiful Forms
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Design, customize, and deploy forms in minutes with our intuitive drag-and-drop builder
              </p>

              {/* CTA Button */}
              <button
                onClick={() => router.push("/formbuilder/create-form")}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#2980b9] to-[#3498db] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <PlusOutlined className="relative z-10 text-lg group-hover:rotate-90 transition-transform duration-300" />
                <span className="relative z-10">Create New Form</span>
                <div className="absolute right-0 top-0 h-full w-0 group-hover:w-full bg-white/10 transition-all duration-300"></div>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl font-bold text-[#3498db] mb-1">∞</div>
                <div className="text-sm text-gray-600">Unlimited Forms</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl font-bold text-[#2980b9] mb-1">⚡</div>
                <div className="text-sm text-gray-600">Lightning Fast</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl font-bold text-gray-600 mb-1">🎨</div>
                <div className="text-sm text-gray-600">Fully Customizable</div>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
          <MaveFormsShowcase />
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: backwards;
        }
      `}</style>
    </FormBuilderProvider>
  );
}
