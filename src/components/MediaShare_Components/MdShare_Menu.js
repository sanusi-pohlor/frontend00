import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, IconButton } from "@mui/material";
import {
  SearchOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import { Card, Button, Input, Typography, Image } from "antd";
import FilterDialog from "./MdShare_Filter_Dialog";
import { Link } from "react-router-dom";
import "./MdShare_Menu.css";
import { useMediaQuery } from '@mui/material';

const { Meta } = Card;
const { Title } = Typography;

const MdShare_Menu = () => {
  const isLargeScreen = useMediaQuery('(min-width:1300px)');
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const curveAngle = 20;
  const [filterVisible, setFilterVisible] = useState(false);
  const buttonStyle = {
    background: "#7BBD8F",
    border: "none",
    color: "white",
  };

  useEffect(() => {
    fetch("https://fakenews001-392577897f69.herokuapp.com/api/MdShare_request")
      .then((response) => response.json())
      .then((data) => {
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const parseHtmlString = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const imgTags = doc.getElementsByTagName("img");
    const imageSources = [];

    for (let i = 0; i < imgTags.length; i++) {
      const src = imgTags[i].getAttribute("src");
      imageSources.push(src);
    }

    return imageSources;
  };

  return (
    <div style={{ backgroundColor: '#f1f1f1' }}>
      <Paper
        elevation={0}
        className="paperContainer"
        style={{
          backgroundColor: '#f1f1f1'
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
                textAlign: "center",
                fontSize: "70px",
                fontWeight: "bold",
              }}
            >
              สื่อชวนแชร์
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                size="large"
                placeholder="ค้นหา"
                style={{ marginRight: "10px" }}
                value={searchTerm}
                prefix={<SearchOutlined className="site-form-item-icon" />}
              />
              <Button
                size="large"
                type="primary"
                style={{ ...buttonStyle, marginRight: "20px" }}
              >
                ค้นหา
              </Button>
              <Button
                size="large"
                type="primary"
                style={buttonStyle}
                onClick={showFilterDialog}
              >
                ตัวกรอง
              </Button>
              {filterVisible && (
                <FilterDialog
                  open={filterVisible}
                  onClose={closeFilterDialog}
                  handleSubmit={handleSubmit}
                  FilterFinish={FilterFinish}
                />
              )}
            </div>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
          {isLargeScreen && currentItems.slice(0, 1).map((item) => (
            <Grid item xs={8} key={item.id} style={{ marginBottom: "3%", padding: 5 }}>
              <Link to={`/MdShare/MdShare_views/${item.id}`} style={{ textDecoration: "none" }}
              >
                <Card
                  hoverable
                  style={{
                    margin: "auto",
                    borderRadius: "20px",
                    padding: 10,
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
          {currentItems.slice(1).map((item) => (
          <Grid item xs={12} md={4} key={item.id} style={{ marginBottom: "3%", padding: 5 }}>
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
                  padding: 10,
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
        <Box mt={4} display="flex" justifyContent="center">
          <IconButton
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <LeftCircleOutlined style={{ fontSize: "3rem", color: "#7BBD8F" }} />
          </IconButton>
          <IconButton
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= data.length}
          >
            <RightCircleOutlined style={{ fontSize: "3rem", color: "#7BBD8F" }} />
          </IconButton>
        </Box>
      </Paper>
    </div>
  );
};

export default MdShare_Menu;
