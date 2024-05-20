import React, { useEffect, useState } from "react";
import { SearchOutlined,DeleteOutlined, EyeOutlined, CheckOutlined } from "@ant-design/icons";
import { Input,Popconfirm, Space, Button, Card, message, Modal, Form, Select } from "antd";
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
import AdminMenu from "../Adm_Menu";
import { Link } from "react-router-dom";
const rowsPerPageOptions = [10];
const { Option } = Select;
const ManageMembers = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [province, setProvince] = useState([]);
  const [fakeNewsInfo, setFakeNewsInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event) => setSearchTerm(event.target.value);
  const filtered = data.filter((item) => {
    const usernameMatch = String(item.username).toLowerCase().includes(searchTerm.toLowerCase());
    const lastNameMatch = String(item.lastName).toLowerCase().includes(searchTerm.toLowerCase());
    return usernameMatch || lastNameMatch;
  });
  
  

  const showModal = (id) => {
    setIsModalOpen(true);
    setSelectedRecordId(id);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const fetchFakeNewsInfo = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/FakeNewsInfo_request"
      );
      if (response.ok) {
        const data = await response.json();
        setFakeNewsInfo(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
    fetchFakeNewsInfo();
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

  const handleDelete = async (id) => {
    try {
      const filteredItems = fakeNewsInfo.filter(
        (item) => item.fn_info_nameid === id
      );
      if (filteredItems.length > 0) {
        message.error("ไม่สามารถลบข้อมูลได้ เนื่องจากมีการใช้ข้อมูลนี้อยู่");
      } else {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/User_delete/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          message.success("Item deleted successfully");
          fetchData();
        } else {
          message.error("Error deleting item");
        }
      }
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  const handleAdd = async (values) => {
    try {
      if (!selectedRecordId || !values || !values.status) {
        message.error("กรุณาเลือกระดับสมาชิก!");
        return;
      }
      const formData = new FormData();
      formData.append("status", values.status);
      const response = await fetch(`https://checkkonproject-sub.com/api/User_updatestatus/${selectedRecordId}`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        message.success("ยืนยันสมาชิกเรียบร้อย");
        fetchData();
        setIsModalOpen(false);
      } else {
        message.error("Error updating item");
      }
    } catch (error) {
      console.error("Error updating item:", error.message);
    }
  };

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
      render: (text, record) => (
        <Space size="middle">
          {record.level === 0 && (
            <Button
              icon={<CheckOutlined style={{ fontSize: "16px", color: "green" }} />}
              onClick={() => showModal(record.id)}
            />
          )}
          <Modal title="กำหนดระดับสมาชิก" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <Form
              form={form}
              layout="vertical"
              name="member_form"
              onFinish={handleAdd}
            >
              <Form.Item
                name="status"
                label="ระดับสมาชิก"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกระดับสมาชิก!",
                  },
                ]}
              >
                <Select
                  allowClear
                >
                  <Option value="3">สมาชิกปกติ</Option>
                  <Option value="2">สมาชิก Editor</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="form-button">
                  เพิ่ม
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Link to={`/Admin/ManageMembers/ManageMembers_View/${record.id}`}>
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

  const mergedColumns = columns.map((col) => ({ ...col }));

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
        <div className="cardsectionContent">จัดการสมาชิก
        <div className="searchContainer">
              <Input
                type="text"
                size="large"
                placeholder="ค้นหา"
                style={{ marginRight: "10px" }}
                onChange={handleSearch}
                prefix={<SearchOutlined className="site-form-item-icon" />}
              />
            </div>
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
                ? filtered.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                : filtered
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
