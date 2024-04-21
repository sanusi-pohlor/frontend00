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
import axios from "axios";
import { FacebookIcon, FacebookShareButton } from "react-share";
const Article_view = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [province, setProvince] = useState(null);
  const [user, setUser] = useState(null);
  const [tags, setTags] = useState([]);
  const thaiDate = moment(data.created_at).locale("th").format("Do MMMM YYYY");
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsResponse = await axios.get(
          `https://checkkonproject-sub.com/api/Article_show/${id}`
        );
        const newsData = newsResponse.data;
        setData(newsData);
        setTags(JSON.parse(newsData.tag) || []);
        if (newsData.Author) {
          const userResponse = await axios.get(
            `https://checkkonproject-sub.com/api/User_edit/${newsData.Author}`
          );
          if (userResponse.status === 200) {
            const userData = userResponse.data;
            setUser(userData);
            const provinceResponse = await axios.get(
              `https://checkkonproject-sub.com/api/Pvname_request/${userData.province}`
            );
            if (provinceResponse.status === 200) {
              const provinceData = await provinceResponse.data;
              setProvince(provinceData);
            } else {
              console.error("Error fetching province data:", provinceResponse.statusText);
            }
          } else {
            console.error("Error fetching user data:", userResponse.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
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
      label: "ชื่อ-สกุล",
      children: user && (
        <>
          {createTypography(`${user.username} ${user.lastName}`)}
        </>
      ),
    },
    {
      key: "2",
      label: "เบอร์ติดต่อ",
      children: user && createTypography(user.phone_number),
    },
    {
      key: "3",
      label: "ไอดีไลน์",
      children: user && createTypography(user.Id_line),
    },
    { key: "4", label: "อีเมล", children: user && createTypography(user.email) },
    {
      key: "5",
      label: "จังหวัด",
      children: province && createTypography(province.prov_name),
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
          <div className="cardsectionContent">บทความ</div>
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
            <Image className="details-image" src={data.cover_image} />
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
            <br />
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
            <br />
            <FacebookShareButton
              url={`https://checkkonproject.com/Article_Menu/Article_view/${data.id}`}
              title={data.title}
              image={data.cover_image}
            >
              <FacebookIcon size={50} round />แชร์ไปยัง Facebook
            </FacebookShareButton>
            <p onClick={showModal}>
              <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#7BBD8F' }}>
                {user && user.username}
              </Avatar>
              {" "}
              ผู้เขียน <span>{user && user.username}</span>
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

export default Article_view;
