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
  Select,
  DatePicker,
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
const { Option } = Select;
const rowsPerPageOptions = [10];

const MC_DetailsNotiChannels = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [fakeNewsInfo, setFakeNewsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [selectOptions_info, setSelectOptions_info] = useState([]);
  const [selectOptions_pub, setSelectOptions_pub] = useState([]);
  const [selectOptions_fm_d, setSelectOptions_fm_d] = useState([]);
  const [selectOptions_prob, setSelectOptions_prob] = useState([]);

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
        "https://checkkonproject-sub.com/api/DetailsNotiChannels_request"
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
    console.log(values);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("dnc_med_id", values.dnc_med_id);
      formData.append("dnc_info_id", values.dnc_info_id);
      formData.append("dnc_pub_id", values.dnc_pub_id);
      formData.append("dnc_fm_d_id", values.dnc_fm_d_id);
      formData.append("dnc_prob_id", values.dnc_prob_id);
      formData.append("dnc_scop_pub", values.dnc_scop_pub);
      formData.append("dnc_num_mem_med", values.dnc_num_mem_med);
      formData.append("dnc_date_med", values.dnc_date_med);
      formData.append("dnc_capt", values.dnc_capt);
      formData.append("dnc_link", values.dnc_link);
      console.log(formData);
      const response = await fetch(
        "https://checkkonproject-sub.com/api/DetailsNotiChannels_upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Form data sent successfully");
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
      formData.append("moti_name", values.moti_name);

      const response = await fetch(
        `https://checkkonproject-sub.com/api/Motivation_update/${id}`,
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
      moti_name: record.moti_name,
    });
    setEditingKey(record.id);
    setEditRecord(record);
  };
  const add = () => {
    form.setFieldsValue({
      moti_name: null,
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
          `https://checkkonproject-sub.com/api/Motivation_delete/${id}`,
          {
            method: "DELETE",
          }
        );
        const responseData = await response.json();

        if (response.ok && responseData === "Motivation deleted successfully") {
          console.log("Motivation deleted successfully");
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
      title: "รหัสช่องทางสื่อ",
      dataIndex: "dnc_med_id",
      width: "60%",
      editable: true,
    },
    {
      title: "รหัสการแจ้ง",
      dataIndex: "dnc_info_id",
      width: "60%",
      editable: true,
    },
    {
      title: "รหัสผู้เผยแพร",
      dataIndex: "dnc_pub_id",
      width: "60%",
      editable: true,
    },
    {
      title: "รหัสรูปแบบข้อมูล",
      dataIndex: "dnc_fm_d_id",
      width: "60%",
      editable: true,
    },
    {
      title: "รหัสการจัดการ",
      dataIndex: "dnc_prob_id",
      width: "60%",
      editable: true,
    },
    {
      title: "ขอบเขตการเผยแพร",
      dataIndex: "dnc_scop_pub",
      width: "60%",
      editable: true,
    },
    {
      title: "จำนวนสมาชิกในกลุ่มที่อยู่ในสื่อ",
      dataIndex: "dnc_num_mem_med",
      width: "60%",
      editable: true,
    },
    {
      title: "วันที่ในสื่อ",
      dataIndex: "dnc_date_med",
      width: "60%",
      editable: true,
    },
    {
      title: "ภาพ capture",
      dataIndex: "dnc_capt",
      width: "60%",
      editable: true,
    },
    {
      title: "Link URL",
      dataIndex: "dnc_link",
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

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/${endpoint}`
      );
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code[`${fieldName}_id`]} value={code[`${fieldName}_id`]}>
            {code[`${fieldName}_name`]}
          </Option>
        ));
        form.setFieldsValue({ [fieldName]: undefined });
        form.setFields([
          {
            name: fieldName,
            value: undefined,
          },
        ]);
        stateSetter(options);
      } else {
        console.error(
          `Error fetching ${fieldName} codes:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error fetching ${fieldName} codes:`, error);
    }
  };

  const onChange_dnc_med_id = () => {
    fetchDataAndSetOptions(
      "MediaChannels_request",
      "med_c",
      setSelectOptions_med
    );
  };

  const onChange_dnc_info_id = () => {
    fetchDataAndSetOptions(
      "Information_request",
      "info",
      setSelectOptions_info
    );
  };

  const onChange_dnc_pub_id = () => {
    fetchDataAndSetOptions("Publisher_request", "pub", setSelectOptions_pub);
  };

  const onChange_dnc_fm_d_id = () => {
    fetchDataAndSetOptions("FormatData_request", "fm_d", setSelectOptions_fm_d);
  };

  const onChange_dnc_prob_id = () => {
    fetchDataAndSetOptions(
      "ProblemManagement_request",
      "prob_m",
      setSelectOptions_prob
    );
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    onChange_dnc_med_id();
    onChange_dnc_info_id();
    onChange_dnc_pub_id();
    onChange_dnc_fm_d_id();
    onChange_dnc_prob_id();
  }, []);
  return (
    <div>
      <Card className="cardsection">
        <div className="cardsectionContent">
          จัดการช่องทางสื่อ
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
            เพิ่มช่องทางสื่อ
          </Button>
        </div>
      </Card>
      <br />
      <Modal
        title="เพิ่มช่องทางสื่อ"
        visible={modalVisible}
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
            name="dnc_med_id"
            label="ช่องทางสื่อ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_med_id}
              allowClear
            >
              {selectOptions_med}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_info_id"
            label="รหัสการแจ้ง"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_info_id}
              allowClear
            >
              {selectOptions_info}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_pub_id"
            label="รหัสผู้เผยแพร"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_pub_id}
              allowClear
            >
              {selectOptions_pub}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_fm_d_id"
            label="รหัสรูปแบบข้อมูล"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_fm_d_id}
              allowClear
            >
              {selectOptions_fm_d}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_prob_id"
            label="รหัสการจัดการ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_prob_id}
              allowClear
            >
              {selectOptions_prob}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_scop_pub"
            label="ขอบเขตการเผยแพร"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dnc_num_mem_med"
            label="จำนวนสมาชิกในกลุ่มที่อยู่ในสื่อ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dnc_date_med"
            label="วันที่ในสื่อ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="dnc_capt"
            label="ภาพ capture"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dnc_link"
            label="Link URL"
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
        title="แก้ไขช่องทางสื่อ"
        visible={modalVisible}
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
            name="dnc_med_id"
            label="ช่องทางสื่อ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_med_id}
              allowClear
            >
              {selectOptions_med}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_info_id"
            label="รหัสการแจ้ง"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_info_id}
              allowClear
            >
              {selectOptions_info}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_pub_id"
            label="รหัสผู้เผยแพร"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_pub_id}
              allowClear
            >
              {selectOptions_pub}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_fm_d_id"
            label="รหัสรูปแบบข้อมูล"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_fm_d_id}
              allowClear
            >
              {selectOptions_fm_d}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_prob_id"
            label="รหัสการจัดการ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_prob_id}
              allowClear
            >
              {selectOptions_prob}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_scop_pub"
            label="ขอบเขตการเผยแพร"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dnc_num_mem_med"
            label="จำนวนสมาชิกในกลุ่มที่อยู่ในสื่อ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dnc_date_med"
            label="วันที่ในสื่อ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="dnc_capt"
            label="ภาพ capture"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dnc_link"
            label="Link URL"
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
export default MC_DetailsNotiChannels;
