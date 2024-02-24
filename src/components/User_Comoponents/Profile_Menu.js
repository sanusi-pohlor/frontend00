import React, { useEffect, useState } from "react";
import { Grid, Avatar, Divider, Paper, Typography, Tab, Tabs } from "@mui/material";
import { Card, Spin } from "antd";
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';

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
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          "https://checkkonproject-sub.com/api/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (userResponse.status === 200) {
          const userData = await userResponse.data;
          setUser(userData);
          const [fiproResponse] = await Promise.all([
            axios.get(
              `https://checkkonproject-sub.com/api/fipro_request/${userData.id}`
            ),
          ]);

          if (fiproResponse.status === 200) {
            const fiproData = await fiproResponse.data;
            setData(fiproData);
          } else {
            console.error("Error fetching data:", fiproResponse.statusText);
          }

        } else {
          console.error("User data retrieval failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);


  if (!user) {
    return (
      <Spin tip="กรุณารอสักครู่" size="large">
        <div className="content" />
      </Spin>
    );
  }
  return (
    <div className="backgroundColor">
      <Paper
        elevation={0}
        className="paperContainer"
        style={{ backgroundColor: "#e4e4e4" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            {!isMobile && (
              <Card>
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
                    <Typography sx={{ fontSize: "30px" }}>
                      ชื่อ-สกุล : {user.username}
                    </Typography>
                    <Typography sx={{ fontSize: "30px" }}>
                      อีเมล : {user.email}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
                <br />
                {data && (
                  <div>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "25px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>ข้อมูลที่แจ้งทั้งหมด</span>
                      <span>{data.sam}</span>
                    </Typography>
                    <Divider />
                    <br />
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "25px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>ข้อมูลที่รอดำเนินการตรวจสอบ</span>
                      <span>
                        {
                          data.status_0
                        }
                      </span>
                    </Typography>
                    <Divider />
                    <br />
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "25px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>ข้อมูลที่อยู่ระหว่างการตรวจสอบ</span>
                      <span>
                        {
                          data.status_1
                        }
                      </span>
                    </Typography>
                    <Divider />
                    <br />
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "25px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>ข้อมูลที่ดำเนินการตรวจสอบเสร็จสิ้น</span>
                      <span>
                        {
                          data.status_2
                        }
                      </span>
                    </Typography>
                    <Divider />
                    <br />
                  </div>
                )}
              </Card>
            )}
            <br />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card>
              <Tabs value={selectedKey} centered>
                {items.map((item) => (
                  <Tab
                    key={item.key}
                    label={
                      <Link to={item.link} style={{ textDecoration: 'none' }}>
                        <Typography variant="body1" sx={{ fontSize: "25px" }}>
                          {item.label}
                        </Typography>
                      </Link>
                    }
                    value={item.key}
                  />
                ))}
              </Tabs>
              <br />
              {children}
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default MenuProfile;
