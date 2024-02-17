import React, { useEffect, useState } from "react";
import { Grid, Avatar, Divider, Box, Paper, Typography } from "@mui/material";
import { Card, Tabs, FloatButton, Spin } from "antd";
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
  const [loading, setLoading] = useState(true);
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
        console.error("Error fetching user data");
      } finally {
        setLoading(false);
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
        const countData = data.filter(
          (item) => item.fn_info_nameid === user.id
        );
        setData(countData);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div>
        <Spin tip="กรุณารอสักครู่" size="large">
          <div className="content" />
        </Spin>
      </div>
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
                      <span>{data.length}</span>
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
                          data.filter((item) => item.fn_info_status === 0)
                            .length
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
                          data.filter((item) => item.fn_info_status === 1)
                            .length
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
                          data.filter((item) => item.fn_info_status === 2)
                            .length
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
              <Tabs defaultActiveKey={selectedKey}>
                {items.map((item) => (
                  <TabPane
                    tab={
                      <Link to={item.link}>
                        <Typography variant="body1" sx={{ fontSize: "25px" }}>
                          {item.label}
                        </Typography>
                      </Link>
                    }
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
      </Paper>
    </div>
  );
};

export default MenuProfile;
