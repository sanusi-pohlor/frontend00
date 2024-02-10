import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CssBaseline,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Drawer,
} from "@mui/material";
import { CommentOutlined } from '@ant-design/icons';
import { styled } from "@mui/system";
import { UserOutlined, FacebookOutlined } from "@ant-design/icons";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FloatButton } from 'antd';
import LoginDialog from "./User_Comoponents/Login_Dialog";
import RegisterDialog from "./User_Comoponents/Register_Dialog";
import PropTypes from "prop-types";
import "./Menu_Navbar.css";
import PSU from "./Images/PSU.jpg";
import { useTheme } from "@mui/material/styles";

const pages = [
  { label: "หน้าหลัก", link: "/" },
  { label: "ข่าวสาร", link: "/News_Menu" },
  { label: "บทความ", link: "/Article_Menu" },
  { label: "สื่อชวนแชร์", link: "/MediaShare_Menu" },
  { label: "แจ้งข้อมูลเท็จ", link: "/FakeNews_Menu" },
  { label: "เกี่ยวกับเรา", link: "/About_Us_View" },
];
const YourTypography = styled("Typography")({
  flexGrow: 1,
  marginRight: "5px",
  fontFamily: "'Th Sarabun New', sans-serif",
  fontWeight: "bold",
  letterSpacing: ".1rem",
  color: "gray",
  fontSize: "250%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

function Menu_Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const Navigate = useNavigate();
  const theme = useTheme();
  const getFontSize = (breakpoint) => {
    const fontSizeMap = {
      xs: "150%",
      md: "250%",
      default: "200%",
    };

    return fontSizeMap[breakpoint] || fontSizeMap.default;
  };
  const handleButtonClick = () => {
    window.location.href = 'https://www.facebook.com/MediaLiteracyforCitizen';
  };
  const loginbuttonStyle = {
    background: "#7BBD8F",
    border: "none",
    color: "white",
  };
  const registerbuttonStyle = {
    border: "1px solid #7BBD8F",
    color: "gray",
  };
  const showLoginDialog = () => {
    setLoginVisible(true);
  };
  const closeLoginDialog = () => {
    setLoginVisible(false);
  };
  const showRegisterDialog = () => {
    setRegisterVisible(true);
  };
  const closeRegisterDialog = () => {
    setRegisterVisible(false);
  };
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
          const data = await response.json();
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
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  const LoginFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const RegisterFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const drawerWidth = 240;
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleDrawerToggleProfile = async () => {
    if (user.level === 3) {
      Navigate("/User/Profile");
    } else {
      Navigate("/Admin/");
    }
  };
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const drawerMenu = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 1, color: "#7BBD8F" }}>
        รู้เท่า ทันสื่อ - Check ก่อน
      </Typography>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem key={page.label} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              component={Link}
              to={page.link}
            >
              <ListItemText primary={page.label} sx={{ color: "#7BBD8F" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  const container = window.document.body;
  return (
    <Box className="custom-font">
      <CssBaseline />
      <AppBar
        className="AppBarContainer"
        sx={{ backgroundColor: "white", color: "#7BBD8F", height: "10%" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <img
            src="https://www.commsci.psu.ac.th/wp-content/uploads/2023/09/logo-web-V2.0.svg"
            alt="WMO Logo"
            className="image-style"
          />
          <div style={{ margin: "15px" }}></div>
          <YourTypography variant="h6">
            รู้เท่า ทันสื่อ - Check ก่อน
          </YourTypography>
          <Box component="nav">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: false,
              }}
              sx={{
                display: { xs: "block", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                  fontWeight: "bold",
                },
              }}
            >
              {drawerMenu}
            </Drawer>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={Link}
                to={page.link}
                sx={{
                  mr: 3,
                  fontSize: getFontSize(theme.breakpoints.width),
                  color: page.link === location.pathname ? "#7BBD8F" : "grey",
                  whiteSpace: "nowrap",
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton onClick={handleDrawerToggleProfile} sx={{ p: 0 }}>
                  <UserOutlined
                    style={{ fontSize: "2rem", color: "#7BBD8F" }}
                  />
                </IconButton>
              </div>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  className="register-button"
                  size="large"
                  type="primary"
                  style={{
                    ...registerbuttonStyle,
                    fontWeight: "bold",
                    fontSize: "20px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={showRegisterDialog}
                >
                  สมัครสมาชิก
                </Button>
                {registerVisible && (
                  <RegisterDialog
                    open={registerVisible}
                    onClose={closeRegisterDialog}
                    handleSubmit={handleSubmit}
                    RegisterFinish={RegisterFinish}
                  />
                )}
                <div style={{ margin: "5px" }}></div>
                <Button
                  className="login-button"
                  size="large"
                  type="primary"
                  style={{
                    ...loginbuttonStyle,
                    fontWeight: "bold",
                    fontSize: "20px",
                    whiteSpace: "nowrap",
                  }}
                  onClick={showLoginDialog}
                >
                  เข้าสู่ระบบ
                </Button>
                {loginVisible && (
                  <LoginDialog
                    open={loginVisible}
                    onClose={closeLoginDialog}
                    handleSubmit={handleSubmit}
                    RegisterFinish={LoginFinish}
                  />
                )}
              </div>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <>
        <FloatButton.Group
          trigger="click"
          style={{
            right: 80,
          }}
          icon={<CommentOutlined />}
        >
          <FloatButton icon={<FacebookOutlined />} onClick={handleButtonClick} />
        </FloatButton.Group>
      </>
    </Box>
  );
}
Menu_Navbar.propTypes = {
  window: PropTypes.func,
};
export default Menu_Navbar;
