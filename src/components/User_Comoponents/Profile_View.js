import React, { useEffect, useState } from "react";
import UserProfile from "./Profile_Menu";
import { Button, Modal, Descriptions } from "antd";
import RegisterDialog from "./Profile_Edit";
import { Typography } from "@mui/material";

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
        const response = await fetch("https://fakenews001-392577897f69.herokuapp.com/api/user", {
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
          "https://fakenews001-392577897f69.herokuapp.com/api/Province_request"
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
    <Typography variant="body1" sx={{ fontSize }}>{label}: {text}</Typography>
  );

  const items = [
    { key: "1", label: "ชื่อ-นามสกุล", children: user && createTypography("ชื่อ-นามสกุล", user.username) },
    { key: "2", label: "นามสกุล", children: user && createTypography("นามสกุล", user.lastName) },
    { key: "3", label: "จังหวัดที่อยู่", children: province.length > 0 && createTypography("จังหวัดที่อยู่", province[0].prov_name) },
    { key: "4", label: "อีเมล", children: user && createTypography("อีเมล", user.email) },
    { key: "5", label: "เบอร์โทรศัพท์", children: user && createTypography("เบอร์โทรศัพท์", user.phone_number) },
    { key: "6", label: "ไลน์ไอดี", children: user && createTypography("ไลน์ไอดี", user.Id_line) },
    { key: "7", label: "รับข้อมูลผ่านอีเมล", children: user && createTypography("รับข้อมูลผ่านอีเมล", user.receive_ct_email) },
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
      <div
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body1" sx={{ fontSize: "45px" }}>ข้อมูลสมาชิก</Typography>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Button type="primary" target="_blank" onClick={showRegisterDialog}
            style={{
              marginRight: "10px",
              fontSize: "18px",
              padding: "20px 25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#7BBD8F",
              border: "none",
              color: "#ffffff",
            }}>
            {createTypography("แก้ไขข้อมูลสมาชิก", "")}
          </Button>
          {registerVisible && (
            <RegisterDialog
              open={registerVisible}
              onClose={closeRegisterDialog}
              handleSubmit={handleSubmit}
              RegisterFinish={RegisterFinish}
            />
          )}
          <Button type="primary" target="_blank" onClick={showModal}
            style={{
              fontSize: "18px",
              padding: "20px 25px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#7BBD8F",
              border: "none",
              color: "#ffffff",
            }}>
            {createTypography("ออกจากระบบ", "")}
          </Button>
          <Modal
            title="Basic Modal"
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {createTypography("ต้องการออกจากระบบ", "")}
          </Modal></div>
      </div>
      <br />
      <div>
        <Descriptions bordered items={items} />
      </div>
    </UserProfile>
  );
};

export default Profile;
