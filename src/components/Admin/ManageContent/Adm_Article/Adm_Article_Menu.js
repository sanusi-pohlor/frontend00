import React, { useEffect, useState } from "react";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Space, Card, Button, Popconfirm, Switch,Image } from "antd";
import AdminMenu from "../../Adm_Menu";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  TableBody,
} from "@mui/material";
const rowsPerPageOptions = [10];

const Adm_Article_Menu = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
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
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Adm_Article_request"
      );
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.slice().sort((a, b) => b.id - a.id);
        setData(sortedData);
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

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `https://checkkonproject-sub.com/api/Adm_Article_update_status/${id}`,
        { status }
      );
      if (response.status === 200) {
        console.log(`อัปเดต status สำเร็จสำหรับ ID: ${id}`);
      } else {
        console.error(`เกิดข้อผิดพลาดในการอัปเดต status สำหรับ ID: ${id}`);
      }
    } catch (error) {
      console.error(`เกิดข้อผิดพลาดในการอัปเดต status สำหรับ ID: ${id}`, error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/Adm_Article_delete/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Item deleted successfully");
        fetchData();
      } else {
        console.error("Error deleting item:", data);
      }
    } catch (error) {
      console.error("Error deleting item:", error.message);
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
      dataIndex: "title",
      key: "title",
    },
    {
      title: "รูปปก",
      dataIndex: "cover_image",
      key: "image",
      render: (cover_image) => (
        <Image src={cover_image} alt="Item" style={{ maxWidth: "100px" }} />
      ),
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
      title: "สถานะ",
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
          <Link to={`/Admin/Adm_Article_View/${record.id}`}>
            <Button
              icon={
                <EyeOutlined style={{ fontSize: "16px", color: "blue" }} />
              }
            />
          </Link>
          <Link to={`/Admin/Adm_Article_edit/${record.id}`}>
            <Button
              icon={
                <EditOutlined style={{ fontSize: "16px", color: "green" }} />
              }
            />
          </Link>
          <Popconfirm
            title="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?"
            onConfirm={() => handleDelete(record.id)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button
              icon={
                <DeleteOutlined style={{ fontSize: "16px", color: "red" }} />
              }
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => ({
    ...col,
  }));

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
          จัดการบทความ
          <Link to="/Admin/Adm_Article_Form">
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              className="buttonfilterStyle"
            >
              จัดการบทความ
            </Button>
          </Link>
        </div>
      </Card>
      <br />
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ background: "#7BBD8F" }}>
                {mergedColumns.map((column) => (
                  <TableCell
                    key={column.title}
                    align="left"
                    width={column.width}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "30px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {column.title}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? data.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                : data
              ).map((row, rowIndex) => (
                <TableRow key={row.id} hover>
                  {mergedColumns.map((column) => (
                    <TableCell key={column.title} align="left">
                      <Typography variant="body1" sx={{ fontSize: "25px" }}>
                        {column.render
                          ? column.render(row[column.dataIndex], row)
                          : row[column.dataIndex]}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
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
        </TableContainer>
      </Card>
    </AdminMenu>
  );
};

export default Adm_Article_Menu;
