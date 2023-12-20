import React, { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import RegisterDialog from "./Register_Dialog";
import { Form, Button, Checkbox, Input, Select, message, Modal } from "antd";
import {
  Typography,
  Box,
  Dialog,
  DialogContent,
  Paper,
  Avatar,
  Slide,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="top" ref={ref} {...props} />;
});

const LoginDialog = ({ open, onClose }) => {
  const [visible, setVisible] = useState(open);
  const handleOk = () => {
    setVisible(false);
    onClose();
  };

  const handleCancel = () => {
    setVisible(false);
    onClose();
  };
  const onFinish = async (values) => {
    console.log(values);
    const formData = new FormData();
    formData.append("email", values.email); // Corrected the field name
    formData.append("password", values.password);
    try {
      const response = await fetch("http://localhost:8000/api/login", {
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
      title="ลงทะเบียน"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
            <Form
              layout="vertical"
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish} // Changed from onSubmit to onFinish
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
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="อีเมล"
                />
              </Form.Item>
              <Form.Item
                label="รหัสผ่าน"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input
                  type="password"
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="รหัสผ่าน"
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
                </Button>{" "}
                <a href="/User/Register">ลงทะเบียน</a>
              </Form.Item>
            </Form>
            </Modal>
  );
};

export default LoginDialog;
