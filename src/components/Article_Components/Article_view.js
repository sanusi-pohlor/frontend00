import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Paper } from "@mui/material";
import { Modal, Descriptions } from "antd";

const Article_view = () => {
  const { id } = useParams();
  const [Data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const isMobile = window.innerWidth <= 768;

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/Article_show/${id}`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching news data:", error));
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user", {
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
    { key: '1', label: 'UserName', children: user && <span>{user.username}</span> },
    { key: '2', label: 'Telephone', children: user && <span>{user.phone_number}</span> },
    { key: '3', label: 'Line', children: user && <span>{user.Id_line}</span> },
    { key: '4', label: 'Email', children: user && <span>{user.email}</span> },
    { key: '5', label: 'province', children: user && <span>{user.province}</span> },
  ];

  const commonStyles = {
    fontFamily: "'Th Sarabun New', sans-serif",
    fontSize: isMobile ? "20px" : "30px",
    color: "gray",
  };

  return (
    <Paper elevation={0} style={{ width: "70%", padding: 30, margin: "0 auto", textAlign: "center" }}>
      <div style={{ ...commonStyles, fontSize: "50px" }}>ข่าวสาร</div>
      <br />
      <h1 style={commonStyles}>{Data.title}</h1>
      <h1 style={commonStyles}>ผู้เขียน : {Data.Author}</h1>
      <h1 style={commonStyles}>ลงเมื่อ : {Data.creatat}</h1>
      <div style={commonStyles} dangerouslySetInnerHTML={{ __html: Data.details }} />
      <p style={commonStyles}>Video: {Data.video}</p>
      <p style={commonStyles}>Link: {Data.link}</p>
      <p style={commonStyles}>Tag: {Data.tag}</p>
      <p style={commonStyles} onClick={showModal}>โปรไฟลผู้เขียน</p>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Descriptions style={commonStyles} title="User Info" items={items} />
      </Modal>
    </Paper>
  );
};

export default Article_view;
