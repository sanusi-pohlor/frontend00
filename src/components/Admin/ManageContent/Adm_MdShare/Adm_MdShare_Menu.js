import React, { useEffect, useState } from "react";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Space, Table, Breadcrumb, Button, Popconfirm, Switch } from "antd";
import AdminMenu from "../../Adm_Menu";
import { Link } from "react-router-dom";
import axios from "axios";

const Adm_MdShare_Menu = () => {
  const [dataSource, setDataSource] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก API
  const fetchUserInfo = async () => {
    try {
      const response = await fetch("https://fakenew-c1eaeda38e26.herokuapp.com/api/AmUser");
      if (response.ok) {
        const userData = await response.json();
        console.log("user :", userData);
        setUserInfo(userData);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);
  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };
  function getThaiMonth(month) {
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    return thaiMonths[month];
  }
  const fetchData = async () => {
    try {
      const response = await fetch("https://fakenew-c1eaeda38e26.herokuapp.com/api/Adm_MdShare_request");
      if (response.ok) {
        const data = await response.json();
        setDataSource(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, Status) => {
    try {
      const response = await axios.put(`https://fakenew-c1eaeda38e26.herokuapp.com/api/Adm_MdShare_update_status/${id}`, { status: Status });
      if (response.status === 200) {
        console.log(`อัปเดต status สำเร็จสำหรับ ID: ${id}`);
        // ทำการอัปเดต dataSource หรือ refetch ข้อมูลหากต้องการ
      } else {
        console.error(`เกิดข้อผิดพลาดในการอัปเดต status สำหรับ ID: ${id}`);
      }
    } catch (error) {
      console.error(`เกิดข้อผิดพลาดในการอัปเดต status สำหรับ ID: ${id}`, error);
    }
  };

  const handleDelete = (id) => {
    console.log(`ลบรายการ: ${id}`);
    fetch(`https://fakenew-c1eaeda38e26.herokuapp.com/api/Adm_MdShare_delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Fake News deleted successfully") {
          console.log("รายการถูกลบสำเร็จ");
          fetchData();
        } else {
          console.error("เกิดข้อผิดพลาดในการลบรายการ:", data);
        }
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการลบรายการ:", error);
      });
  };
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "ปิดเผยแพร่";
      case 1:
        return "เปิดเผยแพร่";
    }
  };
  const columns = [
    {
      title: "ลำดับ",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "รูปปก",
      dataIndex: "cover_image",
      key: "image",
      render: (cover_image) => (
        <img src={cover_image} alt="Item" style={{ maxWidth: "100px" }} />
      ),
    },
    {
      title: "ผู้ลง",
      dataIndex: "Author",
      key: "Author",
      render: (Author) => {
        const user = userInfo ? userInfo.find(user => user.id === Author) : null;
        return user ? `${user.username} ${user.lastName}` : "";
      },
    },
    {
      title: "ลงเมื่อ",
      dataIndex: "created_at",
      width: "15%",
      editable: true,
      render: (created_at) => {
        const date = new Date(created_at);
        const formattedDate = `${date.getDate()} ${getThaiMonth(date.getMonth())} ${date.getFullYear() + 543}`;
        return formattedDate;
      },
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <>
          <Space direction="vertical">
            <Switch
              checkedChildren="เปิด"
              unCheckedChildren="ปิด"
              defaultChecked={status === 1}
              onChange={(checked) => {
                const Status = checked ? 1 : 0;
                updateStatus(record.id, Status);
              }}
            />
            {/* ส่วนอื่น ๆ ของ Switch และการเปลี่ยนแปลงค่าของ status ตามต้องการ */}
          </Space>
        </>
      ),
    },
    {
      title: "จัดการ",
      width: "15%",
      editable: true,
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/Admin/Adm_MdShare_View/${record.id}`}>
            <EyeOutlined style={{ fontSize: '16px', color: 'blue' }} />
          </Link>
          {record.status === 0 && (
            <>
              <Link to={`/Admin/Adm_MdShare/edit/${record.id}`}>
                <EditOutlined style={{ fontSize: '16px', color: 'green' }} />
              </Link>
              <Popconfirm
                title="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?"
                onConfirm={() => handleDelete(record.id)}
                okText="ใช่"
                cancelText="ไม่"
              >
                <Button type="link">
                  <DeleteOutlined style={{ fontSize: '16px', color: 'red' }} />
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AdminMenu>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>จัดการคอนเท็นหน้าข่าว</h1>
        <div>
          <Link to="/Admin/Adm_MdShare_Form">
            <Button
              type="primary"
              shape="round"
              icon={<PlusCircleOutlined />}
              size="large"
            >
              เพิ่มข่าว
            </Button>
          </Link>
        </div>
      </div>
      <br />
      <Table dataSource={dataSource} columns={columns} />
    </AdminMenu>
  );
};

export default Adm_MdShare_Menu;
