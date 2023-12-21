import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Paper } from "@mui/material";
import { Modal, Descriptions } from "antd";
import moment from "moment";

const News_views = () => {
  const { id } = useParams();
  const [Data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const isMobile = window.innerWidth <= 768;
  const thaiDate = moment(Data.created_at).locale("th").format("Do MMMM YYYY");
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  useEffect(() => {
    fetch(`https://fakenew-c1eaeda38e26.herokuapp.com/api/News_show/${id}`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching news data:", error));
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch("https://fakenew-c1eaeda38e26.herokuapp.com/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

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

  useEffect(() => {
    fetchUser();
  }, []);

  const items = [
    {
      key: "0",
      label: "",
      children: user && (
        <img
          src={
            "https://www.jollyboxdesign.com/wp-content/uploads/2021/08/Administrator.png"
          }
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
      children:
        "เกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียน",
    },
  ];

  const commonStyles = {
    fontFamily: "'Th Sarabun New', sans-serif",
    fontSize: isMobile ? "20px" : "30px",
    color: "gray",
  };
  const commonStyles1 = {
    fontFamily: "'Th Sarabun New', sans-serif",
    fontSize: isMobile ? "30px" : "50px",
    color: "gray",
  };

  return (
    <Paper
      elevation={0}
      style={{ width: "70%", padding: 30, margin: "0 auto" }}
    >
      <div
        style={{
          ...commonStyles,
          fontSize: "50px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        ข่าวสาร
      </div>
      <br />
      <h1 style={commonStyles}>{Data.title}</h1>
      <h1 style={commonStyles}>โดย : "ชื่อ-สกุล"</h1>
      <h1 style={commonStyles}>ลงเมื่อ : {thaiDate}</h1>
      <div
        style={commonStyles}
        dangerouslySetInnerHTML={{ __html: Data.details }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            width: "50%",
            height: "50%",
            objectFit: "cover",
          }}
          src={Data.cover_image}
          alt="Cover"
        />
      </div>
      <p style={commonStyles}>Video: {Data.video}</p>
      <Link style={commonStyles}>Link: {Data.link}</Link>
      <p style={commonStyles}>Tag: {Data.tag}</p>
      <p style={commonStyles} onClick={showModal}>
        โปรไฟลผู้เขียน
      </p>
      <Modal
        title="โปรไฟล์ผู้เขียน"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <Descriptions
          style={{
            fontSize: "30px",
            textAlign: "center",
          }}
          title=""
          items={items}
        />
      </Modal>
    </Paper>
  );
};

export default News_views;
