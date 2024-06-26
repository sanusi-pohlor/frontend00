import React, { useEffect, useState } from "react";
import LockOutlined from "@ant-design/icons";
import { Card, Form, Button, Checkbox, Input, Select, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import AdminMenu from "../Adm_Menu";
import { Typography } from "@mui/material";
import axios from "axios";
const { TextArea } = Input;
const M_DB_Adm_Edit = () => {
  const { id } = useParams();
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Option } = Select;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-1);
  };
  const fetchFakeNewsData = async () => {
    try {
      const response = await axios.get(
        `https://checkkonproject-sub.com/api/User_edit/${id}`
      );
      if (response.status === 200) {
        const data = await response.data;
        form.setFieldsValue({
          username: data.username,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phone_number: data.phone_number,
          Id_line: data.Id_line,
          province: data.province,
          about: data.about,
        });
      } else {
        console.error("Invalid date from the server");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchFakeNewsData();
    fetchDataAndSetOptions();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const appendIfDefined = (fieldName, value) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(fieldName, value);
        }
      };
      appendIfDefined("username", values.username);
      appendIfDefined("lastName", values.lastName);
      appendIfDefined("email", values.email);
      appendIfDefined("password", values.password);
      appendIfDefined("phone_number", values.phone_number);
      appendIfDefined("Id_line", values.Id_line);
      appendIfDefined("province", values.province);
      appendIfDefined("about", values.about);
      const response = await axios.post(
        `https://checkkonproject-sub.com/api/User_update/${id}`,
        formData
      );
      if (response.status === 200) {
        message.success("แก้ไขข้อมูลส่วนตัวเสร็จสิ้น");
        navigate(`/Admin/`);
      } else {
        message.error("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const fetchDataAndSetOptions = async () => {
    try {
      const response = await axios.get(
        "https://checkkonproject-sub.com/api/Province_request"
      );
      if (response.status === 200) {
        const typeCodes = response.data;
        const options = typeCodes.map((code) => (
          <Option key={code[`id`]} value={code[`id`]}>
            <Typography variant="body1" sx={{ fontSize: "20px" }}>
              {code["prov_name"]}
            </Typography>
          </Option>
        ));
        setSelectOptions_prov(options);
      } else {
        console.error(`Error `, response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label}
    </Typography>
  );

  return (
    <AdminMenu>
      <Typography variant="h3" gutterBottom sx={{ color: "#000000" }}>
        แก้ไขข้อมูลแอดมิน
      </Typography>
      <Card>
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
          labelCol={{ style: { fontSize: "18px" } }}
        >
          <Form.Item
            label={createTypography("ชื่อ")}
            name="username"
            rules={[
              {
                required: false,
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
            label={createTypography("นามสกุล")}
            name="lastName"
            rules={[
              {
                required: false,
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
            label={createTypography("อีเมล")}
            name="email"
            rules={[
              {
                required: false,
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
            label={createTypography("รหัสผ่าน")}
            name="password"
            rules={[{ required: false, message: "กรุณาเพิ่มรหัสผ่าน!" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            label={createTypography("รหัสผ่านยืนยัน")}
            name="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: false, message: "กรุณาเพิ่มรหัสผ่านยืนยัน!" },
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
            label={createTypography("เบอร์ติดต่อ (หากไม่มีให้ใส่ - )")}
            name="phone_number"
            rules={[
              {
                required: false,
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
            label={createTypography("ไอดีไลน์  (หากไม่มีให้ใส่ - )")}
            name="Id_line"
            rules={[
              {
                required: false,
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
            label={createTypography("จังหวัดที่สังกัด")}
            name="province"
            rules={[
              {
                required: false,
                message: "กรุณาเลือกจังหวัดที่สังกัด!",
              },
            ]}
          >
            <Select allowClear>{selectOptions_prov}</Select>
          </Form.Item>
          <Form.Item
            label={createTypography("เกี่ยวกับ")}
            name="about"
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มไอดีไลน์!",
              },
            ]}
          >
            <TextArea
              size="large"
              prefix={<MessageOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="form-button"
            >
              {createTypography("ลงทะเบียน")}
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="primary"
          className="form-button-cancel"
          size="large"
          onClick={handleCancel}
        >
          <Typography variant="body1" sx={{ fontSize: "25px" }}>
            ยกเลิก
          </Typography>
        </Button>
      </Card>
    </AdminMenu>
  );
};

export default M_DB_Adm_Edit;
