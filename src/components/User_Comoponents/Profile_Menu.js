import React, { useEffect, useState } from "react";
import { Grid, Avatar, Divider, Box } from "@mui/material";
import { Card, Tabs, FloatButton, Modal, Button, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Title } = Typography;
const { TabPane } = Tabs;
const items = [
  { key: "1", label: "ข้อมูลส่วนตัว", link: "/User/Profile" },
  { key: "2", label: "แจ้งข้อมูลเท็จ", link: "/FakeNews_Menu" },
  { key: "3", label: "ประวัติการแจ้ง", link: "/FakeNews/NotificationHistory" },
];

const determineSelectedKey = (pathname) => {
  const foundItem = items.find((item) => pathname.includes(item.link));
  return foundItem ? foundItem.key : "1";
};

const MenuProfile = ({ children }) => {
  const [data, setData] = useState(null);
  const location = useLocation();
  const selectedKey = determineSelectedKey(location.pathname);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttonStyle = {
    background: "#7BBD8F",
    border: "none",
    color: "white",
  };

  const [isModalVisible, setIsModalVisible] = useState(true);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "https://fakenews001-392577897f69.herokuapp.com/api/user",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to retrieve user data");
          // Handle error condition here (e.g., redirect to login)
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error condition here
      }
    };

    fetchUser();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/ManageInfo_request"
      );
      if (response.ok) {
        const data = await response.json();
        const countData = data.filter((item) => item.fn_info_nameid === user.id)
          .length;
        setData(countData);
        console.log(
          "จำนวน data ที่ fn_info_nameid = user.id:",
          countData
        );
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  if (!user) {
    return (
      <div>
          <p>Please log in or register first</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f1f1f1" }}>
      <Box
        style={{
          width: "80%",
          padding: 20,
          margin: "0 auto",
          backgroundColor: "#f1f1f1",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            {!isMobile && (
              <Card
                style={{
                  margin: "auto",
                  backgroundColor: "#FFFFFF",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  style={{ marginBottom: "10px" }}
                >
                  <Grid item style={{ marginBottom: "5px" }}>
                    <Avatar sx={{ width: 100, height: 100 }}>
                      {user.username && user.username.charAt(0)}
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5">
                      ชื่อ-สกุล : {user.username}
                    </Typography>
                    <Typography variant="body1">
                      อีเมล : {user.email}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 20,
                    padding: 24,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Title level={5}>
                    จำนวนครั้งที่แจ้งข่าว : {data}
                  </Title>
                </div>
              </Card>
            )}
            <br />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card
              style={{
                margin: "auto",
                backgroundColor: "#FFFFFF",
                width: "100%",
                height: "100%",
              }}
            >
              <Tabs defaultActiveKey={selectedKey}>
                {items.map((item) => (
                  <TabPane
                    tab={<Link to={item.link}>{item.label}</Link>}
                    key={item.key}
                  >
                    {children}
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </Grid>
        </Grid>
        <FloatButton.BackTop />
      </Box>
    </div>
  );
};

export default MenuProfile;
