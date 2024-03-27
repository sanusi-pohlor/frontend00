import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, IconButton } from "@mui/material";
import {
  SearchOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import { Card, Button, Input, Flex , Image} from "antd";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import moment from "moment";

const Article_Menu = () => {
  const isLargeScreen = useMediaQuery("(min-width:1300px)");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("https://checkkonproject-sub.com/api/Article_request")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearch = (event) => setSearchTerm(event.target.value);
  const filtered = data.filter((data) =>
    data.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiltered = filtered
    .filter((item) => item.status === 1)
    .sort((a, b) => b.id - a.id);

  return (
    <div className="backgroundColor">
      <Paper
        elevation={0}
        className="paperContainer"
        style={{ backgroundColor: "#e4e4e4" }}
      >
        <Card className="cardsection">
          <div className="cardsectionContent">
            บทความ
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
            sortedFiltered.slice(0, 1).map((item) => (
              <Grid item xs={12} key={item.id} className="gridItem">
                <Link
                  to={`/Article_Menu/Article_view/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    hoverable
                    className="cardItem-head"
                    cover={
                      <div className="cardItemCover">
                        <Flex justify="space-between">
                          <Image
                            className="cardheadImage"
                            src={item.cover_image}
                            alt={item.title}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "500px",
                              borderRadius: "8px",
                            }}
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
                              href={`/Article_Menu/Article_view/${item.id}`}
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
          {sortedFiltered.slice(1).map((item) => (
            <Grid item xs={12} md={4} key={item.id} className="gridItem">
              <Link
                to={`/Article_Menu/Article_view/${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  hoverable
                  className="cardItem"
                  cover={
                    <div className="cardItemCover">
                      <Image className="cardImage" src={item.cover_image} />
                      <div className="cardIitleTCover">
                        <strong>
                          เผยแพร่ {moment(item.created_at).format("DD-MM-YYYY")}
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

export default Article_Menu;
