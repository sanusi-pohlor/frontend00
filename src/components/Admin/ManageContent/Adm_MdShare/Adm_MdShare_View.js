import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminMenu from "../../Adm_Menu";
import { Breadcrumb, Button, Modal, Descriptions } from "antd";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import {
  PlusCircleOutlined,
} from "@ant-design/icons";

const Adm_MdShare_View = () => {
  const { id } = useParams();
  const [Data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;
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
          `https://fakenews001-392577897f69.herokuapp.com/api/Adm_MdShare_show/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
            เพิ่มข่าว
          </Button>
        </Link>
      </div>
      <div>
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
      </div>
    </AdminMenu>
  );
};

export default Adm_MdShare_View;
