import React, { useEffect, useState } from "react";
import UserProfile from "./Profile_Menu";
import { Button, Modal, Descriptions, Card } from "antd";
import RegisterDialog from "./Profile_Edit";
import { Typography } from "@mui/material";
import { PlusCircleOutlined } from "@ant-design/icons";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [province, setProvince] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
    console.log("Logged out successfully");
    setIsModalOpen(false);
  };
  const handleCancel = () => setIsModalOpen(false);

  const showRegisterDialog = () => setRegisterVisible(true);
  const closeRegisterDialog = () => setRegisterVisible(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const RegisterFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://checkkonproject-sub.com/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          console.log("User data:", data);
        } else {
          console.error("User data retrieval failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUser();
  }, []);

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
          console.log("Filtered provinces:", filteredIds);
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

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>{label}</Typography>
  );

  const items = [
    { key: "1", label: createTypography("ชื่อ-นามสกุล"), children: user && createTypography(user.username), labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } },
    { key: "2", label: createTypography("นามสกุล"), children: user && createTypography(user.lastName), labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } },
    { key: "3", label: createTypography("จังหวัดที่อยู่"), children: province.length > 0 && createTypography(province[0].prov_name), labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } },
    { key: "4", label: createTypography("อีเมล"), children: user && createTypography(user.email), labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } },
    { key: "5", label: createTypography("เบอร์โทรศัพท์"), children: user && createTypography(user.phone_number), labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } },
    { key: "6", label: createTypography("ไลน์ไอดี"), children: user && createTypography(user.Id_line), labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } },
    { key: "7", label: createTypography("รับข้อมูลผ่านอีเมล"), children: user && createTypography(user.receive_ct_email), labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } },
  ];

  if (!user) {
    return (
      <UserProfile>
        <div>Loading...</div>
      </UserProfile>
    );
  }

  return (
    <UserProfile>
      <Card
        className="cardsection"
      >
        <div
          className="cardsectionContent"
        >
          ข้อมูลสมาชิก<div className="setcardContent">
            <Button
              className="buttonfilterStyle"
              icon={<PlusCircleOutlined />}
              onClick={showRegisterDialog}
            >
              {createTypography("แก้ไข")}
            </Button>
            {registerVisible && (
              <RegisterDialog
                open={registerVisible}
                onClose={closeRegisterDialog}
                handleSubmit={handleSubmit}
                RegisterFinish={RegisterFinish}
              />
            )}
            <Button onClick={showModal}
              className="buttonfilterStyle">
              {createTypography("ออกจากระบบ")}
            </Button>
            <Modal
              visible={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="ยืนยัน"
              cancelText="ยกเลิก"
            >
              <p>{createTypography("ต้องการออกจากระบบ")}</p>
            </Modal>
          </div></div>
      </Card>

      <br />
      <div>
        <Descriptions bordered items={items} />
      </div>
    </UserProfile>
  );
};

export default Profile;
