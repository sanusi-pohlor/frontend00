import React, { useState, useEffect } from "react";
import {
  SearchOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import { Paper, Grid, Box, IconButton, Grow } from "@mui/material";
import Carousel from "./Carousel";
import ThailandMap from "./ThailandMap";
import PieChartComponent from "./PieChartComponent";
import BarChartComponent from "./BarChartComponent";
import MuiTable from "./MuiTable";
import { CSSTransition } from "react-transition-group";
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
import { Link, useNavigate } from "react-router-dom";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import moment from "moment";

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
  const [showPaper, setShowPaper] = useState(true);
  const navigate = useNavigate();
  const togglePaper = () => {
    setShowPaper(!showPaper);
  };

  const buttonStyle = {
    background: "#7BBD8F",
    border: "none",
    color: "white",
  };
  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/${endpoint}`
        );
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
  const onTypeChange = () => {
    fetchDataAndSetOptions(
      "TypeInformation_request",
      "type_info",
      setSelectOptions_type
    );
  };

  return (
    <div style={{ backgroundColor: "#f1f1f1" }}>
      <Carousel />
      <Paper
        elevation={0}
        style={{
          width: "90%",
          padding: 10,
          margin: "0 auto",
          textAlign: "center",
          backgroundColor: "#f1f1f1",
        }}
      >
        <br />
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
            จำนวนการรับแจ้งข้อมูลเท็จโดยเครือข่ายผู้บริโภคภาคใต้
          </div>
        </Card>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <BarChartComponent />
          </Grid>
          <Grid item xs={12} md={4}>
            <PieChartComponent />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ThailandMap />
          </Grid>
          <Grid item xs={12} md={6}>
            <MuiTable />
          </Grid>
        </Grid>
        <br />
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
                fontSize: "35px",
                fontFamily: "'Th Sarabun New', sans-serif",
              }}
              onClick={() => navigate("/FakenewsSearch")}
            >
              ไปค้นหา
            </Button>
          </div>
        </Card>
        <br />
      </Paper>
      <Paper
        elevation={0}
        style={{
          padding: 50,
          margin: "0 auto",
          textAlign: "center",
          color: "#FFFFFF",
          backgroundColor: "#7BBD8F",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <div className="articleTitle">ข่าวสาร</div>
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
          className="paperContainer"
          style={{
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
                style={{ marginBottom: "4%", padding: 20 }}
              >
                <Link
                  to={`/News_Menu/News_view/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    style={{
                      height: "100%",
                      width: "100%",
                      margin: "auto",
                      borderRadius: "20px",
                      padding: 20,
                      fontFamily: "'Th Sarabun New', sans-serif",
                      fontSize: "25px",
                      textAlign: "left",
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
                            height: "300px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src={item.cover_image}
                          //alt={item.title}
                        />
                        <strong>
                          เผยแพร่ {moment(item.created_at).format("DD-MM-YYYY")}
                        </strong>

                        <br />
                        {item.title.length > 150
                          ? `${item.title.slice(0, 150)}...`
                          : item.title}
                      </div>
                    }
                  />
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
          padding: 50,
          margin: "0 auto",
          textAlign: "center",
          backgroundColor: "#f1f1f1",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <div
              className="articleTitle"
              style={{
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
          className="paperContainer"
          style={{
            backgroundColor: "#f1f1f1",
          }}
        >
          <Grid container spacing={2}>
            {articlecurrentItems.map((item) => (
              <Grid
                item
                xs={12}
                md={4}
                key={item.id}
                style={{ marginBottom: "4%", padding: 20 }}
              >
                <Link
                  to={`/Article_Menu/Article_view/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    style={{
                      height: "100%",
                      width: "100%",
                      margin: "auto",
                      borderRadius: "20px",
                      padding: 20,
                      fontFamily: "'Th Sarabun New', sans-serif",
                      fontSize: "25px",
                      textAlign: "left",
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
                            height: "300px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src={item.cover_image}
                        />
                        <strong>
                          เผยแพร่ {moment(item.created_at).format("DD-MM-YYYY")}
                        </strong>
                        <br />
                        {item.title.length > 150
                          ? `${item.title.slice(0, 150)}...`
                          : item.title}
                      </div>
                    }
                  />
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
          margin: "0 auto",
          textAlign: "center",
          color: "#FFFFFF",
          backgroundColor: "#7BBD8F",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <div className="articleTitle">สื่อชวนแชร์</div>
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
          className="paperContainer"
          style={{
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
                style={{ marginBottom: "4%", padding: 20 }}
              >
                <Link
                  to={`/MediaShare_Menu/MediaShare_view/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    style={{
                      height: "100%",
                      width: "100%",
                      margin: "auto",
                      borderRadius: "20px",
                      padding: 20,
                      fontFamily: "'Th Sarabun New', sans-serif",
                      fontSize: "25px",
                      textAlign: "left",
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
                            height: "300px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          src={item.cover_image}
                        />
                        เมื่อ {moment(item.created_at).format("DD-MM-YYYY")}
                        <br />
                        {item.title.length > 200
                          ? `${item.title.slice(0, 200)}...`
                          : item.title}
                      </div>
                    }
                  />
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
                style={{ fontSize: "3rem", color: "#FFFFFF" }}
              />
            </IconButton>
            <IconButton
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastItem >= mdSharedata.length}
            >
              <RightCircleOutlined
                style={{ fontSize: "3rem", color: "#FFFFFF" }}
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
