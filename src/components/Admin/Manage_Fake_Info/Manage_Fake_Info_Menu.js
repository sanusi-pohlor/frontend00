import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Popconfirm,
  Space,
  Select,
  DatePicker,
  Modal,
  Card,
} from "antd";
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
import AdminMenu from "../Adm_Menu";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
const rowsPerPageOptions = [10];
const { Option } = Select;

const Manage_Fake_Info_Menu = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [dataOrg, setDataOrg] = useState([]);
  const [dataInfo, setDataInfo] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [infoData, setInfoData] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [province, setProvince] = useState([]);
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [selectOptions_mem, setSelectOptions_mem] = useState([]);
  const [selectOptions_tags, setSelectOptions_tags] = useState([]);

  const fetchDataInfo = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/FakeNewsInfo_request"
      );
      if (response.ok) {
        const data = await response.json();
        setDataInfo(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchDataInfo();
  }, []);

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
        const sortedData = data.slice().sort((a, b) => b.id - a.id);
        setData(sortedData);
        setDataOrg(sortedData);
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

  const handleConfirm = async (id) => {
    try {
      const infoid = data.filter((item) => item.id === id)[0];
      const formData = new FormData();
      formData.append("status", 0);
      const response = await fetch(
        `https://checkkonproject-sub.com/api/updateFakeNewsStatus/${infoid.mfi_fninfo}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        console.log("Updating status successfully");
      } else {
        console.error("Error updating status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/Manage_Fake_Info_delete/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Item deleted successfully");
        handleConfirm(id);
        fetchData();
      } else {
        console.error("Error deleting item:", data);
      }
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  const onFinish = (values) => {
    const { type_new, med_new, prov_new, tags, results, mem } = values;
    const formattedTags = tags || [];
    const created_at = values.created_at
      ? new Date(values.created_at).toISOString().split("T")[0]
      : null;

    const filteredNews = dataOrg.filter((News) => {
      const NewsDate = News.created_at
        ? new Date(News.created_at).toISOString().split("T")[0]
        : null;
      const matchesType = type_new ? News.mfi_ty_info === type_new : true;
      const matchesMedia = med_new ? News.mfi_med_c === med_new : true;
      const matchesProvince = prov_new ? News.mfi_province === prov_new : true;
      const matchesDate = created_at ? NewsDate === created_at : true;
      const intResults = parseInt(results);
      const matchesResults = results ? News.mfi_results === intResults : true;
      const matchesMem = mem ? News.mfi_mem === mem : true;

      let newsTags = [];
      try {
        newsTags = JSON.parse(News.mfi_tag || "[]");
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
        matchesAnyTag &&
        matchesResults &&
        matchesMem
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

  const onChange_Tags = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Tags_request"
      );
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code[`id`]} value={code[`tag_name`]}>
            {code[`tag_name`]}
          </Option>
        ));
        setSelectOptions_tags(options);
      } else {
        console.error(`Error fetching codes:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching codes:`, error);
    }
  };
  const onChange_mfi_mem = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/AmUser"
      );
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code.id} value={code.id}>
            {`${code.username} ${code.lastName}`}
          </Option>
        ));
        setSelectOptions_mem(options);
      } else {
        console.error(`Error fetching codes:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching codes:`, error);
    }
  };
  useEffect(() => {
    onChange_mfi_province();
    onChange_dnc_med_id();
    onChange_mfi_ty_info_id();
    onChange_mfi_mem();
    onChange_Tags();
  }, []);

  const renderResultText = (mfi_fninfo) => {
    const dataA = dataInfo
      ? dataInfo.find((item) => item.id === mfi_fninfo)
      : null;
    const resultText = dataA ? dataA.fn_info_head : null;
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
      dataIndex: "mfi_fninfo",
      width: "30%",
      render: (mfi_fninfo) => renderResultText(mfi_fninfo),
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
      title: "ผลการตรวจสอบ",
      dataIndex: "mfi_results",
      width: "10%",
      render: (mfi_results) =>
        mfi_results === 0
          ? "ข่าวเท็จ"
          : mfi_results === 1
          ? "ข่าวจริง"
          : "กำลังตรวจสอบ",
    },
    {
      title: "จัดการ",
      width: "5%",
      editable: true,
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/Admin/Manage_Fake_Info_View/${record.id}`}>
            <Button
              icon={<EyeOutlined style={{ fontSize: "16px", color: "blue" }} />}
            />
          </Link>
          {record.status === 0 && (
            <Link to={`/Admin/Manage_Fake_Info/edit/${record.id}`}>
              <Button
                icon={
                  <EditOutlined style={{ fontSize: "16px", color: "green" }} />
                }
              />
            </Link>
          )}
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

  const showFilterDialog = () => {
    setFilterVisible(true);
  };

  const closeFilterDialog = () => {
    setFilterVisible(false);
  };

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
          <div className="searchContainer">
            <Button
              type="primary"
              className="buttonfilterStyle"
              onClick={showFilterDialog}
            >
              ตัวกรอง
            </Button>
            <Modal
              open={filterVisible}
              onCancel={closeFilterDialog}
              footer={null}
            >
              <div>
                <div className="Modelcontainer">กรองข้อมูล</div>
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
                    label={
                      <Typography variant="body1" sx={{ fontSize: "25px" }}>
                        ประเภทข่าว
                      </Typography>
                    }
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
                    label={
                      <Typography variant="body1" sx={{ fontSize: "25px" }}>
                        ช่องทางสื่อ
                      </Typography>
                    }
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
                    label={
                      <Typography variant="body1" sx={{ fontSize: "25px" }}>
                        วัน/เดือน/ปี
                      </Typography>
                    }
                    style={{ marginBottom: "10px" }}
                  >
                    <DatePicker size="large" placeholder="เลือกวัน/เดือน/ปี" />
                  </Form.Item>
                  <Form.Item
                    name="prov_new"
                    label={
                      <Typography variant="body1" sx={{ fontSize: "25px" }}>
                        จังหวัด
                      </Typography>
                    }
                    style={{ marginBottom: "10px" }}
                  >
                    <Select
                      size="large"
                      placeholder="เลือกจังหวัด"
                      onChange={onChange_mfi_province}
                      allowClear
                    >
                      {selectOptions_prov}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="tags"
                    label={
                      <Typography variant="body1" sx={{ fontSize: "25px" }}>
                        คำสำคัญ
                      </Typography>
                    }
                    style={{ marginBottom: "10px" }}
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      placeholder="เลือกคำสำคัญ"
                      onChange={onChange_Tags}
                      allowClear
                    >
                      {selectOptions_tags}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="results"
                    label={
                      <Typography variant="body1" sx={{ fontSize: "25px" }}>
                        ข้อมูลจริง/เท็จ
                      </Typography>
                    }
                    style={{ marginBottom: "10px" }}
                  >
                    <Select
                      size="large"
                      placeholder="เลือกข้อมูลจริง"
                      allowClear
                    >
                      <Select.Option value="0">ข่าวเท็จ</Select.Option>
                      <Select.Option value="1">ข่าวจริง</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="mem"
                    label={
                      <Typography variant="body1" sx={{ fontSize: "25px" }}>
                        ผู้ส่งรายงาน
                      </Typography>
                    }
                    style={{ marginBottom: "10px" }}
                  >
                    <Select
                      size="large"
                      placeholder="เลือกผู้ส่งรายงาน"
                      onChange={onChange_mfi_mem}
                      allowClear
                    >
                      {selectOptions_mem}
                    </Select>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      placeholder="เลือกจังหวัด"
                      className="form-button"
                      size="large"
                    >
                      <Typography variant="body1" sx={{ fontSize: "25px" }}>
                        ค้นหา
                      </Typography>
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Modal>
          </div>
        </div>
      </Card>
      <br />
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ background: "#7BBD8F" }}>
                {columns.map((column) => (
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
                <TableRow key={rowIndex} hover>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`${rowIndex}-${colIndex}`} align="left">
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

export default Manage_Fake_Info_Menu;
