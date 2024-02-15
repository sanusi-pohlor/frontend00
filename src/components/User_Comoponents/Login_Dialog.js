import React, { useState } from "react";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Button, Input, Modal , message} from "antd";
import {
  Paper,Typography
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";


const LoginDialog = ({ open, onClose }) => {
  const [visible, setVisible] = useState(open);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    try {
      const response = await fetch("https://checkkonproject-sub.com/api/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        message.success("เข้าสู่ระบบสำเร็จ");
        const data = await response.json();
        localStorage.setItem("access_token", data.message);
        navigate(`/`);
        window.location.reload();
      } else {
        message.error("อีเมลหรือรหัสผ่านผิดพลาด!");
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label}
    </Typography>
  );
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <div
        className="container-title"
      >
        เข้าสู่ระบบ
      </div>
      <Paper
        elevation={0}
        className="form-container"
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
          label={<Typography variant="body1" sx={{ fontSize: "25px" }}>อีเมล</Typography>}
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
            placeholder="ระบุอีเมล"
          />
        </Form.Item>
        <Form.Item
          label={<Typography variant="body1" sx={{ fontSize: "25px" }}>รหัสผ่าน</Typography>}
          name="password"
          rules={[
            {
              required: false,
              message: "กรุณาเพิ่มรหัสผ่าน!",
            },
          ]}
        >
          <Input
            type="password"
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="ระบุรหัสผ่าน"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="form-button"
          >
            {createTypography("เข้าสู่ระบบ")}
          </Button>
        </Form.Item>
      </Form>
      </Paper>
    </Modal>
  );
};

export default LoginDialog;
