import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Modal,
  Divider,
  Descriptions,
  Card,
  Space,
  Tag,
  Image,
  Button,
} from "antd";
import { Paper, Typography } from "@mui/material";
import moment from "moment";
import { UserOutlined, FacebookOutlined } from "@ant-design/icons";
import { FacebookIcon, FacebookShareButton } from "react-share";
const MdShare_view = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const thaiDate = moment(data.created_at).locale("th").format("Do MMMM YYYY");
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);
  const [tags, setTags] = useState([]);
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/MdShare_show/${id}`
        );
        const result = await response.json();
        setData(result);
        setTags(JSON.parse(result.tag) || []);
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
          const userData = await response.json();
          setUser(userData);
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
  const handleFacebookShare = () => {
    const shareUrl = `https://www.checkkonproject.com/News_Menu/${id}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };
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
        <Card>
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
              width="50%"
            />
          </div>
          <div className="cardContent">
            <Divider />
            <div className="Contenttitle">{data.title}</div>
            <br />
            {thaiDate}
            <br />
            <Divider />
            <div>
              {data.details &&
                data.details
                  .split("<p></p>")
                  .map((paragraph, index) => (
                    <React.Fragment key={index}>
                      <Typography
                        style={{ fontSize: "25px" }}
                        dangerouslySetInnerHTML={{ __html: paragraph.replace(/<\/p><p>/g, "<br />") }}
                      />
                      {data[`details_image_${index}`] && (
                        <Image
                          key={`${index}_image`}
                          className="details-image"
                          src={data[`details_image_${index}`]}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "300px",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                    </React.Fragment>
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
                    <Typography variant="body1" style={{ fontSize: "20px" }}>
                      #{tag}
                    </Typography>
                  </Tag>
                ))}
              </Space>
            </div>
            <FacebookShareButton
              url={`https://checkkonproject.com/MediaShare_Menu/MediaShare_view/${data.id}`}
              title={data.title}
              image={data.cover_image}
            >
              <FacebookIcon size={50} round />แชร์ไปยัง Facebook
            </FacebookShareButton>
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
          </div>
        </Card>
      </Paper>
    </div>
  );
};

export default MdShare_view;
