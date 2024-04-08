import React, { useEffect, useState } from "react";
import { message, Input, Form, Button, Modal, Card, Descriptions } from "antd";
import { Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import AdminMenu from "../Adm_Menu";
import LockOutlined from "@ant-design/icons";
const Adm_Mm_View = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [province, setProvince] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/User_edit/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await fetch(
          "https://checkkonproject-sub.com/api/Province_request"
        );
        if (response.ok) {
          const pv = await response.json();
          const filteredIds = pv.filter(
            (item) => item.id === (user && user.province)
          );
          setProvince(filteredIds);
        } else {
          console.error("Error fetching province data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching province data:", error);
      }
    };

    if (user && user.province) {
      fetchProvince();
    }
  }, [user]);
  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("password", values.password);
      const response = await fetch(
        `https://checkkonproject-sub.com/api/User_update/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Form data sent successfully");
        handleCancel();
      } else {
        message.error("Error sending form data");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      message.error("Error sending form data");
    }
  };
  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label}
    </Typography>
  );
  const items = [
    {
      key: "1",
      label: createTypography("ชื่อ-นามสกุล"),
      children: user && createTypography(user.username),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "2",
      label: createTypography("นามสกุล"),
      children: user && createTypography(user.lastName),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "3",
      label: createTypography("รับข้อมูลผ่านอีเมล"),
      children:
        user &&
        createTypography(user.receive_ct_email === 1 ? "รับ" : "ไม่รับ"),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "4",
      label: createTypography("อีเมล"),
      children: user && createTypography(user.email),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "5",
      label: createTypography("เบอร์โทรศัพท์"),
      children: user && createTypography(user.phone_number),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "6",
      label: createTypography("ไลน์ไอดี"),
      children: user && createTypography(user.Id_line),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "7",
      label: createTypography("จังหวัดที่อยู่"),
      children: province.length > 0 && createTypography(province[0].prov_name),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
  ];

  return (
    <AdminMenu>
      <Card className="cardsection">
        <div className="cardsectionContent">ข้อมูลสมาชิก
          <Button type="primary" onClick={showModal} className="buttonfilterStyle">
            {createTypography("แก้ไขรหัสผ่าน")}
          </Button>
          <Modal
            title={createTypography("แก้ไขรหัสผ่าน")}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              name="member_form"
              onFinish={onFinish}
            >
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
              <Form.Item>
                <Button type="primary" htmlType="submit" className="form-button">
                  เพิ่ม
                </Button>
              </Form.Item>
            </Form>
          </Modal></div>
      </Card>
      <br />
      <Card>
        <Descriptions layout="vertical" bordered items={items} />
      </Card>
    </AdminMenu>
  );
};

export default Adm_Mm_View;
