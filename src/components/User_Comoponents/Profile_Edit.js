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
import UserProfile from "./Profile_Menu";
import { Typography } from "@mui/material";
import axios from 'axios';

const Profile_Edit = () => {
  const { id } = useParams();
  const [receiveCtEmail, setReceiveCtEmail] = useState(false);
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [province, setProvince] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const [prov, setProv] = useState(null);
  const navigate = useNavigate();

  const fetchProvince = async () => {
    try {
      const response = await axios.get(
        "https://checkkonproject-sub.com/api/Province_request"
      );
      if (response.status === 200) {
        const data = await response.data;
        setProvince(data);
      } else {
        console.error("Error fetching province data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };
  useEffect(() => {
    fetchProvince();
  }, []);

  useEffect(() => {
    const fetchFakeNewsData = async () => {
      try {
        const response = await axios.get(
          `https://checkkonproject-sub.com/api/User_edit/${id}`
        );
        if (response.status === 200) {
          const data = await response.data;
          setUserdata(data);
          const filteredIds = province.filter(
            (item) => item.id === (data && data.province)
          );
          form.setFieldsValue({
            username: data.username,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            phone_number: data.phone_number,
            Id_line: data.Id_line,
            province: filteredIds[0].prov_name,
            receive_ct_email: data.receive_ct_email,
          });
          setProv(data.province);
        } else {
          console.error("Invalid date received from the server");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchFakeNewsData();
  }, [id, province, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let receive = receiveCtEmail ? 1 : 0;
      const filteredIds = province.filter(
        (item) => item.id === (userdata && userdata.province)
      );
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
      if (values.province === filteredIds[0]?.prov_name) {
        formData.append("province", prov);
      } else {
        appendIfDefined("province", values.province);
      }
      formData.append("receive_ct_email", receive);
      const response = await axios.post(
        `https://checkkonproject-sub.com/api/User_update/${id}`,
        formData
      );
      if (response.status === 200) {
        message.success("แก้ไขข้อมูลส่วนตัวเสร็จสิ้น");
        navigate(`/User/Profile`);
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

  const onChange = (e) => {
    const isChecked = e.target.checked;
    setReceiveCtEmail(isChecked);
  };

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await axios.get(
        `https://checkkonproject-sub.com/api/${endpoint}`
      );
      if (response.status === 200) {
        const typeCodes = await response.data;
        const options = typeCodes.map((code) => (
          <Option key={code[`id`]} value={code[`id`]}>
            <Typography variant="body1" sx={{ fontSize: "20px" }}>
              {code[`${fieldName}_name`]}
            </Typography>
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

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label}
    </Typography>
  );

  return (
    <UserProfile>
      <Typography variant="h3" gutterBottom sx={{ color: "#000000" }}>
        แก้ไขข้อมูลสมาชิก
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
            label="ชื่อ"
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
            label="นามสกุล"
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
            label="อีเมล"
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
            label="รหัสผ่าน"
            name="password"
            rules={[{ required: false, message: "กรุณาเพิ่มรหัสผ่าน!" }]}
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
            label="เบอร์ติดต่อ"
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
            label="ไอดีไลน์"
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
            label="จังหวัดที่สังกัด"
            name="province"
            rules={[
              {
                required: false,
                message: "กรุณาเลือกจังหวัดที่สังกัด!",
              },
            ]}
          >
            <Select onChange={onChange_mfi_province} allowClear>
              {selectOptions_prov}
            </Select>
          </Form.Item>
          <Form.Item name="CheckboxContent">
            <Checkbox
              onChange={onChange}
              defaultChecked={userdata.receive_ct_email === 1}
            >
              รับคอนเทนต์ผ่านอีเมล
            </Checkbox>
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
      </Card>
    </UserProfile>
  );
};

export default Profile_Edit;
