import React, { useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  PieChartOutlined,
  FormOutlined,
  HomeOutlined,
  FileAddOutlined,
  BookOutlined,
  CommentOutlined,
  SendOutlined,
  FileSearchOutlined,
  BarsOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, FloatButton } from "antd";
import { Link, useLocation } from "react-router-dom";
const { Content, Sider } = Layout;
const items = [
  { key: "sub1", icon: <PieChartOutlined />, label: "Admin Dashboard", link: "M_DB_Adm_Menu", },
  {
    key: "sub2",
    icon: <FormOutlined />,
    label: "จัดการคอนเทนต์",
    children: [
      { key: "1", icon: <HomeOutlined />, label: "หน้าหลัก", link: "Adm_Dashboard_Menu" },
      { key: "2", label: "ข่าวสาร", icon: <MessageOutlined />, link: "Adm_News_Menu" },
      { key: "3", label: "บทความ", icon: <BookOutlined />, link: "Adm_Article_Menu" },
      { key: "4", label: "สื่อชวนแชร์", icon: <CommentOutlined />, link: "Adm_MdShare_Menu" },
    ],
  },
  { key: "sub3", icon: <SendOutlined />, label: "จัดการข้อมูลรับแจ้ง", link: "ManageInfo", },
  { key: "sub4", icon: <FileSearchOutlined />, label: "จัดการข้อมูลเท็จ", link: "Manage_Fake_Info_Menu", },
  { key: "sub5", icon: <UserOutlined />, label: "จัดการสมาชิก", link: "ManageMembers", },
  {
    key: "sub6",
    icon: <NotificationOutlined />,
    label: "จัดการหมวดหมู่ข้อมูลเท็จ",
    children: [
      { key: "1", label: "สื่อ", icon: <FileAddOutlined />, link: "MMedia" },
      { key: "2", label: "ประเภท", icon: <FileAddOutlined />, link: "MType" },
      { key: "3", label: "ข้อมูลที่แจ้ง", icon: <FileAddOutlined />, link: "MInformation" },
      { key: "4", label: "การตรวจสอบ", icon: <FileAddOutlined />, link: "MChecking" },
      { key: "5", label: "การจัดการปัญหา", icon: <FileAddOutlined />, link: "MProblem" },
    ],
  },
  { key: "sub7", icon: <BarsOutlined />, label: "จัดการค่า", link: "ManageValues", },
  { key: "sub8", icon: <LaptopOutlined />, label: "ค้นหาขั้นสูง", link: "AdvancedSearch", },
];

const AdminMenu = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div>
      <Layout>
        <Sider
          collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
          width={300}
          style={{ background: colorBgContainer }}
          breakpoint="lg"
          collapsedWidth={0}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
            sx={{
              my: 2,
              fontSize: "20px",
              //color: items.link === location.pathname ? "#7BBD8F" : "grey",
              //display: "block",
              mr: 5,
            }}
          >
            {items.map((item) => {
              if (item.children) {
                return (
                  <Menu.SubMenu
                    key={item.key}
                    icon={item.icon}
                    title={item.label}
                    style={{
                      fontSize: "17px",
                      // color:
                      //   item.link === location.pathname ? "#7BBD8F" : "grey",
                    }}
                  >
                    {item.children.map((child) => (
                      <Menu.Item
                        key={child.key}
                        icon={child.icon}
                        style={{
                          // color:
                          //   child.link === location.pathname
                          //     ? "#7BBD8F"
                          //     : "grey",
                          height: "100%",
                          borderRight: 0,
                          fontSize: "17px"
                        }}
                      >
                        <Link to={`/Admin/${child.link}`}>{child.label}</Link>
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>
                );
              } else {
                return (
                  <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    style={{
                      fontSize: "17px",
                      // color:
                      //   item.link === location.pathname ? "#7BBD8F" : "grey",
                    }}
                  >
                    <Link to={`/Admin/${item.link}`}>{item.label}</Link>
                  </Menu.Item>
                );
              }
            })}
          </Menu>
        </Sider>
        <Layout style={{ padding: "24px 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
      <FloatButton.BackTop />
    </div>
  );
};

export default AdminMenu;
