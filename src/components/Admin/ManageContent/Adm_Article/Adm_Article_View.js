import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, Divider, Descriptions, Card, Space, Tag , Image} from "antd";
import moment from "moment";
import AdminMenu from "../../Adm_Menu";
import { Paper } from "@mui/material";

const Adm_Article_View = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const thaiDate = moment(data.created_at).locale("th").format("Do MMMM YYYY");
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/Article_show/${id}`
        );
        const data = response.json();
        setData(data);
        setTags(JSON.parse(data.tag) || []);
      } catch (error) {
        console.error("Error fetching Article data:", error);
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
          const data = response.json();
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
    <AdminMenu>
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
              โดย : {user ? user.username : "ไม่พบข้อมูลผู้เขียน"}
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
              {[...Array(8).keys()].map(
                (index) =>
                  data[`details_image_${index}`] && (
                    <Image
                      key={index}
                      className="details-image"
                      src={data[`details_image_${index}`]}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        borderRadius: "8px",
                      }}
                    />
                  )
              )}
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
    </AdminMenu>
  );
};

export default Adm_Article_View;
