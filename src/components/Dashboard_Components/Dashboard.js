import React, { useState, useEffect } from "react";
import {
  RightCircleOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import { Paper, Grid, Box, IconButton  } from "@mui/material";
import Carousel from "./Carousel";
import ThailandMap from "./ThailandMap";
import PieChartComponent from "./PieChartComponent";
import BarChartComponent from "./BarChartComponent";
import MuiTable from "./MuiTable";
import {
  Button,
  Card,
  FloatButton,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

const Dashboard = () => {
  const [newdata, setNewData] = useState([]);
  const [articledata, setArticleData] = useState([]);
  const [mdSharedata, setMdShareData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const navigate = useNavigate();

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
              shape="circle"
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
