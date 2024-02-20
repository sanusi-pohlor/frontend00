import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  Modal,
  Space,
  Card,
} from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
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

const MC_ProblemManagement = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [fakeNewsInfo, setFakeNewsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const fetchFakeNewsInfo = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Manage_Fake_Info_request"
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
        "https://checkkonproject-sub.com/api/ProblemManagement_request"
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

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("prob_m_way", values.prob_m_way);
      const response = await fetch(
        "https://checkkonproject-sub.com/api/ProblemManagement_upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Form data sent successfully");
        fetchData();
      } else {
        message.error("Error sending form data");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      message.error("Error sending form data");
    } finally {
      setLoading(false);
    }
  };

  const onFinishEdit = async (values, id) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("prob_m_way", values.prob_m_way);

      const response = await fetch(
        `https://checkkonproject-sub.com/api/ProblemManagement_update/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        message.success("Form data updated successfully");
        setEditingKey("");
        setEditRecord(null);
        fetchData();
      } else {
        message.error("Error updating form data");
      }
    } catch (error) {
      console.error("Error updating form data:", error);
      message.error("Error updating form data");
    } finally {
      setLoading(false);
    }
  };

  const isEditing = (record) => record.key === editingKey;

  const editRow = (record) => {
    form.setFieldsValue({
      prob_m_way: record.prob_m_way,
    });
    setEditingKey(record.id);
    setEditRecord(record);
  };
  const add = () => {
    form.setFieldsValue({
      prob_m_way: null,
    });
  };

  const cancelEdit = () => {
    setEditingKey("");
    setEditRecord(null);
  };

  const handleDelete = async (id) => {
    try {
      const filteredItems = fakeNewsInfo.filter((item) => item.mfi_moti === id);
      if (filteredItems.length > 0) {
        message.error("ไม่สามารถลบข้อมูลได้ เนื่องจากมีการใช้ข้อมูลนี้อยู่");
      } else {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/ProblemManagement_delete/${id}`,
          {
            method: "DELETE",
          }
        );
        const responseData = await response.json();

        if (
          response.ok &&
          responseData === "ProblemManagement deleted successfully"
        ) {
          console.log("ProblemManagement deleted successfully");
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
      title: "วิธีการจัดการ",
      dataIndex: "prob_m_way",
      width: "60%",
      editable: true,
    },
    {
      title: "จัดการ",
      width: "10%",
      render: (text, record) => (
        <Space size="middle">
          <>
            <Button
              onClick={() => editRow(record)}
              icon={
                <EditOutlined style={{ fontSize: "16px", color: "green" }} />
              }
            />
            <Popconfirm
              title="คุณแน่ใจหรือไม่ที่จะยกเลิกการแก้ไข?"
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
          </>
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
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
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
    <div>
      <Card className="cardsection">
        <div className="cardsectionContent">
          จัดการประเภทการกระทำ
          <Button
            className="buttonfilterStyle"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              add();
              setModalVisible(true);
            }}
            style={{ marginBottom: 16 }}
          >
            เพิ่มประเภทการกระทำ
          </Button>
        </div>
      </Card>
      <br />
      <Modal
        title="เพิ่มประเภทการกระทำ"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          name="member_form"
          onFinish={onFinish}
        >
          <Form.Item
            name="prob_m_way"
            label="วิธีการจัดการ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              เพิ่ม
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="แก้ไขวิธีการจัดการ"
        open={!!editRecord}
        onCancel={cancelEdit}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          name="member_form"
          onFinish={(values) => onFinishEdit(values, editRecord.id)}
        >
          <Form.Item
            name="prob_m_way"
            label="วิธีการจัดการ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="form-button">
              เพิ่ม
            </Button>
          </Form.Item>
        </Form>
      </Modal>
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
    </div>
  );
};
export default MC_ProblemManagement;
