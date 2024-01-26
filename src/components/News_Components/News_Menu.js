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
  Flex,
  Skeleton,
} from "antd";
import { Link } from "react-router-dom";
import "../../App.css";
import { useMediaQuery } from "@mui/material";
import moment from "moment";

const News_Menu = () => {
  const [loading, setLoading] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:1300px)");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetch("https://checkkonproject-sub.com/api/News_request")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredNews = data.filter((News) =>
    News.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="backgroundColor">
      <Paper
        elevation={0}
        className="paperContainer"
        style={{
          backgroundColor: "#e4e4e4",
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
