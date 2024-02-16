import React, { useEffect, useState } from "react";
import UserProfile from "./Profile_Menu";
import { Button, Modal, Descriptions, Divider } from "antd";
import { Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [province, setProvince] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    localStorage.removeItem("access_token");
    navigate(`/`);
    window.location.reload();
    console.log("Logged out successfully");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "https://checkkonproject-sub.com/api/user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
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

  if (!user) {
    return (
      <UserProfile>
        <div>Loading...</div>
      </UserProfile>
    );
  }

  return (
    <UserProfile>
      <div className="cardsectionContent">
        <Typography variant="h3" gutterBottom sx={{ color: '#000000' }}>
          ข้อมูลสมาชิก
        </Typography>
        <div className="setcardContent">
          <Link to={`/User/Profile/Edit/${user.id}`}>
            <Button
              type="primary"
              className="buttonprofile"
            >
              แก้ไข
            </Button>
          </Link>
          <Button
            type="primary"
            onClick={showModal}
            className="buttonprofile"
          >
            {createTypography("ออกจากระบบ")}
          </Button>
          <Modal
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
          >
            <p>{createTypography("ต้องการออกจากระบบ")}</p>
          </Modal>
        </div>
      </div>
      <Divider />
      <Descriptions layout="vertical" bordered items={items} />
    </UserProfile>
  );
};

export default Profile;
