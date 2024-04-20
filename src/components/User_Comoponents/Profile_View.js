import React, { useEffect, useState } from "react";
import UserProfile from "./Profile_Menu";
import { Button, Modal, Descriptions, Divider } from "antd";
import { Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [province, setProvince] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
  const fetchData = async () => {
    try {
      const userResponse = await axios.get(
        "https://checkkonproject-sub.com/api/user",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (userResponse.status === 200) {
        const userData = await userResponse.data;
        setUser(userData);
        const [fiproResponse, provinceResponse] = await Promise.all([
          axios.get(
            `https://checkkonproject-sub.com/api/fipro_request/${userData.id}`
          ),
          axios.get(
            `https://checkkonproject-sub.com/api/Pvname_request/${userData.province}`
          ),
        ]);
        if (fiproResponse.status === 200) {
          const fiproData = await fiproResponse.data;
          setData(fiproData);
        } else {
          console.error("Error fetching data:", fiproResponse.statusText);
        }
        if (provinceResponse.status === 200) {
          const provinceData = await provinceResponse.data;
          setProvince(provinceData);
        } else {
          console.error("Error fetching province data:", provinceResponse.statusText);
        }
      } else {
        console.error("User data retrieval failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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
      children: province && createTypography(province.prov_name),
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
      {isMobile && (
        <div >
          <div >
            <Typography variant="h3" gutterBottom sx={{ color: "#000000" }}>
              ข้อมูลสมาชิก
            </Typography>
          </div>
          <div className="setcardContent">
            <Link to={`/User/Profile/Edit/${user.id}`}>
              <Button type="primary" className="buttonprofile">
                แก้ไข
              </Button>
            </Link>
            <Button type="primary" onClick={showModal} className="buttonprofile">
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
          <Divider />
          {data && (
            <div>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "25px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>ข้อมูลที่แจ้งทั้งหมด</span>
                <span>{data.sam}</span>
              </Typography>
              <Divider />
              <Typography
                variant="body1"
                sx={{
                  fontSize: "25px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>ข้อมูลที่รอดำเนินการตรวจสอบ</span>
                <span>
                  {
                    data.status_0
                  }
                </span>
              </Typography>
              <Divider />
              <Typography
                variant="body1"
                sx={{
                  fontSize: "25px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>ข้อมูลที่อยู่ระหว่างการตรวจสอบ</span>
                <span>
                  {
                    data.status_1
                  }
                </span>
              </Typography>
              <Divider />
              <Typography
                variant="body1"
                sx={{
                  fontSize: "25px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>ข้อมูลที่ดำเนินการตรวจสอบเสร็จสิ้น</span>
                <span>
                  {
                    data.status_2
                  }
                </span>
              </Typography>
            </div>
          )}
        </div>
      )}
      {!isMobile && (
        <div className="cardsectionContent">
          <Typography variant="h3" gutterBottom sx={{ color: "#000000" }}>
            ข้อมูลสมาชิก
          </Typography>
          <div className="setcardContent">
            <Link to={`/User/Profile/Edit/${user.id}`}>
              <Button type="primary" className="buttonprofile">
                แก้ไข
              </Button>
            </Link>
            <Button type="primary" onClick={showModal} className="buttonprofile">
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
      )}
      <Divider />
      <Typography variant="h3" gutterBottom sx={{ color: "#000000" }}>
        ข้อมูลส่วนตัว
      </Typography>
      <Descriptions layout="vertical" bordered items={items} />
    </UserProfile>
  );
};

export default Profile;
