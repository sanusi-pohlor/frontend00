import React, { useEffect, useState } from "react";
import LockOutlined from "@ant-design/icons";
import { Card, Form, Button, Checkbox, Input, Select, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import UserProfile from "./Profile_Menu";

const Editprofile = () => {
  const { id } = useParams();
  const [receiveCtEmail, setReceiveCtEmail] = useState(false);
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Option } = Select;
  const [form] = Form.useForm();
  const [province, setProvince] = useState([]);
  const [userdata, setUserdata] = useState([]);

  const fetchProvince = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Province_request"
      );
      if (response.ok) {
        const data = await response.json();
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
    fetchFakeNewsData();
  }, [id, province]);

  const fetchFakeNewsData = async () => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/User_edit/${id}`
      );
      if (response.ok) {
        const data = await response.json();
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
      } else {
        console.error("Invalid date received from the server");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onFinish = async (values) => {
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
        `https://checkkonproject-sub.com/api/User_update/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        message.success("Form data sent successfully");
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
    <UserProfile>
      <Card className="cardsection">
        <div className="cardsectionContent">แก้ไขข้อมูลสมาชิก</div>
      </Card>
      <br />
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
              ลงทะเบียน
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </UserProfile>
  );
};

export default Editprofile;
