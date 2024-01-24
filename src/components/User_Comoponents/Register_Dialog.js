import React, { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { Form, Button, Checkbox, Input, Select, message, Modal } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Typography } from "@mui/material";
import "../App.css";

const RegisterDialog = ({ open, onClose }) => {
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [receiveCtEmail, setReceiveCtEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(open);
  const { Option } = Select;
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log(values);
    console.log("receiveCtEmail", receiveCtEmail);
    setLoading(true);
    try {
      let receive = 0;
      if (receiveCtEmail) {
        receive = 1;
      }
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("phone_number", values.phone_number);
      formData.append("Id_line", values.Id_line);
      formData.append("province", values.province);
      formData.append("receive_ct_email", receive);
      const response = await fetch(
        "https://checkkonproject-sub.com/api/register",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        message.success("Form data sent successfully");
        const data = await response.json();
        localStorage.setItem("access_token", data.message);
        const loginResponse = await fetch(
          "https://checkkonproject-sub.com/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          }
        );

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          localStorage.setItem("access_token", loginData.message);
          window.location.reload();
        } else {
          message.error("Error logging in after registration");
        }
      } else {
        message.error("Error sending form data");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      message.error("Error registering user");
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = (e) => {
    const isChecked = e.target.checked;
    setReceiveCtEmail(isChecked);
  };

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/${endpoint}`
      );
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code[`id`]} value={code[`id`]}>
            <Typography variant="body1" sx={{ fontSize: "20px" }}>{code[`${fieldName}_name`]}</Typography>
          </Option>
        ));
        form.setFieldsValue({ [fieldName]: undefined });
        form.setFields([
          {
            name: fieldName,
            value: undefined,
          },
        ]);
        stateSetter(options);
      } else {
        console.error(
          `Error fetching ${fieldName} codes:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error fetching ${fieldName} codes:`, error);
    }
  };

  const onChange_mfi_province = () => {
    fetchDataAndSetOptions("Province_request", "prov", setSelectOptions_prov);
  };
  useEffect(() => {
    onChange_mfi_province();
  }, []);
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="container-title">
        สมัครสมาชิก
      </div>
      <Paper
        elevation={0}
        className="form-container"
      >
        <Form
          form={form}
          layout="vertical"
          name="form_register"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{
            maxWidth: "100%",
            fontSize: "50px",
          }}
          labelCol={{ style: { fontSize: '18px' } }}
        >
          <Form.Item
            label={<Typography variant="body1" className="form-item-label">ชื่อ</Typography>}
            name="username"
            rules={[
              {
                required: true,
                message: "กรุณาเพิ่มชื่อ!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
            }}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            label={<Typography variant="body1" sx={{ fontSize: "25px" }}>นามสกุล</Typography>}
            name="lastName"
            rules={[
              {
                required: true,
                message: "กรุณาเพิ่มนามสกุล!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <Input size="large" />
          </Form.Item>
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
            />
          </Form.Item>
          <Form.Item
            label={<Typography variant="body1" sx={{ fontSize: "25px" }}>รหัสผ่าน</Typography>}
            name="password"
            rules={[{ required: true, message: "กรุณาเพิ่มรหัสผ่าน!" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            label={<Typography variant="body1" sx={{ fontSize: "25px" }}>รหัสผ่านยืนยัน</Typography>}
            name="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "กรุณาเพิ่มรหัสผ่านยืนยัน!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน!"));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            label={<Typography variant="body1" sx={{ fontSize: "25px" }}>เบอร์ติดต่อ</Typography>}
            name="phone_number"
            rules={[
              {
                required: true,
                message: "กรูณาเพิ่มเบอร์ติดต่อ!",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<PhoneOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            label={<Typography variant="body1" sx={{ fontSize: "25px" }}>ไอดีไลน์</Typography>}
            name="Id_line"
            rules={[
              {
                required: true,
                message: "กรุณาเพิ่มไอดีไลน์!",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<MessageOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            label={<Typography variant="body1" sx={{ fontSize: "25px" }}>จังหวัดที่สังกัด</Typography>}
            name="province"
            rules={[
              {
                required: true,
                message: "กรุณาเลือกจังหวัดที่สังกัด!",
              },
            ]}
          >
            <Select onChange={onChange_mfi_province} allowClear>
              {selectOptions_prov}
            </Select>
          </Form.Item>
          <Form.Item name="CheckboxContent">
            <Checkbox onChange={onChange}><Typography variant="body1" sx={{ fontSize: "25px" }}>รับคอนเทนต์ผ่านอีเมล</Typography></Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
              <Typography variant="body1" className="submit-button-text">ลงทะเบียน</Typography>
            </Button>
          </Form.Item>
        </Form></Paper>
    </Modal>
  );
};

export default RegisterDialog;
