import React, { useEffect, useState } from "react";
import { Space, Popconfirm, Button, } from "antd";
import UserProfile from "../User_Comoponents/Profile_Menu";
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { Table, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const NotificationHistory = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [datamanage, setDatamanage] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length,
  });
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
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/FakeNewsInfo_request"
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

  const fetchData_Manage = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Manage_Fake_Info_request"
      );
      if (response.ok) {
        const data = await response.json();
        setDatamanage(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData_Manage();
    console.log("mfi_results", datamanage);
  }, []);

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

  const renderResultText = (id) => {
    const dataA = datamanage ? datamanage.find((item) => item.mfi_fninfo === id) : null;
    const resultText = dataA ? (dataA.mfi_results === 0 ? "ข่าวเท็จ" : (dataA.mfi_results === 1 ? "ข่าวจริง" : "รอตรวจสอบ")) : "รอตรวจสอบ";
    console.log("resultText ", id);
    return resultText;
  };

  const columns = [
    {
      title: "ลำดับ",
      width: "5%",
      render: (text, record, index) => data.indexOf(record) + 1,
    },
    {
      title: "หัวข้อ",
      dataIndex: "fn_info_head",
      width: "35%",
      editable: true,
    },
    {
      title: "แจ้งเมื่อ",
      dataIndex: "created_at",
      width: "20%",
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
      width: "20%",
      render: (status) => getStatusText(status),
    },
    {
      title: "ผลการตรวจสอบ",
      dataIndex: "id",
      width: "20%",
      render: (id) => renderResultText(id),
    },
    {
      title: "จัดการ",
      width: "5%",
      editable: true,
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/FakeNews/fninfoview/${record.id}`}>
            <EyeOutlined style={{ fontSize: '16px', color: 'blue' }} />
          </Link>
          {record.fn_info_status === 0 && (
            <>
              <Link to={`/FakeNews/edit/${record.id}`}>
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
    }
  ];
  const handleDelete = (id) => {
    console.log(`ลบรายการ: ${id}`);
    fetch(`https://checkkonproject-sub.com/api/FakeNewsInfo_delete/${id}`, {
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
  const mergedColumns = columns.map((col) => ({
    ...col,
  }));

  if (!user) {
    return (
      <UserProfile>
        Loading...
      </UserProfile>
    );
  } else {
    return (
      <UserProfile>
        <div
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Th Sarabun New', sans-serif",
          }}
        >
          ประวัติการแจ้งข้อมูล
        </div>
        <TableContainer>
          <Table
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
          >
            <TableHead>
              <TableRow style={{ background: "#7BBD8F" }}>
                {mergedColumns.map((column) => (
                  <TableCell key={column.title} align="left" width={column.width}>
                    <Typography variant="body1" sx={{ fontSize: "25px", color: "white", fontWeight: "bold" }}>{column.title}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {data.map((row) => (
              <TableRow key={row.id} >
                {mergedColumns.map((column) => (
                  <TableCell key={column.title} align="left">
                    <Typography variant="body1" sx={{ fontSize: "20px" }}>{column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex]}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </Table>
        </TableContainer>
      </UserProfile>
    );
  }
};

export default NotificationHistory;
