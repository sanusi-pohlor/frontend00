import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, IconButton } from "@mui/material";
import {
  SearchOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import { Card, Button, Input, Flex, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import moment from "moment";

const News_Menu = () => {
  const [loading, setLoading] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:1300px)");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("https://checkkonproject-sub.com/api/News_request")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const filteredNews = data.filter((news) =>
    news.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="backgroundColor">
      <Paper
        elevation={0}
        className="paperContainer"
        style={{ backgroundColor: "#e4e4e4" }}
      >
        <Card className="cardsection">
          <div className="cardsectionContent">
            ข่าวสาร
            <div className="searchContainer">
              <Input
                type="text"
                size="large"
                placeholder="ค้นหา"
                style={{ marginRight: "10px" }}
                onChange={handleSearch}
                prefix={<SearchOutlined className="site-form-item-icon" />}
              />
            </div>
          </div>
        </Card>
        <br />
        <Grid container spacing={2}>
          {isLargeScreen &&
            (loading ? (
              <Grid item xs={12} key="loading">
                <Skeleton active />
              </Grid>
            ) : (
              filteredNews
                .filter((item) => item.status === 1)
                .slice(0, 1)
                .map((item) => (
                  <Grid item xs={12} key={item.id} className="gridItem">
                    <Link
                      to={`/News_Menu/News_view/${item.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card hoverable className="cardItem-head">
                        <div className="cardItemCover">
                          <Flex justify="space-between">
                            <img
                              className="cardImage"
                              src={item.cover_image}
                              alt="cover"
                            />
                            <Flex
                              vertical
                              align="flex-end"
                              justify="space-between"
                              className="flex-card"
                            >
                              <strong>
                                เผยแพร่{" "}
                                {moment(item.created_at).format("DD-MM-YYYY")}
                              </strong>
                              <br />
                              {item.title}
                              <Button
                                type="primary"
                                href={`/News_Menu/News_view/${item.id}`}
                                target="_blank"
                                className="button-card"
                              >
                                อ่านต่อ
                              </Button>
                            </Flex>
                          </Flex>
                        </div>
                      </Card>
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
                <Grid item xs={12} md={4} key={item.id} className="gridItem">
                  <Link
                    to={`/News_Menu/News_view/${item.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card hoverable className="cardItem">
                      <div className="cardItemCover">
                        <img
                          className="cardImage"
                          src={item.cover_image}
                          alt="cover"
                        />
                        เมื่อ {moment(item.created_at).format("DD-MM-YYYY")}
                        <br />
                        {item.title.length > 200
                          ? `${item.title.slice(0, 200)}...`
                          : item.title}
                      </div>
                    </Card>
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
