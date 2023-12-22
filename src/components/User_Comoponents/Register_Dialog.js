import React, { useState } from "react";
import { Paper } from "@mui/material";
import { Form, Button, Checkbox, Input, Select, message, Modal } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  LockOutlined,
} from "@ant-design/icons";

const RegisterDialog = ({ open, onClose }) => {
  const [selectOptions_prov, setSelectOptions_prov] = useState([]); // State for select optionsons
  const [receiveCtEmail, setReceiveCtEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(open);
  const { Option } = Select;
  const [form] = Form.useForm();
const getFontSize = (breakpoint) => {
  const fontSizeMap = {
    xs: "150%",
    md: "250%",
    default: "200%",
  };

  return fontSizeMap[breakpoint] || fontSizeMap.default;
};

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
      formData.append("province", selectOptions_prov);
      formData.append("receive_ct_email", receive);
      const response = await fetch(
        "https://fakenew-c1eaeda38e26.herokuapp.com/api/register",
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
          "https://fakenew-c1eaeda38e26.herokuapp.com/api/login",
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
        `https://fakenew-c1eaeda38e26.herokuapp.com/api/${endpoint}`
      );
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code[`${fieldName}_id`]} value={code[`${fieldName}_id`]}>
            {code[`${fieldName}_name`]}
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

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      onChange={() => {
        onChange_mfi_province();
      }}
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
        สมัครสมาชิก
      </div>
      <Paper
      elevation={0}
      style={{
        width: "80%",
        margin: "0 auto",
      }}
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
          label="ชื่อ"
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
          label="นามสกุล"
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
          rules={[{ required: true, message: "กรุณาเพิ่มรหัสผ่าน!" }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          label="รหัสผ่านยืนยัน"
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
          label="เบอร์ติดต่อ"
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
          label="ไอดีไลน์"
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
          label="จังหวัดที่สังกัด"
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
          <Checkbox onChange={onChange}>รับคอนเทนต์ผ่านอีเมล</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            ลงทะเบียน
          </Button>
        </Form.Item>
      </Form></Paper>
    </Modal>
  );
};

export default RegisterDialog;
