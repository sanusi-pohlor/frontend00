import React, { useEffect, useState } from "react";
import { Table, Space, Breadcrumb } from "antd";
import AdminMenu from "../Adm_Menu";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const ManageMembers = () => {
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [province, setProvince] = useState([]);
  const [datamanage, setDatamanage] = useState([]);
  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/AmUser"
      );
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
    fetchUserInfo();
    fetchData_Manage();
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
        "https://checkkonproject-sub.com/api/ManageInfo_request"
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

  const Province = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Province_request"
      );
      if (response.ok) {
        const pv = await response.json();
        setProvince(pv);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    Province();
  }, [data]);

  const isEditing = (record) => record.key === editingKey;

  const cancel = () => {
    setEditingKey("");
  };
  const getStatusText = (status) => {
    // Define your logic to map status values to text here
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
    const resultText = dataA ? (dataA.mfi_results === 0 ? "ข่าวเท็จ" : (dataA.mfi_results === 1 ? "ข่าวจริง" : "ไม่พบ")) : "ไม่พบข้อมูล";
    console.log("resultText ", id);
    return resultText;
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
      width: "30%",
      editable: true,
    },
    {
      title: "ชื่อผู้แจ้ง",
      dataIndex: "fn_info_nameid",
      width: "10%",
      render: (fn_info_nameid) => {
        const user = userInfo
          ? userInfo.find((user) => user.id === fn_info_nameid)
          : null;
        return user ? `${user.username} ${user.lastName}` : "";
      },
    },
    {
      title: "จังหวัด",
      dataIndex: "fn_info_province",
      width: "10%",
      render: (fn_info_province) => {
        const provinceData = province.find((item) => item.id === fn_info_province);
        return provinceData ? provinceData.prov_name : "ไม่พบข้อมูล"; // แก้ไขให้ระบุข้อความเมื่อไม่พบข้อมูล
      },
    },    
    {
      title: "แจ้งเมื่อ",
      dataIndex: "created_at",
      width: "10%",
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
      dataIndex: "fn_info_status",
      width: "10%",
      render: (status) => getStatusText(status),
    },
    {
      title: "ผลการตรวจสอบ",
      dataIndex: "id",
      width: "10%",
      render: (id) => renderResultText(id),
    },
    {
      title: "จัดการ",
      width: "5%",
      editable: true,
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/Admin/ManageInfo/ManageInfo_view/${record.id}`}>
            <EyeOutlined style={{ fontSize: "16px", color: "blue" }} />{" "}
            {/* Blue color for "ดู" */}
          </Link>
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>จัดการข้อมูลรับแจ้ง</h1>
      </div>
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
        pagination={{
          onChange: cancel,
        }}
      />
    </AdminMenu>
  );
};

export default ManageMembers;
