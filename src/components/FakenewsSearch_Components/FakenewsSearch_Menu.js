import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, IconButton } from "@mui/material";
import {
  Card,
  Button,
  Table,
  Form,
  DatePicker,
  Modal,
  Select,
  Space,
} from "antd";
import { Link } from "react-router-dom";
import "./News_Menu.css";
import { Typography, useMediaQuery } from "@mui/material";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment";
const { Option } = Select;
const { Meta } = Card;

const FakenewsSearch_Menu = (open, onClose) => {
  const [form] = Form.useForm();
  const [province, setProvince] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [filterednew, setFilterednew] = useState([]);
  const isLargeScreen = useMediaQuery("(min-width:1300px)");
  const [dataOrg, setDataOrg] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState({ field: "created_at", order: "desc" });
  const [itemsPerPage] = useState(10);
  const curveAngle = 20;
  const [filterVisible, setFilterVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10, // Set your desired page size
    total: data.length, // Assuming 'data' is your entire dataset
  });
  const buttonStyle = {
    background: "#f1f1f1",
    border: "none",
    color: "#7BBD8F",
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Manage_Fake_Info_request"
      );
      if (response.ok) {
        const data = await response.json();
        setData(data);
        setDataOrg(data);
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
  
  const showFilterDialog = () => {
    setFilterVisible(true);
  };

  const closeFilterDialog = () => {
    setFilterVisible(false);
  };

  useEffect(() => {
    fetch("https://checkkonproject-sub.com/api/Tags_request")
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          label: item.tag_name,
          value: item.tag_name,
        }));
        setOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Error fetching tag:", error);
      });
  }, []);

  const onFinish = (values) => {
    console.log("tags:", values.tags);
    const { type_new, med_new, prov_new, tags } = values;
    const formattedTags = tags || [];
    const created_at = values.created_at
      ? new Date(values.created_at).toISOString().split("T")[0]
      : null;

    console.log("Form values:", {
      type_new,
      med_new,
      prov_new,
      created_at,
      tags,
    });

    const filteredNews = dataOrg.filter((News) => {
      const NewsDate = News.created_at
        ? new Date(News.created_at).toISOString().split("T")[0]
        : null;
      const matchesType = type_new ? News.type_new === type_new : true;
      const matchesMedia = med_new ? News.med_new === med_new : true;
      const matchesProvince = prov_new ? News.prov_new === prov_new : true;
      const matchesDate = created_at ? NewsDate === created_at : true;

      let newsTags = [];
      try {
        newsTags = JSON.parse(News.tag || "[]");
        console.log("newsTags:", newsTags);
      } catch (error) {
        console.error("Error parsing news.tag:", error);
      }
      const matchesAnyTag =
        formattedTags.length === 0 ||
        formattedTags.every((formattedTag) => newsTags.includes(formattedTag));

      return (
        matchesType &&
        matchesMedia &&
        matchesProvince &&
        matchesDate &&
        matchesAnyTag
      );
    });
    setData(filteredNews);
  };

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/${endpoint}`
      );
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code[`id`]} value={code[`id`]}>
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
  const onChange_mfi_province = () => {
    fetchDataAndSetOptions("Province_request", "prov", setSelectOptions_prov);
  };
  const onChange_mfi_ty_info_id = () => {
    fetchDataAndSetOptions(
      "TypeInformation_request",
      "type_info",
      setSelectOptions_ty
    );
  };
  const onChange_dnc_med_id = () => {
    fetchDataAndSetOptions(
      "MediaChannels_request",
      "med_c",
      setSelectOptions_med
    );
  };
  useEffect(() => {
    onChange_mfi_province();
    onChange_dnc_med_id();
    onChange_mfi_ty_info_id();
  }, []);
  const isEditing = (record) => record.key === editingKey;
  const columns = [
    {
      title: "ลำดับ",
      width: "5%",
      render: (text, record, index) => index + 1,
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
        const provinceId = parseInt(mfi_province, 10); // Assuming base 10
        const provinceData = province.find((item) => item.id === provinceId);
        return provinceData ? provinceData.prov_name : "ไม่พบข้อมูล";
      },
    },
    {
      title: "ผลการตรวจสอบ",
      dataIndex: "mfi_status",
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
          <Link to={`/FakenewsSearch/FakenewsSearch_view/${record.id}`}>
            <EyeOutlined style={{ fontSize: "16px", color: "blue" }} />
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

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    if (sorter.field) {
      setSortOrder({ field: sorter.field, order: sorter.order === "descend" ? "desc" : "asc" });
    }
  };


  return (
    <div style={{ backgroundColor: "#f1f1f1" }}>
      <Paper
        elevation={0}
        className="paperContainer"
        style={{
          backgroundColor: "#f1f1f1",
        }}
      >
        <Card
          style={{
            borderRadius: "20px",
            backgroundColor: "#7BBD8F",
          }}
        >
          <div
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'Th Sarabun New', sans-serif",
              color: "white",
            }}
          >
            ค้นหาข่าวเท็จที่มีการรับแจ้งเข้ามาในเครือข่ายผู้บริโภคภาคใต้
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                size="large"
                type="primary"
                style={{
                    padding: "30px 35px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#ffffff",
                    border: "#ffffff",
                    color: "#7BBD8F",
                    fontSize: "25px",
                  }}
                onClick={showFilterDialog}
              >
                ตัวกรอง
              </Button>
              <Modal
                visible={filterVisible}
                onCancel={closeFilterDialog}
                footer={null}
              >
                <div>
                <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      textAlign: "center",
                      fontSize: "35px",
                      fontWeight: "bold",
                      fontFamily: "'Th Sarabun New', sans-serif",
                    }}
                  >
                    กรองข้อมูล
                  </div>
                  <Form
                    form={form}
                    layout="vertical"
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                    initialValues={{
                      remember: true,
                    }}
                    style={{
                      maxWidth: "100%",
                      padding: 20,
                    }}
                  >
                    <Form.Item
                      name="type_new"
                      label={<Typography variant="body1" sx={{ fontSize: "25px" }}>ประเภทข่าว</Typography>}
                    >
                      <Select
                        size="large"
                        placeholder="เลือกประเภทข่าว"
                        onChange={onChange_mfi_ty_info_id}
                        allowClear
                      >
                        {selectOptions_ty}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="med_new"
                      label={<Typography variant="body1" sx={{ fontSize: "25px" }}>ช่องทางสื่อ</Typography>}
                    >
                      <Select
                        size="large"
                        placeholder="เลือกช่องทางสื่อ"
                        onChange={onChange_dnc_med_id}
                        allowClear
                      >
                        {selectOptions_med}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="created_at"
                      label={<Typography variant="body1" sx={{ fontSize: "25px" }}>วัน/เดือน/ปี</Typography>}
                      style={{ marginBottom: "10px" }}
                    >
                      <DatePicker size="large" placeholder="เลือกวัน/เดือน/ปี" />
                    </Form.Item>
                    <Form.Item
                      name="prov_new"
                      label={<Typography variant="body1" sx={{ fontSize: "25px" }}>จังหวัด</Typography>}
                      style={{ marginBottom: "10px" }}
                    >
                      <Select size="large" placeholder="เลือกจังหวัด" onChange={onChange_mfi_province} allowClear>
                        {selectOptions_prov}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="tags"
                      label={<Typography variant="body1" sx={{ fontSize: "25px" }}>คำสำคัญ</Typography>}
                      style={{ marginBottom: "10px" }}
                    >
                      <Select
                        size="large"
                        mode="tags"
                        style={{ width: "100%" }}
                        options={options}
                        name="tags"
                        placeholder="เลือกคำสำคัญ"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        placeholder="เลือกจังหวัด"
                        className="login-form-button"
                        size="large"
                        style={{
                          padding: "20px 25px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "#7BBD8F",
                          border: "none",
                          color: "#ffffff",
                        }}
                      >
                        <Typography variant="body1" sx={{ fontSize: "25px" }}>ค้นหา</Typography>
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </Modal>
            </div>
          </div>
        </Card>
        <br /><br />
        <Table
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
        components={{
          body: {
            //cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        //loading={loading}
        // pagination={{
        //   onChange: cancel,
        // }}
      />
      </Paper>
    </div>
  );
};

export default FakenewsSearch_Menu;