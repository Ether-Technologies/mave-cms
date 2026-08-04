import React, { useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  InsertRowLeftOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  RadarChartOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import instance from "../../axios";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const router = useRouter();

  const handleSignup = async (values) => {
    const { email, name, phone, company, password, password_confirmation } =
      values;
    setIsLoading(true);
    try {
      const res = await instance.post("admin/register", {
        email,
        name,
        phone,
        company,
        password,
        password_confirmation,
      });
      if (res?.status === 201) {
        // Success - Show the success modal
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      // Optionally, display an error message to the user
      message.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    router.push("/login");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="fixed inset-0 flex w-full h-screen overflow-hidden">
      {/* Left Panel - Video Background */}
      <div className="hidden md:block relative w-1/2 h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/18069233/18069233-uhd_1440_2560_24fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/15 to-transparent"></div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.div
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              className="backdrop-blur-md bg-white/10 rounded-3xl p-10 border border-white/20 shadow-2xl"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              >
                Build. Manage. Scale.
                <span
                  className="block text-brand mt-2"
                  style={{ WebkitTextStroke: "1px rgba(75, 85, 99, 0.5)" }}
                >
                  With Mave CMS
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-100 leading-relaxed mb-8"
              >
                The most powerful and flexible content management system
                designed for modern businesses. Create stunning websites, manage
                content effortlessly, and scale with confidence.
              </motion.p>
              <motion.div variants={itemVariants} className="flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    icon={<RocketOutlined />}
                    className="h-12 px-6 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-blue-600 text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                    onClick={() => router.push("/usermanual/changelog")}
                  >
                    What's New
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    icon={<RadarChartOutlined />}
                    className="h-12 px-6 bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
                    onClick={() => router.push("/portfolio")}
                  >
                    Portfolio
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Signup Form with Background */}
      <motion.div
        className="relative w-full md:w-1/2 h-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat overflow-y-auto"
        style={{ backgroundImage: "url('/images/ui/lleftbg.png')" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Glassmorphism Container */}
        <div className="relative z-10 w-full max-w-2xl backdrop-blur-md bg-white/80 rounded-3xl shadow-2xl border border-white/40 p-6 md:p-8 my-6">
          {/* Logo */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Image
                src="/images/ui/mave_new_logo.png"
                alt="Mave Logo"
                width={200}
                height={60}
                objectFit="contain"
                className="drop-shadow-lg"
              />
            </motion.div>
          </motion.div>

          {/* Welcome Text */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand via-brand-dark to-blue-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 text-sm">
              Sign up to get started with Mave CMS
            </p>
          </motion.div>

          {/* Login Link */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center gap-2 mb-6"
          >
            <span className="text-gray-600 text-sm">
              Already have an account?
            </span>
            <Link href="/login">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="font-semibold text-brand hover:text-brand-dark cursor-pointer transition-colors"
              >
                Log In
              </motion.span>
            </Link>
          </motion.div>

          {/* Google Button */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                block
                className="flex justify-center items-center gap-3 h-12 border-2 border-gray-200 bg-white/70 hover:bg-white/90 hover:border-blue-300 transition-all rounded-xl shadow-sm hover:shadow-md"
                onClick={() => message.info("Coming soon")}
              >
                <Image
                  src="/images/ui/google.png"
                  alt="Google Logo"
                  width={24}
                  height={24}
                  objectFit="contain"
                />
                <span className="text-gray-700 text-sm font-semibold">
                  Continue with Google
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-6"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-xs text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </motion.div>

          {/* Signup Form */}
          <motion.div variants={itemVariants}>
            <Form
              name="signup"
              initialValues={{ remember: true }}
              onFinish={handleSignup}
            >
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Email required",
                    },
                  ]}
                  className="mb-0"
                >
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input
                      prefix={
                        <MailOutlined className="text-lg text-gray-400 mr-2" />
                      }
                      placeholder="Email address"
                      className="h-12 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-brand transition-all bg-white/70"
                    />
                  </motion.div>
                </Form.Item>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Name required",
                    },
                  ]}
                  className="mb-0"
                >
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input
                      prefix={
                        <UserOutlined className="text-lg text-gray-400 mr-2" />
                      }
                      placeholder="Full name"
                      className="h-12 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-brand transition-all bg-white/70"
                    />
                  </motion.div>
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Form.Item
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Phone required",
                    },
                  ]}
                  className="mb-0"
                >
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input
                      prefix={
                        <PhoneOutlined className="text-lg text-gray-400 mr-2" />
                      }
                      placeholder="Phone number"
                      className="h-12 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-brand transition-all bg-white/70"
                    />
                  </motion.div>
                </Form.Item>
                <Form.Item
                  name="company"
                  rules={[
                    {
                      required: true,
                      message: "Company name required",
                    },
                  ]}
                  className="mb-0"
                >
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input
                      prefix={
                        <InsertRowLeftOutlined className="text-lg text-gray-400 mr-2" />
                      }
                      placeholder="Company / Organization name"
                      className="h-12 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-brand transition-all bg-white/70"
                    />
                  </motion.div>
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Password required",
                    },
                  ]}
                  className="mb-0"
                >
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input.Password
                      placeholder="Password"
                      className="h-12 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-brand transition-all bg-white/70"
                      prefix={
                        <LockOutlined className="text-lg text-gray-400 mr-2" />
                      }
                      iconRender={(visible) =>
                        visible ? (
                          <EyeOutlined className="text-gray-400" />
                        ) : (
                          <EyeInvisibleOutlined className="text-gray-400" />
                        )
                      }
                    />
                  </motion.div>
                </Form.Item>
                <Form.Item
                  name="password_confirmation"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Confirm required",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match!")
                        );
                      },
                    }),
                  ]}
                  className="mb-0"
                >
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input.Password
                      placeholder="Confirm password"
                      className="h-12 rounded-xl border-2 border-gray-200 hover:border-blue-300 focus:border-brand transition-all bg-white/70"
                      prefix={
                        <LockOutlined className="text-lg text-gray-400 mr-2" />
                      }
                      iconRender={(visible) =>
                        visible ? (
                          <EyeOutlined className="text-gray-400" />
                        ) : (
                          <EyeInvisibleOutlined className="text-gray-400" />
                        )
                      }
                    />
                  </motion.div>
                </Form.Item>
              </div>
              <Form.Item className="mt-6 mb-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    block
                    className="h-12 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-blue-600 text-white text-base font-semibold border-0 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    htmlType="submit"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </Form.Item>
            </Form>
          </motion.div>

          {/* Additional Info */}
          <motion.div variants={itemVariants} className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <Link href="/terms">
                <span className="text-brand hover:text-brand-dark font-medium cursor-pointer">
                  Terms
                </span>
              </Link>{" "}
              and{" "}
              <Link href="/privacy">
                <span className="text-brand hover:text-brand-dark font-medium cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 right-20 w-20 h-20 bg-brand/20 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-40 w-32 h-32 bg-brand-dark/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-20 w-24 h-24 bg-orange-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Success Modal */}
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        centered
        closable={false}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <CheckCircleOutlined
            style={{ fontSize: "4rem", color: "#52c41a", marginBottom: "1rem" }}
          />
          <h2 className="font-bold text-3xl text-black mb-3">
            Signup Successful!
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            Your account has been created successfully.
          </p>
          <Button
            key="login"
            className="h-12 px-8 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-blue-600 text-white border-0 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl"
            onClick={handleOk}
          >
            Go to Login
          </Button>
        </div>
      </Modal>
    </div>
  );
}
