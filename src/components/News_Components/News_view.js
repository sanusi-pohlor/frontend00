import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Paper } from "@mui/material";
import { Modal, Divider, Descriptions, Card, Space, Tag } from "antd";
import moment from "moment";

const News_view = () => {
  const { id } = useParams();
  const [Data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const isMobile = window.innerWidth <= 768;
  const thaiDate = moment(Data.created_at).locale("th").format("Do MMMM YYYY");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/News_show/${id}`
        );
        const data = await response.json();
        setData(data);
        setTags(JSON.parse(data.tag) || []);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchData();
  }, [id]);

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

  const commonStyles = {
    fontFamily: "'Th Sarabun New', sans-serif",
    fontSize: isMobile ? "20px" : "30px",
    color: "gray",
  };
  const commonStyles1 = {
    fontFamily: "'Th Sarabun New', sans-serif",
    fontSize: isMobile ? "30px" : "35px",
    color: "gray",
  };

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const items = [
    {
      key: "0",
      label: "",
      children: user && (
        <img
          src="https://www.jollyboxdesign.com/wp-content/uploads/2021/08/Administrator.png"
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      ),
    },
    {
      key: "1",
      label: "ชื่อ-สกุล",
      children: user && <span>{user.username}</span>,
    },
    {
      key: "2",
      label: "เบอร์ติดต่อ",
      children: user && <span>{user.phone_number}</span>,
    },
    {
      key: "3",
      label: "ไอดีไลน์",
      children: user && <span>{user.Id_line}</span>,
    },
    { key: "4", label: "อีเมล", children: user && <span>{user.email}</span> },
    {
      key: "5",
      label: "จังหวัด",
      children: user && <span>{user.province}</span>,
    },
    {
      key: "6",
      label: "เกี่ยวกับผู้เขียน",
      children: "เกี่ยวกับผู้เขียน... (ตัวอย่างข้อความ)",
    },
  ];

  return (
    <div style={{ backgroundColor: "#f1f1f1" }}>
      <Paper
        elevation={0}
        style={{
          width: "80%",
          padding: 50,
          margin: "0 auto",
          backgroundColor: "#f1f1f1",
        }}
      >
        <Card style={{ borderRadius: "20px", backgroundColor: "#7BBD8F" }}>
          <div
            style={{
              fontSize: "70px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'Th Sarabun New', sans-serif",
              color: "white",
            }}
          >
            ข่าวสาร
          </div>
        </Card>
        <br />
        <Card
          style={{
            borderRadius: "20px",
            backgroundColor: "#ffffff",
            padding: 50,
          }}
        >
          <h1 style={commonStyles1}>{Data.title}</h1>
          <h1 style={commonStyles1}>
            โดย : {user ? user.username : "ไม่พบข้อมูลผู้เขียน"}
          </h1>
          <h1 style={commonStyles1}>ลงเมื่อ : {thaiDate}</h1>
          <Divider />
          <div
            style={commonStyles}
            dangerouslySetInnerHTML={{ __html: Data.details }}
          />
          <div>
            {Data.link &&
              JSON.parse(Data.link).map((item, index) => (
                <p key={index} style={commonStyles}>
                  Link: <a href={item.first}>{item.first.substring(0, 100)}...</a>
                </p>
              ))}
          </div>
          <div>
            <Space size={[4, 8]} wrap>
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  style={{ fontSize: "20px", textAlign: "center" }}
                >
                  #{tag}
                </Tag>
              ))}
            </Space>
          </div>
          <p style={commonStyles} onClick={showModal}>
            โปรไฟลผู้เขียน <span>{user && user.username}</span>
          </p>
          <Modal
            title="โปรไฟล์ผู้เขียน"
            open={isModalOpen}
            footer={null}
            onCancel={handleCancel}
          >
            <Descriptions
              style={{ fontSize: "30px", textAlign: "center" }}
              title=""
              items={items}
            />
          </Modal>
        </Card>
      </Paper>
    </div>
  );
};

export default News_view;
