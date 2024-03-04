import React, { useEffect, useState,useCallback  } from "react";
import { Space, Popconfirm, Button,message} from "antd";
import UserProfile from "../User_Comoponents/Profile_Menu";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableBody,
  TablePagination,
} from "@mui/material";
import axios from 'axios';
const rowsPerPageOptions = [10];

const NotificationHistory = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [datamanage, setDatamanage] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length,
  });

  const getThaiMonth = (month) => {
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
  };

  const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://checkkonproject-sub.com/api/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (response.status === 200) {
          const data = response.data;
          setUser(data);
        } else {
          console.error("User data retrieval failed");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://checkkonproject-sub.com/api/FakeNewsInfo_request"
      );
      if (response.status === 200) {
        const data = response.data;
        if (data) {
          const filteredData = data.filter(
            (item) => item.fn_info_nameid === user.id
          );
          const sortedData = filteredData.slice().sort((a, b) => b.id - a.id);
          setData(sortedData);
        } else {
          console.error("Data is missing or null");
        }
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [user, setData]);
  
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);
  
  const fetchData_Manage = async () => {
    try {
      const response = await axios.get(
        "https://checkkonproject-sub.com/api/mfi_menu_request"
      );
      if (response.status === 200) {
        const data = response.data;
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
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "รอตรวจสอบ";
      case 1:
        return "กำลังตรวจสอบ";
      case 2:
        return "ตรวจสอบเสร็จสิ้น";
      default:
        return "";
    }
  };

  const renderResultText = (id) => {
    const dataA = datamanage
      ? datamanage.find((item) => item.mfi_fninfo === id)
      : null;
    const resultText = dataA
      ? dataA.mfi_results === 0
        ? "ข่าวเท็จ"
        : dataA.mfi_results === 1
        ? "ข่าวจริง"
        : "รอตรวจสอบ"
      : "ยังไม่ตรวจสอบ";
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
        const formattedDate = `${date.getDate()} ${getThaiMonth(
          date.getMonth()
        )} ${date.getFullYear() + 543}`;
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
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/FakeNews/fninfoview/${record.id}`}>
            <Button
              icon={<EyeOutlined style={{ fontSize: "16px", color: "blue" }} />}
            />
          </Link>
          {record.fn_info_status === 0 && (
            <>
              <Link to={`/FakeNews/edit/${record.id}`}>
                <Button
                  icon={
                    <EditOutlined
                      style={{ fontSize: "16px", color: "green" }}
                    />
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
                    <DeleteOutlined
                      style={{ fontSize: "16px", color: "red" }}
                    />
                  }
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleDelete = (id) => {
    axios.delete(`https://checkkonproject-sub.com/api/FakeNewsInfo_delete/${id}`)
      .then((response) => {
        if (response.status === 200) {
          message.success("ลบข้อมูลเสร็จสิ้น");
          fetchData();
        } else {
          console.error("เกิดข้อผิดพลาดในการลบรายการ:", data);
        }
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการลบรายการ:", error);
      });
  };

  const mergedColumns = columns.map((col) => ({ ...col }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!user) {
    return <UserProfile>Loading...</UserProfile>;
  } else {
    return (
      <UserProfile>
        <br/>
        <Typography variant="h3" gutterBottom sx={{ color: "#000000" }}>
          ประวัติการแจ้งข้อมูล
        </Typography>
        <TableContainer>
          <Table
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
          >
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
                        fontSize: "25px",
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
                  {mergedColumns.map((column, colIndex) => (
                    <TableCell key={`${rowIndex}-${colIndex}`} align="left" style={{ fontSize: "25px" }}>
                    {column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex]}
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
      </UserProfile>
    );
  }
};

export default NotificationHistory;
