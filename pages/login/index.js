// pages/login.js

import { Button, Form, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  RadarChartOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import Router, { useRouter } from "next/router";
import { useAuth } from "../../src/context/AuthContext";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

export default function Login() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const { callback } = router.query;

  // Check if demo mode is enabled
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO === 'true';

  const handleLogin = (values) => {
    const { email, password } = values;
    if (!email || !password) {
      message.error("Please fill in all fields");
      return;
    }
    login(email, password, callback);
  };

  const handleDemoLogin = () => {
    login("demouser@mave.com", "Demo@Mave2025", callback);
  };

  if (loading) return <Loader />;

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
      {/* Left Panel - Login Form with Background */}
      <motion.div
        className="relative w-full md:w-[42%] h-full flex items-center justify-center p-8 bg-zinc-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-sm border border-zinc-200 p-8 md:p-10">
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
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">
              Welcome back
            </h1>
            <p className="text-zinc-500 text-sm">
              Sign in to continue to your dashboard
            </p>
          </motion.div>

          {/* Sign Up Link */}
          {!isDemoMode && (
            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center gap-2 mb-6"
            >
              <span className="text-gray-600 text-sm">
                Don't have an account?
              </span>
              <Link href="/signup">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="font-medium text-zinc-900 hover:text-zinc-600 cursor-pointer transition-colors"
                >
                  Sign Up
                </motion.span>
              </Link>
            </motion.div>
          )}

          {/* Google Button */}
          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                block
                className="flex justify-center items-center gap-3 h-11 border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors rounded-lg"
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
            className={`flex items-center gap-4 ${isDemoMode ? "my-14" : "mb-6"}`}
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-xs text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </motion.div>

          {/* Login Form */}
          <motion.div variants={itemVariants}>
            {isDemoMode ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  block
                  className="h-11 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium border-0 rounded-lg transition-colors"
                  onClick={handleDemoLogin}
                >
                  Get In
                </Button>
              </motion.div>
            ) : (
              <Form
                name="login"
                initialValues={{
                  remember: true,
                  email: "",
                  password: "",
                }}
                onFinish={handleLogin}
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input
                      prefix={
                        <MailOutlined className="text-lg text-gray-400 mr-2" />
                      }
                      placeholder="Email address"
                      className="h-11 rounded-lg border border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 transition-colors bg-white"
                    />
                  </motion.div>
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input.Password
                      placeholder="Password"
                      className="h-11 rounded-lg border border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 transition-colors bg-white"
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
                <Form.Item>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      block
                      className="h-11 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium border-0 rounded-lg transition-colors"
                      htmlType="submit"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </Form.Item>
              </Form>
            )}
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            className="mt-6 text-center space-y-4"
          >
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link href="/terms">
                <span className="text-zinc-700 hover:text-zinc-900 font-medium cursor-pointer">
                  Terms
                </span>
              </Link>{" "}
              and{" "}
              <Link href="/privacy">
                <span className="text-zinc-700 hover:text-zinc-900 font-medium cursor-pointer">
                  Privacy Policy
                </span>
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Video Background */}
      <div className="hidden md:block relative w-3/5 h-full overflow-hidden">
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
                  className="block text-zinc-200 mt-2 font-medium"
                  style={{ WebkitTextStroke: "0" }}
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
                    type="primary"
                    icon={<RocketOutlined />}
                    className="h-11 px-5 font-medium rounded-lg"
                    onClick={() => router.push("/usermanual/changelog")}
                  >
                    What's New
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    icon={<RadarChartOutlined />}
                    className="h-11 px-5 bg-white/10 hover:bg-white/15 text-white border border-white/25 hover:border-white/40 font-medium rounded-lg transition-colors"
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
    </div>
  );
}
