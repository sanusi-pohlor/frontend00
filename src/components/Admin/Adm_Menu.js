import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  PieChartOutlined,
  FormOutlined,
  BookOutlined,
  CommentOutlined,
  SendOutlined,
  FileSearchOutlined,
  BarsOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";

const { Content, Sider } = Layout;
const determineSelectedSubMenu = (pathname) => {
  if (
    pathname === "/Admin/Adm_Dashboard_Menu" ||
    pathname === "/Admin/Adm_News_Menu" ||
    pathname === "/Admin/Adm_Article_Menu" ||
    pathname === "/Admin/Adm_MdShare_Menu"
  ) {
    return "sub1";
  }
  return null;
};
const determineSelectedKey = (pathname) => {
  if (pathname === "/Admin") {
    return "1";
  } else if (pathname === "/Admin/Adm_Dashboard_Menu") {
    return "2";
  } else if (pathname === "/Admin/Adm_News_Menu") {
    return "3";
  } else if (pathname === "/Admin/Adm_Article_Menu") {
    return "4";
  } else if (pathname === "/Admin/Adm_MdShare_Menu") {
    return "5";
  } else if (pathname === "/Admin/ManageInfo") {
    return "6";
  } else if (pathname === "/Admin/Manage_Fake_Info_Menu") {
    return "7";
  } else if (pathname === "/Admin/ManageMembers") {
    return "8";
  } else if (pathname === "/Admin/ManageValues") {
    return "14";
  }
  return "1";
};

const AdminMenu = ({ children }) => {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const selectedKey = determineSelectedKey(location.pathname);
  const [openKeys, setOpenKeys] = useState([
    determineSelectedSubMenu(location.pathname),
  ]);
  const fetchUser = async () => {
    try {
      const response = await fetch("https://checkkonproject-sub.com/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

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

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubMenuOpen = (keys) => {
    setOpenKeys(keys);
  };
  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label} {text}
    </Typography>
  );
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        width={250}
        style={{ background: "#fff" }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={handleSubMenuOpen}
        >
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link to="/Admin">{createTypography("Admin Dashboard")}</Link>
          </Menu.Item>

          <Menu.ItemGroup
            key="sub1"
            title={createTypography("จัดการคอนเทนต์")}
            icon={<FormOutlined />}
          >
            {/* <Menu.Item key="2" icon={<HomeOutlined />}>
              <Link to="/Admin/Adm_Dashboard_Menu">
                {createTypography("หน้าหลัก")}
              </Link>
            </Menu.Item> */}
            <Menu.Item key="3" icon={<MessageOutlined />}>
              <Link to="/Admin/Adm_News_Menu">
                {createTypography("ข่าวสาร")}
              </Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<BookOutlined />}>
              <Link to="/Admin/Adm_Article_Menu">
                {createTypography("บทความ")}
              </Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<CommentOutlined />}>
              <Link to="/Admin/Adm_MdShare_Menu">
                {createTypography("สื่อชวนแชร์")}
              </Link>
            </Menu.Item>
          </Menu.ItemGroup>

          {user && user.level === 1 && (
            <Menu.ItemGroup
              key="sub2"
              title={createTypography("จัดการข้อมูลเท็จ")}
              icon={<FormOutlined />}
            >
              <Menu.Item key="6" icon={<SendOutlined />}>
                <Link to="/Admin/ManageInfo">
                  {createTypography("จัดการข้อมูลรับแจ้ง")}
                </Link>
              </Menu.Item>
              <Menu.Item key="7" icon={<FileSearchOutlined />}>
                <Link to="/Admin/Manage_Fake_Info_Menu">
                  {createTypography("จัดการข้อมูลเท็จ")}
                </Link>
              </Menu.Item>
              <Menu.Item key="8" icon={<UserOutlined />}>
                <Link to="/Admin/ManageMembers">
                  {createTypography("จัดการสมาชิก")}
                </Link>
              </Menu.Item>
              <Menu.Item key="14" icon={<BarsOutlined />}>
                <Link to="/Admin/ManageValues">
                  {createTypography("จัดการค่า")}
                </Link>
              </Menu.Item>
            </Menu.ItemGroup>
          )}
        </Menu>
      </Sider>
      <Layout>
        <Content className="MainContentContainer">{children}</Content>
      </Layout>
    </Layout>
  );
};
export default AdminMenu;
