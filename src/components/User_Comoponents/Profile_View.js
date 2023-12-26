import React, { useEffect, useState } from "react";
import UserProfile from "./Profile_Menu";
import { Button, Modal, Descriptions } from "antd";
import { Link } from "react-router-dom";
import RegisterDialog from "./Profile_Edit";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
    console.log("Logged out successfully");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showRegisterDialog = () => {
    setRegisterVisible(true);
  };
  const closeRegisterDialog = () => {
    setRegisterVisible(false);
  };
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
          console.log("data :" + data);
        } else {
          console.error("User data retrieval failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUser();
  }, []);
  const items = [
    { key: "1", label: "ชื่อ-นามสกุล", children: user && <span>{user.username}</span> },
    { key: "2", label: "นามสกุล", children: user && <span>{user.lastName}</span> },
    { key: "3", label: "จังหวัดที่อยู่", children: user && <span>{user.province}</span> },
    { key: "4", label: "อีเมล", children: user && <span>{user.email}</span> },
    { key: "5", label: "เบอร์โทรศัพท์", children: user && <span>{user.phone_number}</span> },
    { key: "6", label: "ไลน์ไอดี", children: user && <span>{user.Id_line}</span> },
    { key: "7", label: "รับข้อมูลผ่านอีเมล", children: user && <span>{user.receive_ct_email}</span> },
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
      <div>
        <Descriptions title="ข้อมูลสมาชิก" bordered items={items} />
      </div>
      <Button
        type="primary"
        onClick={showRegisterDialog}
        style={{ marginRight: "10px" }}
      >
        แก้ไขข้อมูลสมาชิก
      </Button>
      {registerVisible && (
        <RegisterDialog
          open={registerVisible}
          onClose={closeRegisterDialog}
          handleSubmit={handleSubmit}
          RegisterFinish={RegisterFinish}
        />
      )}
      <Button type="primary" onClick={showModal}>
        ออกจากระบบ
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>ต้องการออกจากระบบ</p>
      </Modal>
    </UserProfile>
  );
};

export default Profile;
