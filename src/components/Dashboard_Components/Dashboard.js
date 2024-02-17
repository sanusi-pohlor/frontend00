import React, { useState, useEffect } from "react";
import { RightCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";
import { Paper, Grid, Box, IconButton, Typography } from "@mui/material";
import { Card, Button } from "antd";
import moment from "moment";
import Carousel from "./Carousel";
import ThailandMap from "./ThailandMap";
import PieChartComponent from "./PieChartComponent";
import BarChartComponent from "./BarChartComponent";
import MuiTable from "./MuiTable";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [newdata, setNewData] = useState([]);
  const [articledata, setArticleData] = useState([]);
  const [mdSharedata, setMdShareData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/${endpoint}`
        );
        if (response.ok) {
          const data = await response.json();
          const filteredData = data.filter((item) => item.status === 1);
          const sortedData = filteredData.slice().sort((a, b) => b.id - a.id);
          setter(sortedData);
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderCardItem = (items, link) => {
    return items.map((item) => (
      <Grid item xs={12} md={4} key={item.id} className="gridItem">
        <Link to={`/${link}/${item.id}`} style={{ textDecoration: "none" }}>
          <Card
            hoverable
            className="cardItem"
            cover={
              <div className="cardItemCover">
                <img className="cardImage" src={item.cover_image} alt="cover" />
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
    ));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="backgroundColor">
      <Carousel />
      <div elevation={0} className="paperContainer">
        <br />
        <Card className="cardsection">
          <div className="cardsectionContent">
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
        <Card className="cardsection">
          <div className="cardsectionContent">
            ค้นหาข่าวเท็จที่มีการรับแจ้งเข้ามาในเครือข่ายผู้บริโภคภาคใต้
            <Button
              className="buttonfilterStyle"
              onClick={() => navigate("/FakenewsSearch")}
            >
              ไปค้นหา
            </Button>
          </div>
        </Card>
        <br />
      </div>
      <Paper
        elevation={0}
        className="paperContent"
        style={{
          color: "white",
          backgroundColor: "#7BBD8F",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <div className="articleTitle">ข่าวสาร</div>
          </Grid>
          <Grid item xs={12} md={4}></Grid>
        </Grid>
        <Paper
          elevation={0}
          className="paperContainer"
          style={{
            backgroundColor: "#7BBD8F",
          }}
        >
          <Grid container spacing={2}>
            {renderCardItem(
              newdata.slice(indexOfFirstItem, indexOfLastItem),
              "News_Menu/News_view"
            )}
          </Grid>
        </Paper>
        <Box mt={4} display="flex" justifyContent="center">
          <IconButton
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <LeftCircleOutlined style={{ fontSize: "3rem", color: "white" }} />
          </IconButton>
          <IconButton
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= newdata.length}
          >
            <RightCircleOutlined style={{ fontSize: "3rem", color: "white" }} />
          </IconButton>
        </Box>
      </Paper>
      <Paper
        elevation={0}
        className="paperContent"
        style={{
          backgroundColor: "#e4e4e4",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <div className="articleTitle" style={{ color: "#7BBD8F" }}>
              บทความ
            </div>
          </Grid>
          <Grid item xs={12} md={4}></Grid>
        </Grid>
        <Paper
          elevation={0}
          className="paperContainer"
          style={{
            backgroundColor: "#e4e4e4",
          }}
        >
          <Grid container spacing={2}>
            {renderCardItem(
              articledata.slice(indexOfFirstItem, indexOfLastItem),
              "Article_Menu/Article_view"
            )}
          </Grid>
        </Paper>
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
      <Paper
        elevation={0}
        className="paperContent"
        style={{
          backgroundColor: "#7BBD8F",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}></Grid>
          <Grid item xs={12} md={4}>
            <div className="articleTitle">สื่อชวนแชร์</div>
          </Grid>
          <Grid item xs={12} md={4}></Grid>
        </Grid>
        <Paper
          elevation={0}
          className="paperContainer"
          style={{
            backgroundColor: "#7BBD8F",
          }}
        >
          <Grid container spacing={2}>
            {renderCardItem(
              mdSharedata.slice(indexOfFirstItem, indexOfLastItem),
              "MediaShare_Menu/MediaShare_view"
            )}
          </Grid>
        </Paper>
        <Box mt={4} display="flex" justifyContent="center">
          <IconButton
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <LeftCircleOutlined style={{ fontSize: "3rem", color: "white" }} />
          </IconButton>
          <IconButton
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= mdSharedata.length}
          >
            <RightCircleOutlined style={{ fontSize: "3rem", color: "white" }} />
          </IconButton>
        </Box>
      </Paper>
    </div>
  );
};

export default Dashboard;
