import React, { useState } from "react";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Button, Input, Modal } from "antd";
import {
  Paper,
} from "@mui/material";

const LoginDialog = ({ open, onClose }) => {
  const [visible, setVisible] = useState(open);
  const onFinish = async (values) => {
    console.log(values);
    const formData = new FormData();
    formData.append("email", values.email); // Corrected the field name
    formData.append("password", values.password);
    try {
      const response = await fetch("https://fakenew-c1eaeda38e26.herokuapp.com/api/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.message);
        console.log("Login successful");
        window.location.reload();
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          textAlign: "center",
          fontSize: "50px",
          fontWeight: "bold",
          fontFamily: "'Th Sarabun New', sans-serif",
        }}
      >
        เข้าสู่ระบบ
      </div>
      <Paper
        elevation={0}
        style={{
          width: "80%",
          margin: "0 auto",
        }}
      >
      <Form
        layout="vertical"
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          maxWidth: "100%",
        }}
        size="large"
      >
        <Form.Item
          label="อีเมล"
          name="email"
          rules={[
            {
              required: true,
              message: "กรุณาเพิ่มอีเมล!",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          label="รหัสผ่าน"
          name="password"
          rules={[
            {
              required: true,
              message: "กรุณาเพิ่มรหัสผ่าน!",
            },
          ]}
        >
          <Input
            type="password"
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            size="large"
          >
            เข้าสู่ระบบ
          </Button>
        </Form.Item>
      </Form>
      </Paper>
    </Modal>
  );
};

export default LoginDialog;
