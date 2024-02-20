import React, { useEffect, useState } from "react";
import { Space, Button, Popconfirm, message, Card } from "antd";
import AdminMenu from "../Adm_Menu";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TablePagination,
  TableBody,
} from "@mui/material";
const rowsPerPageOptions = [10];

const ManageMembers = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [data, setData] = useState([]);
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
        "https://checkkonproject-sub.com/api/FakeNewsInfo_request"
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

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "รอตรวจสอบ";
      case 1:
        return "กำลังตรวจสอบ";
      case 2:
        return "ตรวจสอบเสร็จสิ้น";
      default:
        return "ไม่พบสถานะ";
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
        : "ยังไม่ตรวจสอบ"
      : "ยังไม่ตรวจสอบ";
    return resultText;
  };

  const handleDelete = async (id) => {
    try {
      const filteredItems = datamanage.filter((item) => item.mfi_fninfo === id);
      if (filteredItems.length > 0) {
        message.error("ไม่สามารถลบข้อมูลได้ เนื่องจากมีการใช้ข้อมูลนี้อยู่");
      } else {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/FakeNewsInfo_delete/${id}`,
          {
            method: "DELETE",
          }
        );
        const responseData = await response.json();

        if (response.ok) {
          message.success("ลบข้อมูลเสร็จสิ้น");
          console.log("ActionType deleted successfully");
          fetchData();
        } else {
          console.error("Error deleting item:", responseData);
        }
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
        const provinceData = province.find(
          (item) => item.id === fn_info_province
        );
        return provinceData ? provinceData.prov_name : "ไม่พบข้อมูล";
      },
    },
    {
      title: "แจ้งเมื่อ",
      dataIndex: "created_at",
      width: "12%",
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
            <Button
              icon={<EyeOutlined style={{ fontSize: "16px", color: "blue" }} />}
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
      }),
    };
  });

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
        <div className="cardsectionContent">จัดการข้อมูลรับแจ้ง</div>
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

export default ManageMembers;
