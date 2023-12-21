import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm, Button, } from "antd";
import UserProfile from "../User_Comoponents/Profile_Menu";
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const NotificationHistory = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
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

  const fetchUser = async () => {
    try {
      const response = await fetch("https://fakenew-c1eaeda38e26.herokuapp.com/api/user", {
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
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://fakenew-c1eaeda38e26.herokuapp.com/api/FakeNewsInfo_request"
      );
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const filteredData = data.filter(item => item.fn_info_nameid == user.id);
          setData(filteredData);
        } else {
          console.error("Data is missing or null");
        }
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "รอตรวจสอบ";
      case 1:
        return "กำลังตรวจสอบ";
      case 2:
        return "ตรวจสอบเสร็จสิ้น";
    }
  };
  const columns = [
    {
      title: "ลำดับ",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "หัวข้อ",
      dataIndex: "fn_info_head",
      width: "45%",
      editable: true,
    },
    {
      title: "แจ้งเมื่อ",
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
      title: "สถานะ",
      dataIndex: "fn_info_status",
      width: "15%",
      render: (status) => getStatusText(status),
    },
    {
      title: "จัดการ",
      width: "15%",
      editable: true,
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/FakeNews/fninfoview/${record.id}`}>
            <EyeOutlined style={{ fontSize: '16px', color: 'blue' }} /> {/* Blue color for "ดู" */}
          </Link>
          {record.fn_info_status === 0 && (
            <>
              <Link to={`/FakeNews/edit/${record.id}`}>
                <EditOutlined style={{ fontSize: '16px', color: 'green' }} /> {/* Green color for "แก้ไข" */}
              </Link>
              <Popconfirm
                title="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?"
                onConfirm={() => handleDelete(record.id)}
                okText="ใช่"
                cancelText="ไม่"
              >
                <Button type="link">
                  <DeleteOutlined style={{ fontSize: '16px', color: 'red' }} /> {/* Red color for "ลบ" */}
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    }
  ];
  const handleDelete = (id) => {
    console.log(`ลบรายการ: ${id}`);
    fetch(`https://fakenew-c1eaeda38e26.herokuapp.com/api/FakeNewsInfo_delete/${id}`, {
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
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });
  if (!user) {
    return (
      <UserProfile>
        Loading...
      </UserProfile>
    );
  } else {
    return (
      <UserProfile>
        <div style={{ overflowX: "auto" }}>
          {" "}
          {/* Add a container with horizontal scroll */}
          <Table
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
          />
        </div>
      </UserProfile>
    );
  }
};

export default NotificationHistory;
