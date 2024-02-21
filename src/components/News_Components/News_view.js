import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Modal, Divider, Descriptions, Card, Space, Tag, Image } from "antd";
import { Paper } from "@mui/material";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";
import axios from 'axios';

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
    const fetchData = async () => {
      try {
        const newsResponse = await axios.get(`https://checkkonproject-sub.com/api/News_show/${id}`);
        const newsData = newsResponse.data;
        setData(newsData);
        setTags(JSON.parse(newsData.tag) || []);
  
        if (newsData.Author) {
          const userResponse = await axios.get(`https://checkkonproject-sub.com/api/User_edit/${newsData.Author}`);
          if (userResponse.status === 200) {
            const userData = userResponse.data;
            setUser(userData);
          } else {
            console.error("Error fetching user data:", userResponse.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [id]);
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
          <div className="cardsectionContent">ข่าวสาร</div>
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <Image
              className="details-image"
              src={data.cover_image}
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                borderRadius: "8px",
              }}
            />
          </div>
          <div dangerouslySetInnerHTML={{ __html: data.details }} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {data.details_image &&
              JSON.parse(data.details_image).map((imageName, index) => (
                <Image
                  key={index}
                  className="details-image"
                  src={`https://checkkonproject-sub.com/cover_image/${imageName}`}
                  alt={`Image ${index + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    borderRadius: "8px",
                  }}
                />
              ))}
          </div>
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
