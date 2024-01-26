import React, { useEffect, useState } from "react";
import { Grid, Avatar, Divider, Box, Typography } from "@mui/material";
import { Card, Tabs, FloatButton, Result, Button } from "antd";
import { Link, useLocation } from "react-router-dom";

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
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to retrieve user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/ManageInfo_request"
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
      <Result
        title="กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อน"
        extra={
          <Button type="primary" key="console">
            เข้าสู่ระบบ
          </Button>
        }
      />
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
                    <Typography variant="h5" sx={{ fontSize: "25px" }}>
                      ชื่อ-สกุล : {user.username}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "25px" }}>
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
                  <Typography variant="body1" sx={{ fontSize: "25px" }}>
                    จำนวนข่าวที่แจ้ง : {data}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "25px" }}>
                    จำนวนข่าวที่ได้รับการตรวจสอบเสร็จสิ้น : {data}
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: "25px" }}>
                    จำนวนข่าวที่ได้รอการตรวจสอบ : {data}
                  </Typography>
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
                    tab={<Link to={item.link}><Typography variant="body1" sx={{ fontSize: "25px" }}>{item.label}</Typography></Link>}
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
