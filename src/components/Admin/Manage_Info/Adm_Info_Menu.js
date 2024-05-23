import React, { useCallback,useEffect, useState } from "react";
import { Modal, DatePicker, Select, Form, Space, Button, Popconfirm, message, Card } from "antd";
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
const { Option } = Select;
const { RangePicker } = DatePicker;

const ManageMembers = () => {
  const [form] = Form.useForm();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [data, setData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [province, setProvince] = useState([]);
  const [results, setResults] = useState([]);
  const [datamanage, setDatamanage] = useState([]);
  const [dataOrg, setDataOrg] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [selectOptions_mem, setSelectOptions_mem] = useState([]);
  const showFilterDialog = () => {
    memoizedFunctions();
    setFilterVisible(true);
  };

  const closeFilterDialog = () => {
    setFilterVisible(false);
  };
  const onFinish = (values) => {
    const {  med_new, prov_new, mem,created_at } = values;
    // const created_at = values.created_at
    //   ? new Date(values.created_at).toISOString().split("T")[0]
    //   : null;
    const startDate = created_at && created_at[0] ? created_at[0].startOf('month').toDate() : null;
    const endDate = created_at && created_at[1] ? created_at[1].endOf('month').toDate() : null;

    const filteredNews = dataOrg.filter((News) => {
      const NewsDate = News.created_at ? new Date(News.created_at) : null;
      // const NewsDate = News.created_at
      //   ? new Date(News.created_at).toISOString().split("T")[0]
      //   : null;
      const matchesMedia = med_new ? News.fn_info_source === med_new : true;
      const matchesProvince = prov_new ? News.fn_info_province === prov_new : true;
      const matchesDate = NewsDate && startDate && endDate ? (NewsDate >= startDate && NewsDate <= endDate) : true;
      const matchesMem = mem ? News.fn_info_nameid === mem : true;

      return (
        matchesMedia &&
        matchesProvince &&
        matchesDate &&
        matchesMem
      );
    });
    setData(filteredNews);
  };
  const fetchDataAndSetOptions = useCallback(
    async (endpoint, fieldName, stateSetter) => {
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
          stateSetter(options);
        } else {
          console.error(`Error fetching codes:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error fetching codes:`, error);
      }
    },
    []
  );
  const onChange_mfi_province = useCallback(() => {
    fetchDataAndSetOptions("Province_request", "prov", setSelectOptions_prov);
  }, [fetchDataAndSetOptions, setSelectOptions_prov]);

  const onChange_dnc_med_id = useCallback(() => {
    fetchDataAndSetOptions(
      "MediaChannels_request",
      "med_c",
      setSelectOptions_med
    );
  }, [fetchDataAndSetOptions, setSelectOptions_med]);
  const onChange_mfi_mem = useCallback(async () => {
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
  }, [setSelectOptions_mem]);

  const memoizedFunctions = useCallback(() => {
    onChange_mfi_province();
    onChange_dnc_med_id();
    onChange_mfi_mem();
  }, [
    onChange_mfi_province,
    onChange_dnc_med_id,
    onChange_mfi_mem,
  ]);
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
        "https://checkkonproject-sub.com/api/mfi_menu_request"
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
  }, []);

  const Results = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Result_request"
      );
      if (response.ok) {
        const pv = await response.json();
        setResults(pv);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    Results();
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
        return "ไม่พบสถานะ";
    }
  };

  const renderResultText = (id) => {
    const dataA = datamanage
      ? datamanage.find((item) => item.mfi_fninfo === id)
      : null;
  
    if (dataA && dataA.mfi_results !== undefined) {
      const ResultsData = results.find(
        (item) => item.id === dataA.mfi_results
      );
      return ResultsData ? ResultsData.result_name : "ไม่พบข้อมูล";
    } else {
      return "ยังไม่ตรวจสอบ";
    }
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
        <div className="cardsectionContent">จัดการข้อมูลรับแจ้ง
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
                    <RangePicker 
                        picker="month"
                        size="large"
                        placeholder={['ตั้งแต่เดือน', 'ถึงเดือน']}
                      />
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
                      allowClear
                    >
                      {selectOptions_prov}
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
