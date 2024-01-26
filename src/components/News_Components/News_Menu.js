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
  Form,
  DatePicker,
  Modal,
  Select,
  Flex,
  Skeleton,
} from "antd";
import { Link } from "react-router-dom";
import "./News_Menu.css";
import { Typography, useMediaQuery } from "@mui/material";
import moment from "moment";
const { Option } = Select;
const { Meta } = Card;

const News_Menu = (open, onClose) => {
  const [form] = Form.useForm();
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [filterednew, setFilterednew] = useState([]);
  const isLargeScreen = useMediaQuery("(min-width:1300px)");
  const [dataOrg, setDataOrg] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const curveAngle = 20;
  const [filterVisible, setFilterVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const buttonStyle = {
    background: "#f1f1f1",
    border: "none",
    color: "#7BBD8F",
  };

  useEffect(() => {
    fetch("https://checkkonproject-sub.com/api/News_request")
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
  const newcurrentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const showFilterDialog = () => {
    setFilterVisible(true);
  };

  const closeFilterDialog = () => {
    setFilterVisible(false);
  };

  const handleSubmit = (values) => {
    console.log("Form values:", values);
  };

  const FilterFinish = (values) => {
    console.log("Filter values:", values);
    closeFilterDialog();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredNews = data.filter((News) =>
    News.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              fontSize: "70px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'Th Sarabun New', sans-serif",
              color: "white",
            }}
          >
            ข่าวสาร
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Input
                type="text"
                size="large"
                placeholder="ค้นหา"
                style={{ marginRight: "10px" }}
                //value={searchTerm}
                onChange={(e) => handleSearch(e)}
                prefix={<SearchOutlined className="site-form-item-icon" />}
              />
            </div>
          </div>
        </Card>
        <br />
        <Grid container spacing={2}>
          {isLargeScreen &&
            (loading ? ( // Assuming loading state indicates whether data is being fetched
              <Grid item xs={12} key="loading">
                <Skeleton active />
              </Grid>
            ) : (
              filteredNews
                .filter((item) => item.status === 1)
                .slice(0, 1)
                .map((item) => (
                  <Grid
                    item
                    xs={12}
                    key={item.id}
                    style={{ marginBottom: '3%', padding: 5 }}
                  >
                    <Link
                      to={`/News_Menu/News_view/${item.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Card
                        hoverable
                        style={{
                          height: '400px',
                          width: '100%',
                          margin: 'auto',
                          borderRadius: '20px',
                          padding: 10,
                          fontFamily: "'Th Sarabun New', sans-serif",
                          fontSize: '25px',
                        }}
                        cover={
                          <div
                            style={{
                              height: '375px',
                              width: '100%',
                              borderRadius: '10px',
                              overflow: 'hidden',
                            }}
                          >
                            <Flex justify="space-between">
                              <img
                                style={{
                                  height: '375px',
                                  width: '100%',
                                  objectFit: 'cover',
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
                                  fontSize: '25px',
                                  fontFamily: "'Th Sarabun New', sans-serif",
                                  textAlign: 'left',
                                }}
                              >
                                <strong>
                                  เผยแพร่{' '}
                                  {moment(item.created_at).format('DD-MM-YYYY')}
                                </strong>
                                <br />
                                {item.title}
                                <Button
                                  type="primary"
                                  href={`/News_Menu/News_view/${item.id}`}
                                  target="_blank"
                                  style={{
                                    fontSize: '18px',
                                    padding: '20px 25px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: '#7BBD8F',
                                    border: 'none',
                                    color: '#ffffff',
                                    fontFamily: "'Th Sarabun New', sans-serif",
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
                ))
            ))}
          {loading ? (
            <Grid item xs={12} md={4} key="loading">
              <Skeleton active />
            </Grid>
          ) : (
            filteredNews
              .filter((item) => item.status === 1)
              .slice(1)
              .map((item) => (
                <Grid
                  item
                  xs={12}
                  md={4}
                  key={item.id}
                  style={{ marginBottom: '3%', padding: 5 }}
                >
                  <Link
                    to={`/News_Menu/News_view/${item.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Card
                      hoverable
                      style={{
                        margin: 'auto',
                        borderRadius: '20px',
                        width: '90%',
                        height: '100%',
                        padding: 20,
                        fontFamily: "'Th Sarabun New', sans-serif",
                        fontSize: '25px',
                        textAlign: 'left',
                      }}
                      cover={
                        <div
                          style={{
                            height: '80%',
                            width: '100%',
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            style={{
                              height: '300px',
                              width: '100%',
                              objectFit: 'cover',
                            }}
                            src={item.cover_image}
                          />
                          เมื่อ {moment(item.created_at).format('DD-MM-YYYY')}
                          <br />
                          {item.title.length > 200
                            ? `${item.title.slice(0, 200)}...`
                            : item.title}
                          {/* <Button
                    type="primary"
                    href={`/News_Menu/News_view/${item.id}`}
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
                      marginTop: "20px",  // Add margin-top to create space between text and button
                    }}
                  >
                    อ่านต่อ
                  </Button> */}
                        </div>
                      }
                    />
                  </Link>
                </Grid>
              ))
          )}
        </Grid>
        {data.length > 0 && (
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
        )}
      </Paper>
    </div>
  );
};

export default News_Menu;
