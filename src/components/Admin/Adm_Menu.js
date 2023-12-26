import React, { useState } from 'react';
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
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
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
const AdminMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Bill is a cat.
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AdminMenu;