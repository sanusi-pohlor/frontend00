import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, IconButton } from "@mui/material";
import {
  SearchOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import {
  Card,
  Button,
  Input,
  Typography,
  Form,
  DatePicker,
  Modal,
  Select,
  Flex,
} from "antd";
import { Link } from "react-router-dom";
import "../../App.css";
import { useMediaQuery } from "@mui/material";
import moment from "moment";
const { Option } = Select;

const Article_Menu = (open) => {
  const [form] = Form.useForm();
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const isLargeScreen = useMediaQuery("(min-width:1300px)");
  const [dataOrg, setDataOrg] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);l

  useEffect(() => {
    fetch("https://checkkonproject-sub.com/api/Article_request")
      .then((response) => response.json())
      .then((data) => {
        setDataOrg(data);
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredArticles = data.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          className="cardsection"
        >
          <div
            className="cardsectionContent"
          >
            บทความ
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Input
                size="large"
                placeholder="ค้นหา"
                style={{ marginRight: "10px" }}
                onChange={(e) => handleSearch(e)}
                //value={searchTerm}
                prefix={<SearchOutlined className="site-form-item-icon" />}
              />
            </div>
          </div>
        </Card>
        <br />
        <Grid container spacing={2}>
          {isLargeScreen &&
            filteredArticles.filter((item) => item.status === 1).slice(0, 1).map((item) => (
              <Grid
                item
                xs={12}
                key={item.id}
                style={{ marginBottom: "3%", padding: 5 }}
              >
                <Link
                  to={`/Article_Menu/Article_view/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    style={{
                      height: "400px",
                      width: "100%",
                      margin: "auto",
                      borderRadius: "20px",
                      padding: 10,
                      fontFamily: "'Th Sarabun New', sans-serif",
                      fontSize: "25px",
                    }}
                    cover={
                      <div
                        style={{
                          height: "375px",
                          width: "100%",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <Flex justify="space-between">
                          <img
                            style={{
                              height: "375px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            src={item.cover_image}
                            alt={item.title}
                          />
                          <Flex
                            vertical
                            align="flex-end"
                            justify="space-between"
                            style={{
                              padding: 32,
                              fontSize: "25px",
                              fontFamily: "'Th Sarabun New', sans-serif",
                              textAlign: "left",
                            }}
                          >
                            <strong>
                              เผยแพร่{" "}
                              {moment(item.created_at).format("DD-MM-YYYY")}
                            </strong>
                            <br />
                            {item.title}
                            <Button
                              type="primary"
                              href={`/Article_Menu/Article_view/${item.id}`}
                              target="_blank"
                              style={{
                                fontSize: "18px",
                                padding: "20px 25px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                background: "#7BBD8F",
                                border: "none",
                                color: "#ffffff",
                              }}
                            >
                              อ่านต่อ
                            </Button>
                          </Flex>
                        </Flex>
                      </div>
                    }
                  />
                </Link>
              </Grid>
            ))}
          {filteredArticles.filter((item) => item.status === 1).slice(1).map((item) => (
            <Grid
              item
              xs={12}
              md={4}
              key={item.id}
              style={{ marginBottom: "3%", padding: 5 }}
            >
              <Link
                to={`/Article_Menu/Article_view/${item.id}`}
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
                      {/* <Button
                        type="primary"
                        href={`/Article_Menu/Article_view/${item.id}`}
                        target="_blank"
                        style={{
                          fontSize: "18px",
                          padding: "20px 25px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "#7BBD8F",
                          border: "none",
                          color: "#ffffff",
                        }}
                      >
                        อ่านต่อ
                      </Button> */}
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
            disabled={indexOfLastItem >= data.length}
          >
            <RightCircleOutlined
              style={{ fontSize: "3rem", color: "#7BBD8F" }}
            />
          </IconButton>
        </Box>
      </Paper>
    </div>
  );
};

export default Article_Menu;
