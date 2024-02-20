import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Modal, Divider, Descriptions, Card, Space, Tag } from "antd";
import { Paper } from "@mui/material";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";

const News_view = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const thaiDate = moment(data.created_at).locale("th").format("Do MMMM YYYY");
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/Article_show/${id}`
        );
        const data = await response.json();
        setData(data);
        setTags(JSON.parse(data.tag) || []);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchNews();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/User_edit/${data.Author}`
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchData();
}, [id, data]);

  const items = [
    {
      key: "1",
      label: "ชื่อ-สกุล",
      children: user && (
        <span>
          {user.username} {user.lastName}
        </span>
      ),
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
    <div className="backgroundColor">
      <Paper
        elevation={0}
        className="paperContainer"
        style={{ backgroundColor: "#e4e4e4" }}
      >
        <Card className="cardsection">
          <div className="cardsectionContent">บทความ</div>
        </Card>
        <br />
        <Card className="cardContent">
          <strong>{data.title}</strong>
          <br />
          <strong>
            โดย :{" "}
            {user ? `${user.username} ${user.lastName}` : "ไม่พบข้อมูลผู้เขียน"}
          </strong>
          <br />
          <strong>ลงเมื่อ : {thaiDate}</strong>
          <br />
          <Divider />
          <div dangerouslySetInnerHTML={{ __html: data.details }} />
          <div>
            {data.link &&
              JSON.parse(data.link).map((item, index) => (
                <p key={index}>
                  Link:{" "}
                  <a href={item.first}>{item.first.substring(0, 100)}...</a>
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
          <p onClick={showModal}>
            <Avatar size={64} icon={<UserOutlined />}>
              {user && user.username}
            </Avatar>{" "}
            โปรไฟลผู้เขียน <span>{user && user.username}</span>
          </p>
          <Modal
            title="โปรไฟล์ผู้เขียน"
            open={isModalOpen}
            footer={null}
            onCancel={handleCancel}
          >
            <Descriptions layout="vertical" bordered items={items} />
          </Modal>
        </Card>
      </Paper>
    </div>
  );
};

export default News_view;
