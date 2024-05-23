import React, { useCallback, useState, useEffect } from "react";
import { Card, Button, Form, DatePicker, Modal, Select, Space } from "antd";
import { Link } from "react-router-dom";
import {
  Typography,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableBody,
} from "@mui/material";
import { EyeOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;
const { Option } = Select;
const rowsPerPageOptions = [10];

const FakenewsSearch_Menu = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [form] = Form.useForm();
  const [province, setProvince] = useState([]);
  const [resultB, setResultB] = useState([]);
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [selectOptions_tags, setSelectOptions_tags] = useState([]);
  const [dataOrg, setDataOrg] = useState([]);
  const [data, setData] = useState([]);
  const [infoData, setInfoData] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectOptions_result, setSelectOptions_Result] = useState([]);
  const [ty, setty] = useState([]);

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
  const fetchAll = async () => {
    await fetchData();
    await fetchInfoData();
    await Province();
    await onChange_Tags();
    await onChange_mfi_province();
    await onChange_dnc_med_id();
    await onChange_mfi_ty_info_id();
  };

  useEffect(() => {
    fetchAll();
  }, []);
  const fetchty = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/TypeInformation_request"
      );
      if (response.ok) {
        const data = await response.json();
        setty(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchty();
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/mfi_Search_request"
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
  const Result = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Result_request"
      );
      if (response.ok) {
        const data = await response.json();
        setResultB(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    Result();
  }, []);
  const fetchInfoData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/fiSearch_request"
      );
      if (response.ok) {
        const data = await response.json();
        setInfoData(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchInfoData();
  }, []);

  const showFilterDialog = () => {
    setFilterVisible(true);
  };

  const closeFilterDialog = () => {
    setFilterVisible(false);
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
  }, []);

  const onFinish = (values) => {
    const { type_new, med_new, prov_new, tags, results, created_at } = values;
    const formattedTags = tags || [];
  
    const startDate = created_at && created_at[0] ? created_at[0].startOf('month').toDate() : null;
    const endDate = created_at && created_at[1] ? created_at[1].endOf('month').toDate() : null;
  
    const filteredNews = dataOrg.filter((News) => {
      const NewsDate = News.created_at ? new Date(News.created_at) : null;
      const matchesType = type_new ? News.mfi_ty_info === type_new : true;
      const matchesMedia = med_new ? News.mfi_med_c === med_new : true;
      const matchesProvince = prov_new ? News.mfi_province === prov_new : true;
      const matchesDate = NewsDate && startDate && endDate ? (NewsDate >= startDate && NewsDate <= endDate) : true;
      const matchesResults = results ? News.mfi_results === results : true;
  
      let newsTags = [];
      try {
        newsTags = JSON.parse(News.mfi_tag || "[]");
      } catch (error) {
        console.error("Error parsing news.tag:", error);
      }
      const matchesAnyTag = formattedTags.length === 0 || formattedTags.every((formattedTag) => newsTags.includes(formattedTag));
  
      return matchesType && matchesMedia && matchesProvince && matchesDate && matchesAnyTag && matchesResults;
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
          console.error(
            `Error fetching ${fieldName} codes:`,
            response.statusText
          );
        }
      } catch (error) {
        console.error(`Error fetching ${fieldName} codes:`, error);
      }
    },
    []
  );

  const onChange_Tags = useCallback(async () => {
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
  }, []);

  const onChange_mfi_province = useCallback(() => {
    fetchDataAndSetOptions("Province_request", "prov", setSelectOptions_prov);
  }, []);

  const onChange_mfi_ty_info_id = useCallback(() => {
    fetchDataAndSetOptions(
      "TypeInformation_request",
      "type_info",
      setSelectOptions_ty
    );
  }, []);

  const onChange_dnc_med_id = useCallback(() => {
    fetchDataAndSetOptions(
      "MediaChannels_request",
      "med_c",
      setSelectOptions_med
    );
  }, []);
  const onChange_mfi_results_id = useCallback(() => {
    fetchDataAndSetOptions(
      "Result_request",
      "result",
      setSelectOptions_Result
    );
  }, []);

  useEffect(() => {
    onChange_mfi_province();
    onChange_dnc_med_id();
    onChange_mfi_ty_info_id();
    onChange_Tags();
    onChange_mfi_results_id();
  }, []);
  const renderResult = (mfi_results) => {
    const dataA = resultB
      ? resultB.find((item) => item.id === mfi_results)
      : null;
    const resultA = dataA ? dataA.result_name : null;
    return resultA;
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
      render: (mfi_fninfo) => {
        const correspondingInfo = infoData.find(
          (item) => item.id === mfi_fninfo
        );
        return correspondingInfo
          ? correspondingInfo.fn_info_head
          : "ไม่พบข้อมูล";
      },
    },
    {
      title: "ประเภท",
      dataIndex: "mfi_ty_info",
      width: "10%",
      render: (mfi_ty_info) => {
        const correspondingInfo = ty.find(
          (item) => item.id === mfi_ty_info
        );
        return correspondingInfo ? correspondingInfo.type_info_name : "ไม่พบข้อมูล";
      },
    },
    {
      title: "จังหวัดของผู้แจ้ง",
      dataIndex: "mfi_fninfo",
      width: "10%",
      render: (mfi_fninfo) => {
        const correspondingInfo = infoData.find(
          (item) => item.id === mfi_fninfo
        );
        const resultText = correspondingInfo ? correspondingInfo.fn_info_province : null;
        const provinceData = province.find((item) => item.id === resultText);
        return provinceData ? provinceData.prov_name : "ไม่พบข้อมูล";
      },
    },
    {
      title: "วันที่ตรวจสอบ",
      dataIndex: "created_at",
      width: "10%",
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
      title: "ผลการตรวจสอบ",
      dataIndex: "mfi_results",
      width: "10%",
      render: (mfi_results) => renderResult(mfi_results),
    },
    {
      title: "ดูรายละเอียด",
      width: "5%",
      editable: true,
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/FakenewsSearch/FakenewsSearch_view/${record.id}`}>
            <Button
              icon={<EyeOutlined style={{ fontSize: "16px", color: "blue" }} />}
            />
          </Link>
        </Space>
      ),
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="backgroundColor">
      <Paper
        elevation={0}
        className="paperContainer"
        style={{
          backgroundColor: "#e4e4e4",
        }}
      >
        <Card className="cardsection">
          <div className="cardsectionContent">
            ค้นหารายละเอียดข้อมูลที่รับแจ้งจากเครือข่ายผู้บริโภคภาคใต้ที่ผ่านการตรวจสอบแล้ว
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
                      <Select onChange={onChange_mfi_results_id} placeholder="เลือกข้อมูลจริง/เท็จ" allowClear>
                        {selectOptions_result}
                      </Select>
                    </Form.Item>
                    <br />
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="form-button"
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
                  <TableRow key={rowIndex} hover>
                    {columns.map((column, colIndex) => (
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
        </Card>
      </Paper>
    </div>
  );
};

export default FakenewsSearch_Menu;
