// pages/login.js

import { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import {
  EyeInvisibleOutlined,
  LockOutlined,
  MailOutlined,
  RadarChartOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { useAuth } from "../../src/context/AuthContext";
import Loader from "../../components/Loader";
import { getLocalTenantSlug, isLocalHostname } from "../../axios";

export default function Login() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const { callback } = router.query;
  const [form] = Form.useForm();
  const [showTenantSlug, setShowTenantSlug] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowTenantSlug(isLocalHostname(window.location.hostname));
      const savedSlug = getLocalTenantSlug();
      if (savedSlug) {
        form.setFieldsValue({ tenant_slug: savedSlug });
      }
    }
  }, [form]);

  const handleLogin = (values) => {
    const { email, password, tenant_slug } = values;
    if (!email || !password) {
      message.error("Please fill in all fields");
      return;
    }
    login(email, password, callback, tenant_slug);
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
        {/* Left Panel */}
        <div
          className="flex flex-col justify-center gap-8 px-8 md:px-24 h-screen bg-cover bg-bottom bg-no-repeat col-span-1"
          style={{ backgroundImage: "url('/images/ui/lleftbg.png')" }}
        >
          <Image
            src="/images/ui/mave_new_logo.png"
            alt="Mave Logo"
            width={330}
            height={100}
            objectFit="contain"
          />
          <h1 className="text-xl md:text-2xl font-bold text-theme text-center">
            Log in to your account
          </h1>
          <div className="flex justify-center items-center gap-2 text-[1.2rem]">
            <h3 className="font-normal">Don't have an account?</h3>
            <Link href="/signup">
              <h3 className="font-semibold text-theme cursor-pointer">
                Sign Up
              </h3>
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              block
              className="flex justify-center items-center gap-4 py-8 border-2 border-[#C9C9C9] bg-white"
              onClick={() => message.info("Coming soon")}
            >
              <Image
                src="/images/ui/google.png"
                alt="Google Logo"
                width={30}
                height={30}
                objectFit="contain"
              />
              <h3 className="google text-[#797B7E] text-[1.2rem] font-medium capitalize">
                Continue with Google
              </h3>
            </Button>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Image
              src="/images/ui/line.svg"
              alt="Line"
              width={80}
              height={10}
              objectFit="contain"
            />
            <p className="text-sm font-normal text-gray-500 text-center">
              Or with email and password
            </p>
            <Image
              src="/images/ui/line.svg"
              alt="Line"
              width={80}
              height={10}
              objectFit="contain"
            />
          </div>
          <div>
            <Form
              form={form}
              name="login"
              initialValues={{
                remember: true,
                email: "demouser@mave.com",
                password: "Demo@Mave2025",
                tenant_slug: "",
              }}
              onFinish={handleLogin}
            >
              {showTenantSlug && (
                <Form.Item
                  name="tenant_slug"
                  rules={[
                    {
                      pattern: /^[a-z0-9_]*$/,
                      message: "Lowercase letters, numbers and underscore only",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <ApartmentOutlined className="text-[1.3rem] text-[#797B7E] mr-2 font-medium" />
                    }
                    placeholder="Tenant slug (empty = super admin)"
                    className="input-field"
                    allowClear
                  />
                </Form.Item>
              )}
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input
                  prefix={
                    <MailOutlined className="text-[1.3rem] text-[#797B7E] mr-2 font-medium" />
                  }
                  placeholder="Email"
                  className="input-field"
                />
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
                <Input.Password
                  placeholder="Password"
                  className="input-field"
                  prefix={
                    <LockOutlined className="text-[1.3rem] text-[#797B7E] mr-2 font-medium" />
                  }
                  iconRender={(visible) =>
                    visible ? (
                      <EyeInvisibleOutlined />
                    ) : (
                      <EyeInvisibleOutlined />
                    )
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  className="bg-theme text-white text-[1.2rem] font-medium py-6"
                  htmlType="submit"
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        {/* Right Panel */}
        <div
          className="h-screen bg-theme text-black flex flex-col justify-between gap-8 col-span-2
          bg-right-bottom bg-no-repeat"
          style={{
            backgroundImage: "url('/images/ui/lrightbg.svg')",
            backgroundSize: "80%",
          }}
        >
          <div className="flex flex-col gap-8 pt-10 pl-8 md:pl-20">
            <h1 className="text-3xl md:text-4xl font-bold">
              Mave CMS is
              <br />
              launching in Bangladesh soon !!!
            </h1>
            <p className="text-lg md:text-xl font-normal md:w-lg leading-8 md:leading-[2.5rem]">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using
            </p>
          </div>

          {/* Changelogs */}
          <Button
            icon={<RadarChartOutlined />}
            className="fixed bottom-0 right-0 m-4 bg-white text-theme z-20"
            onClick={() => router.push("/usermanual/changelog")}
          />
          <Button
            icon={<RadarChartOutlined />}
            className="fixed bottom-0 right-10 m-4 bg-white text-theme z-20"
            onClick={() => router.push("/portfolio")}
          />
        </div>
      </div>
    </div>
  );
}
