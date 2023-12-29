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
import { Layout, Menu, theme } from 'antd';
import { Link, useLocation } from "react-router-dom";
const { Content, Sider } = Layout;
const determineSelectedSubMenu = (pathname) => {
  if (
    pathname === '/Admin/Adm_Dashboard_Menu' ||
    pathname === '/Admin/Adm_News_Menu' ||
    pathname === '/Admin/Adm_Article_Menu' ||
    pathname === '/Admin/Adm_MdShare_Menu'
  ) {
    return 'sub1';
  } else if (
    pathname === '/Admin/MMedia' ||
    pathname === '/Admin/MType' ||
    pathname === '/Admin/MInformation' ||
    pathname === '/Admin/MChecking' ||
    pathname === '/Admin/MProblem'
  ) {
    return 'sub2';
  }
  return null;
};
const determineSelectedKey = (pathname) => {
  if (pathname === '/Admin') {
    return '1';
  } else if (pathname === '/Admin/Adm_Dashboard_Menu') {
    return '2';
  } else if (pathname === '/Admin/Adm_News_Menu') {
    return '3';
  } else if (pathname === '/Admin/Adm_Article_Menu') {
    return '4';
  } else if (pathname === '/Admin/Adm_MdShare_Menu') {
    return '5';
  } else if (pathname === '/Admin/ManageInfo') {
    return '6';
  } else if (pathname === '/Admin/Manage_Fake_Info_Menu') {
    return '7';
  } else if (pathname === '/Admin/ManageMembers') {
    return '8';
  } else if (pathname === '/Admin/MMedia') {
    return '9';
  } else if (pathname === '/Admin/MType') {
    return '10';
  } else if (pathname === '/Admin/MInformation') {
    return '11';
  } else if (pathname === '/Admin/MChecking') {
    return '12';
  } else if (pathname === '/Admin/MProblem') {
    return '13';
  } else if (pathname === '/Admin/ManageValues') {
    return '14';
  } else if (pathname === '/Admin/AdvancedSearch') {
    return '15';
  }
  return '1';
};

const AdminMenu = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const selectedKey = determineSelectedKey(location.pathname);
  const [openKeys, setOpenKeys] = useState([determineSelectedSubMenu(location.pathname)]);

  const handleSubMenuOpen = (keys) => {
    setOpenKeys(keys);
  };
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider width={250} style={{ background: '#fff' }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={handleSubMenuOpen}
        >
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link to="/Admin">Admin Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu key="sub1" title="จัดการคอนเทนต์" icon={<FormOutlined />}>
            <Menu.Item key="2" icon={<HomeOutlined />}>
              <Link to="/Admin/Adm_Dashboard_Menu" >หน้าหลัก</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<MessageOutlined />}>
              <Link to="/Admin/Adm_News_Menu">ข่าวสาร</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<BookOutlined />}>
              <Link to="/Admin/Adm_Article_Menu">บทความ</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<CommentOutlined />}>
              <Link to="/Admin/Adm_MdShare_Menu">สื่อชวนแชร์</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="6" icon={<SendOutlined />}>
            <Link to="/Admin/ManageInfo">จัดการข้อมูลรับแจ้ง</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<FileSearchOutlined />}>
            <Link to="/Admin/Manage_Fake_Info_Menu">จัดการข้อมูลเท็จ</Link>
          </Menu.Item>
          <Menu.Item key="8" icon={<UserOutlined />}>
            <Link to="/Admin/ManageMembers">จัดการสมาชิก</Link>
          </Menu.Item>
          <Menu.SubMenu key="sub2" title="จัดการหมวดหมู่ข้อมูลเท็จ" icon={<NotificationOutlined />}>
            <Menu.Item key="9" icon={<FileAddOutlined />}>
              <Link to="/Admin/MMedia" >สื่อ</Link>
            </Menu.Item>
            <Menu.Item key="10" icon={<FileAddOutlined />}>
              <Link to="/Admin/MType">ประเภท</Link>
            </Menu.Item>
            <Menu.Item key="11" icon={<FileAddOutlined />}>
              <Link to="/Admin/MInformation">ข้อมูลที่แจ้ง</Link>
            </Menu.Item>
            <Menu.Item key="12" icon={<FileAddOutlined />}>
              <Link to="/Admin/MChecking">การตรวจสอบ</Link>
            </Menu.Item>
            <Menu.Item key="13" icon={<FileAddOutlined />}>
              <Link to="/Admin/MProblem">การจัดการปัญหา</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="14" icon={<BarsOutlined />}>
            <Link to="/Admin/ManageValues">จัดการค่า</Link>
          </Menu.Item>
          <Menu.Item key="15" icon={<LaptopOutlined />}>
            <Link to="/Admin/AdvancedSearch">ค้นหาขั้นสูง</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            backgroundColor: '#f1f1f1',
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default AdminMenu;