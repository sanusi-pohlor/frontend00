import React, { useEffect, useState } from "react";
import { Form, Button, Popconfirm, Space, Card } from "antd";
import { TableContainer, Table, TableHead, TableRow, TableCell, Typography, TablePagination, TableBody } from "@mui/material";
import AdminMenu from "../Adm_Menu";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const rowsPerPageOptions = [10];


const Manage_Fake_Info_Menu = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [province, setProvince] = useState([]);
  
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
        "https://checkkonproject-sub.com/api/Manage_Fake_Info_request"
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

  const Province = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Province_request"
      );
      if (response.ok) {
        const data = await response.json();
        setProvince(data);
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

  const handleDelete = (id) => {
    console.log(`ลบรายการ: ${id}`);
    fetch(
      `https://checkkonproject-sub.com/api/Manage_Fake_Info_delete/${id}`,
      {
        method: "DELETE",
      }
    )
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
      render: (text, record, index) => data.indexOf(record) + 1,
    },
    {
      title: "หัวข้อ",
      dataIndex: "",
      width: "30%",
      editable: true,
    },
    {
      title: "จังหวัดของผู้แจ้ง",
      dataIndex: "mfi_province",
      width: "10%",
      render: (mfi_province) => {
        const provinceId = parseInt(mfi_province, 10);
        const provinceData = province.find((item) => item.id === provinceId);
        return provinceData ? provinceData.prov_name : "ไม่พบข้อมูล";
      },
    },
    {
      title: "ผู้ตรวจสอบ",
      dataIndex: "mfi_mem",
      width: "10%",
      render: (fn_info_nameid) => {
        const user = userInfo
          ? userInfo.find((user) => user.id === fn_info_nameid)
          : null;
        return user ? `${user.username} ${user.lastName}` : "";
      },
    },
    {
      title: "ตรวจเมื่อ",
      dataIndex: "mfi_time",
      width: "10%",
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
      title: "สถานะการตรวจสอบ",
      dataIndex: "mfi_status",
      width: "10%",
      render: (status) => getStatusText(status),
    },
    {
      title: "ผลการตรวจสอบ",
      dataIndex: "mfi_results",
      width: "10%",
      render: (mfi_results) => (
        mfi_results === 0 ? "ข่าวเท็จ" : (mfi_results === 1 ? "ข่าวจริง" : "กำลังตรวจสอบ")
      )
    },
    {
      title: "จัดการ",
      width: "5%",
      editable: true,
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/Admin/Manage_Fake_Info_View/${record.id}`}>
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <AdminMenu>
      <Card className="cardsection">
        <div className="cardsectionContent">
          จัดการข้อมูลเท็จ
        </div>
      </Card>
      <Card
        className="cardContent"
      >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow style={{ background: "#7BBD8F" }}>
              {columns.map((column) => (
                <TableCell key={column.title} align="left" width={column.width}>
                  <Typography variant="body1" sx={{ fontSize: "25px", color: "white", fontWeight: "bold" }}>{column.title}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : data
            ).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={`${rowIndex}-${colIndex}`} align="left">
                    <Typography variant="body1" sx={{ fontSize: "20px" }}>
                      {column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex]}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}</TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer></Card>
    </AdminMenu>
  );
};

export default Manage_Fake_Info_Menu;
