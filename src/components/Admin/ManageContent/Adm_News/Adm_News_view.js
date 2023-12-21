import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminMenu from "../../Adm_Menu";
import { Breadcrumb, Button, Modal, Descriptions } from "antd";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import {
  PlusCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

const Adm_News_view = () => {
  const { id } = useParams();
  const [Data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;
  const thaiDate = moment(Data.created_at).locale("th").format("Do MMMM YYYY");

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    // การดึงข้อมูลข่าวจาก API หรือฐานข้อมูล
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://fakenew-c1eaeda38e26.herokuapp.com/api/News_show/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          console.error("Failed to fetch news data");
        }
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchData();
  }, [id]);
  const items = [
    { key: '1', label: 'UserName', children: 'Zhou Maomao' },
    { key: '2', label: 'Telephone', children: '1810000000' },
    { key: '3', label: 'Live', children: 'Hangzhou, Zhejiang' },
    { key: '4', label: 'Remark', children: 'empty' },
    { key: '5', label: 'Address', children: 'No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China' },
  ];
  const commonStyles = {
    fontFamily: "'Th Sarabun New', sans-serif",
    fontSize: isMobile ? "14px" : "20px",
    color: "gray",
  };
  return (
    <AdminMenu>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Link to={`/Admin/Adm_News/edit/${id}`}>
          <Button
            type="primary"
            shape="round"
            icon={<PlusCircleOutlined />}
            size="large"
          >
            แก้ไข
          </Button>
        </Link>
      </div>
      <div>
      <Paper
      elevation={0}
      style={{ width: "70%", padding: 30, margin: "0 auto" }}
    >
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
      </div>
    </AdminMenu>
  );
};

export default Adm_News_view;
