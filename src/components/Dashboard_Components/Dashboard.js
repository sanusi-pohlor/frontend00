import React, { useState, useEffect } from "react";
import {
  SearchOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import { Paper, Grid, Box, IconButton, Stack } from "@mui/material";
import Carousel from "./Carousel";
import ThailandMap from "./ThailandMap";
import PieChartComponent from "./PieChartComponent";
import BarChartComponent from "./BarChartComponent";
import MuiTable from "./MuiTable";
import {
  Divider,
  Button,
  Card,
  Flex,
  Typography,
  Select,
  Input,
  FloatButton,
  Form,
  Space,
  DatePicker,
} from "antd";
import Flickity from "react-flickity-component";
import { Link } from "react-router-dom";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
const { Option } = Select;
const { Meta } = Card;
const { Title } = Typography;
const flickityOptions = {
  initialIndex: 2,
};
const Dashboard = ({ onSearch }) => {
  const [newdata, setNewData] = useState([]);
  const [articledata, setArticleData] = useState([]);
  const [mdSharedata, setMdShareData] = useState([]);
  const [form] = Form.useForm();
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [selectOptions_type, setSelectOptions_type] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const buttonStyle = {
    background: "#7BBD8F",
    border: "none",
    color: "white",
  };

  // ฟังก์ชัน useEffect สำหรับดึงข้อมูล
  useEffect(() => {
    // ฟังก์ชัน fetchData สำหรับการดึงข้อมูล
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await fetch(`http://localhost:8000/api/${endpoint}`);
        if (response.ok) {
          const data = await response.json();
          setter(data);
        } else {
          throw new Error(`Error fetching ${endpoint}`);
        }
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    };

    fetchData("News_request", setNewData);
    fetchData("Article_request", setArticleData);
    fetchData("MdShare_request", setMdShareData);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const newcurrentItems = newdata.slice(indexOfFirstItem, indexOfLastItem);
  const articlecurrentItems = articledata.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const mdSharecurrentItems = mdSharedata.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchSubmit = () => {
    onSearch(searchTerm);
  };
  const curveAngle = 20;
  const paperColor = "#FFFFFF";
  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(`http://localhost:8000/api/${endpoint}`);
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
  const onTypeChange = () => {
    fetchDataAndSetOptions(
      "TypeInformation_request",
      "type_info",
      setSelectOptions_type
    );
  };

  return (
    <div>
      <Carousel />
      <Paper
        elevation={0}
        style={{
          width: "90%",
          padding: 10,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Select
            onChange={onTypeChange}
            size="large"
            placeholder="ประเภท"
            allowClear
            style={{
              marginRight: "20px",
              flex: 1,
              fontSize: "50px",
              height: "70px",
            }} // Adjust font size and height
          >
            {selectOptions_type}
          </Select>

          <DatePicker
            placeholder="เดือน/ปี"
            picker="month"
            size="large"
            style={{
              marginRight: "20px",
              flex: 1,
              fontSize: "50px",
              height: "70px",
            }}
          />
        </div>
        <br />
        <Grid container spacing={2}>
          {" "}
          {/* Adjust spacing */}
          <Grid item xs={12} md={8}>
            <BarChartComponent />
          </Grid>
          <Grid item xs={12} md={4}>
            <PieChartComponent />
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid container spacing={2}>
          {" "}
          {/* Adjust spacing */}
          <Grid item xs={12} md={6}>
            <ThailandMap />
          </Grid>
          <Grid item xs={12} md={6}>
            {" "}
            {/* Adjust xs and md values */}
            <Card
              hoverable
              style={{
                margin: "auto",
                borderRadius: `${curveAngle}px`,
                backgroundColor: paperColor,
                width: "100%",
                height: "100%",
              }}
            >
              <MuiTable
                style={{
                  margin: "auto",
                  borderRadius: `${curveAngle}px`,
                  backgroundColor: paperColor,
                  width: "100%",
                  height: "100%",
                }}
              />
            </Card>
          </Grid>
        </Grid>
      </Paper>{" "}
      <br /> <br /> <br />
      <Paper
        elevation={0}
        style={{
          padding: 50,
          margin: "0 auto", // This centers the paper horizontally
          textAlign: "center", // This centers the content inside the paper
          color: "#FFFFFF",
          backgroundColor: "#7BBD8F",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                textAlign: "center", // Center the text horizontally
                fontSize: "80px",
                fontWeight: "bold",
              }}
            >
              ข่าวสาร
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            {/* <Input
              size="large"
              placeholder="ค้นหา"
              value={searchTerm}
              onChange={handleSearchChange}
              onPressEnter={handleSearchSubmit}
              prefix={<SearchOutlined className="site-form-item-icon" />}
            /> */}
          </Grid>
        </Grid>
        <Paper
          elevation={0}
          style={{
            width: "70%",
            padding: 10,
            margin: "0 auto",
            textAlign: "center",
            backgroundColor: "#7BBD8F",
          }}
        >
          <Grid container spacing={2}>
            {newcurrentItems.map((item) => (
              <Grid
                item
                xs={12}
                md={4}
                key={item.id}
                style={{ marginBottom: "4%" }}
              >
                <Link
                  to={`/News/News_views/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    style={{
                      margin: "auto",
                      borderRadius: "20px",
                      width: "90%",
                      height: "100%",
                      padding: 20,
                      fontFamily: "'Th Sarabun New', sans-serif",
                      fontSize: "25px",
                    }}
                    cover={
                      <div
                        style={{
                          height: "80%",
                          width: "100%",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src={item.cover_image}
                          alt={item.title}
                        />
                        {item.title}
                      </div>
                    }
                  ></Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Paper>
        <Box mt={4} display="flex" justifyContent="center">
          <IconButton
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <LeftCircleOutlined
              style={{ fontSize: "3rem", color: "#FFFFFF" }}
            />
          </IconButton>
          <IconButton
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= newdata.length}
          >
            <RightCircleOutlined
              style={{ fontSize: "3rem", color: "#FFFFFF" }}
            />
          </IconButton>
        </Box>
      </Paper>
      <Paper
        elevation={0}
        style={{
          width: "70%",
          padding: 30,
          margin: "0 auto", // This centers the paper horizontally
          textAlign: "center", // This centers the content inside the paper
        }}
      >
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                textAlign: "center", // Center the text horizontally
                fontSize: "80px",
                fontWeight: "bold",
                color: "#7BBD8F",
              }}
            >
              บทความ
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            {/* <Input
              size="large"
              placeholder="ค้นหา"
              value={searchTerm}
              onChange={handleSearchChange}
              onPressEnter={handleSearchSubmit}
              prefix={<SearchOutlined className="site-form-item-icon" />}
            /> */}
          </Grid>
        </Grid>
        <br />
        <Paper
          elevation={0}
          style={{
            width: "100%",
            padding: 10,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Grid container spacing={2}>
            {articlecurrentItems.map((item) => (
              <Grid
                item
                xs={12}
                md={4}
                key={item.id}
                style={{ marginBottom: "4%" }}
              >
                <Link
                  to={`/Article/Article_views/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    style={{
                      margin: "auto",
                      borderRadius: "20px",
                      width: "90%",
                      height: "100%",
                      padding: 20,
                      fontFamily: "'Th Sarabun New', sans-serif",
                      fontSize: "25px",
                    }}
                    cover={
                      <div
                        style={{
                          height: "80%",
                          width: "100%",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src={item.cover_image}
                        />
                        {item.title}
                      </div>
                    }
                  ></Card>
                </Link>
              </Grid>
            ))}
          </Grid>
          <Box mt={4} display="flex" justifyContent="center">
            <IconButton
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <LeftCircleOutlined
                style={{ fontSize: "3rem", color: "#7BBD8F" }}
              />
            </IconButton>
            <IconButton
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastItem >= articledata.length}
            >
              <RightCircleOutlined
                style={{ fontSize: "3rem", color: "#7BBD8F" }}
              />
            </IconButton>
          </Box>
        </Paper>
      </Paper>
      <Paper
        elevation={0}
        style={{
          padding: 50,
          margin: "0 auto", // This centers the paper horizontally
          textAlign: "center", // This centers the content inside the paper
          color: "#FFFFFF",
          backgroundColor: "#7BBD8F",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                textAlign: "center", // Center the text horizontally
                fontSize: "80px",
                fontWeight: "bold",
              }}
            >
              สื่อชวนแชร์
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            {/* <Input
              size="large"
              placeholder="ค้นหา"
              value={searchTerm}
              onChange={handleSearchChange}
              onPressEnter={handleSearchSubmit}
              prefix={<SearchOutlined className="site-form-item-icon" />}
            /> */}
          </Grid>
        </Grid>
        <br />
        <Paper
          elevation={0}
          style={{
            width: "70%",
            padding: 10,
            margin: "0 auto",
            textAlign: "center",
            backgroundColor: "#7BBD8F",
          }}
        >
          <Grid container spacing={2}>
            {mdSharecurrentItems.map((item) => (
              <Grid
                item
                xs={12}
                md={4}
                key={item.id}
                style={{ marginBottom: "4%" }}
              >
                <Link
                  to={`/MdShare/MdShare_views/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    style={{
                      margin: "auto",
                      borderRadius: "20px",
                      width: "90%",
                      height: "100%",
                      padding: 20,
                      fontFamily: "'Th Sarabun New', sans-serif",
                      fontSize: "25px",
                    }}
                    cover={
                      <div
                        style={{
                          height: "80%",
                          width: "100%",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src={item.cover_image}
                        />
                        {item.title}
                      </div>
                    }
                  ></Card>
                </Link>
              </Grid>
            ))}
          </Grid>
          <Box mt={4} display="flex" justifyContent="center">
            <IconButton
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <LeftCircleOutlined
                style={{ fontSize: "3rem", color: "#7BBD8F" }}
              />
            </IconButton>
            <IconButton
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastItem >= mdSharedata.length}
            >
              <RightCircleOutlined
                style={{ fontSize: "3rem", color: "#7BBD8F" }}
              />
            </IconButton>
          </Box>
        </Paper>
      </Paper>
      <FloatButton.BackTop />
    </div>
  );
};

export default Dashboard;
