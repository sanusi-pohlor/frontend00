import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Button,
  Popconfirm,
  Space,
  Breadcrumb,
} from "antd";
import AdminMenu from "../Adm_Menu";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Manage_Fake_Info_Menu = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("https://fakenews001-392577897f69.herokuapp.com/api/AmUser");
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
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/Manage_Fake_Info_request"
      );
      if (response.ok) {
        const data = await response.json();
        setData(data);
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

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };


  const handleDelete = (id) => {
    console.log(`ลบรายการ: ${id}`);
    fetch(`https://fakenews001-392577897f69.herokuapp.com/api/Manage_Fake_Info_delete/${id}`, {
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
      title: "แจ้งเมื่อ",
      dataIndex: "mfi_time",
      width: "15%",
      editable: true,
      render: (mfi_time) => {
        const date = new Date(mfi_time);
        const formattedDate = `${date.getDate()} ${getThaiMonth(
          date.getMonth()
        )} ${date.getFullYear() + 543}`;
        return formattedDate;
      },
    },
    {
      title: "จังหวัดของท่าน",
      dataIndex: "mfi_province",
      width: "10%",
      editable: true,
    },
    {
      title: "ผู้ส่งรายงาน",
      dataIndex: "mfi_mem",
      width: "10%",
      render: (fn_info_nameid) => {
        const user = userInfo ? userInfo.find((user) => user.id === fn_info_nameid) : null;
        return user ? `${user.username} ${user.lastName}` : "";
      },
    },
    {
      title: "เพิ่มเมื่อ",
      dataIndex: "created_at",
      width: "15%",
      editable: true,
      render: (created_at) => {
        const date = new Date(created_at);
        const formattedDate = `${date.getDate()} ${getThaiMonth(
          date.getMonth()
        )} ${date.getFullYear() + 543}`;
        return formattedDate;
      },
    },
    {
      title: "สถานะ",
      dataIndex: "mfi_status",
      width: "15%",
      render: (status) => getStatusText(status),
    },
    {
      title: "จัดการ",
      width: "15%",
      editable: true,
      render: (text, record) => (
        <Space size="middle">
          <Link
            to={`/Admin/Manage_Fake_Info_View/${record.id}`}
          >
            <EyeOutlined style={{ fontSize: "16px", color: "blue" }} />
          </Link>
          {record.status === 0 && (
            <>
              <Link to={`/Admin/Manage_Fake_Info/edit/${record.id}`}>
                <EditOutlined style={{ fontSize: "16px", color: "green" }} />
              </Link>
              <Popconfirm
                title="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?"
                onConfirm={() => handleDelete(record.id)}
                okText="ใช่"
                cancelText="ไม่"
              >
                <Button type="link">
                  <DeleteOutlined style={{ fontSize: "16px", color: "red" }} />
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "vol_mem_id" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <AdminMenu>
      <h1>จัดการข้อมูลเท็จ</h1>
      <Table
        components={{
          body: {
            //cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        //loading={loading}
        pagination={{
          onChange: cancel,
        }}
      />
    </AdminMenu>
  );
};

export default Manage_Fake_Info_Menu;
