import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, IconButton } from "@mui/material";
import { SearchOutlined, RightCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";
import { Card, Input, Flex, Button } from "antd";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import moment from "moment";

const MdShare_Menu = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const isLargeScreen = useMediaQuery("(min-width:1300px)");

  useEffect(() => {
    fetch("https://checkkonproject-sub.com/api/MdShare_request")
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

  const filteredMdShare = data.filter((MdShare) =>
    MdShare.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            สื่อชวนแชร์
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
            filteredMdShare
              .filter((item) => item.status === 1)
              .slice(0, 1)
              .map((item) => (
                <Grid item xs={12} key={item.id} className="gridItem">
                  <Link
                    to={`/MediaShare_Menu/MediaShare_view/${item.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      hoverable
                      className="cardItem-head"
                      cover={
                        <div className="cardItemCover">
                          <Flex justify="space-between">
                            <img
                              className="cardImage"
                              src={item.cover_image}
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
                                href={`/MediaShare_Menu/MediaShare_view/${item.id}`}
                                target="_blank"
                                className="button-card"
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
          {filteredMdShare
            .filter((item) => item.status === 1)
            .slice(1)
            .map((item) => (
              <Grid item xs={12} md={4} key={item.id} className="gridItem">
                <Link
                  to={`/MediaShare_Menu/MediaShare_view/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    className="cardItem"
                    cover={
                      <div className="cardItemCover">
                        <img
                          className="cardImage"
                          src={item.cover_image}
                        />
                        <div className="cardIitleTCover">
                          <strong>
                            เผยแพร่{" "} 
                            {moment(item.created_at).format("DD-MM-YYYY")}
                          </strong>
                          <br />
                          {item.title.length > 150
                            ? `${item.title.slice(0, 150)}...`
                            : item.title}
                        </div>
                      </div>
                    }
                  />
                </Link>
              </Grid>
            ))}
        </Grid>
        {data.length > 0 && (
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
        )}
      </Paper>
    </div>
  );
};

export default MdShare_Menu;
