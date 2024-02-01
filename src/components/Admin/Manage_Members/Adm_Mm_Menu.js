import React, { useEffect, useState } from 'react';
import {
  EyeOutlined,
} from "@ant-design/icons";
import { Space, Card } from 'antd';
import { Table, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import AdminMenu from "../Adm_Menu";
import { Link } from "react-router-dom";

const ManageMembers = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length,
  });
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/AmUser"
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

  const columns = [
    {
      title: 'ชื่อ',
      dataIndex: 'username',
      width: '10%',
      editable: true,
    },
    {
      title: 'นามสกุล',
      dataIndex: 'lastName',
      width: '10%',
      editable: true,
    },
    {
      title: 'จังหวัด',
      dataIndex: 'province',
      width: '10%',
      editable: true,
    },
    {
      title: 'โทรศัพท์',
      dataIndex: 'vol_mem_ph_num',
      width: '10%',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '15%',
      editable: true,
    },
    {
      title: 'ยินดีรับข้่าวสาร',
      dataIndex: 'receive_ct_email',
      width: '10%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      width: '10%',
      render: (record) => (
        <Space size="middle">
          <Link to={`/Adm_Mm_Menu/Adm_Mm_View/${record.id}`}>
            <EyeOutlined style={{ fontSize: '16px', color: 'blue' }} />
          </Link>
        </Space>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => ({
    ...col,
  }));

  return (
    <AdminMenu>
      <Card className="cardsection">
        <div className="cardsectionContent">จัดการสมาชิก</div>
      </Card>
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
    </AdminMenu>
  );
};

export default ManageMembers;