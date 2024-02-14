import React, { useEffect, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Space,Button, Card } from "antd";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AdminMenu from "../Adm_Menu";
import { Link } from "react-router-dom";

const ManageMembers = () => {
  const [data, setData] = useState([]);
  const [province, setProvince] = useState([]);
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
        console.log("user :",data);
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

  const columns = [
    {
      title: "ลำดับ",
      width: "5%",
      render: (text, record, index) => data.indexOf(record) + 1,
    },
    {
      title: "ชื่อ",
      dataIndex: "username",
      width: "10%",
      editable: true,
    },
    {
      title: "นามสกุล",
      dataIndex: "lastName",
      width: "10%",
      editable: true,
    },
    {
      title: "จังหวัด",
      dataIndex: "province",
      width: "10%",
      render: (fn_info_province) => {
        const provinceData = province.find(
          (item) => item.id === fn_info_province
        );
        return provinceData ? provinceData.prov_name : "ไม่พบข้อมูล";
      },
    },
    {
      title: "จัดการ",
      editable: true,
      width: "10%",
      render: (text,record) => (
        <Space size="middle">
          <Link to={`/Admin/ManageMembers/ManageMembers_View/${record.id}`}>
          <Button
              icon={
                <EyeOutlined style={{ fontSize: "16px", color: "blue" }} />
              }
            />
          </Link>
        </Space>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => ({ ...col }));

  return (
    <AdminMenu>
      <Card className="cardsection">
        <div className="cardsectionContent">จัดการสมาชิก</div>
      </Card>
      <br/>
      <Card>
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
            {data.map((row) => (
              <TableRow key={row.id}>
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
          </Table>
        </TableContainer>
      </Card>
    </AdminMenu>
  );
};

export default ManageMembers;
