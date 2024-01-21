import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Breadcrumb,
  Card,
  Badge,
  Descriptions,
  Select,
  Divider,
} from "antd";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import AdminMenu from "../Adm_Menu";
import { Grid, Typography } from "@mui/material";
import { format } from 'date-fns-tz';
import thLocale from 'date-fns/locale/th';

const M_DB_Adm_Menu = () => {
  const [data, setData] = useState([]);
  const [province, setProvince] = useState([]);
  const [datamanage, setDatamanage] = useState([]);
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#6A5ACD",
    "#B22222", "#7FFFD4", "#3CB371", "#FFD700", "#FF4500",
    "#4169E1", "#32CD32", "#FFD700", "#808080", "#800080",
    "#FF1493", "#8A2BE2", "#00FA9A", "#AF19FF", "#20B2AA",
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF",
    "#FF00FF", "#000000", "#808000", "#800000"
  ];
  const curveAngle = 20;
  const paperColor = "#FFFFFF";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("User data retrieval failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchDataInfo = async () => {
    try {
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/ManageInfo_request"
      );
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchData_Manage = async () => {
    try {
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/Manage_Fake_Info_request"
      );
      if (response.ok) {
        const data = await response.json();
        setDatamanage(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchDataInfo();
    fetchData_Manage();
  }, []);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await fetch(
          "https://fakenews001-392577897f69.herokuapp.com/api/Province_request"
        );
        if (response.ok) {
          const pv = await response.json();
          const filteredIds = pv.filter(
            (item) => item.id === (user && user.province)
          );
          setProvince(filteredIds);
          console.log("Filtered provinces:", filteredIds);
        } else {
          console.error("Error fetching province data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching province data:", error);
      }
    };

    if (user && user.province) {
      fetchProvince();
    }
  }, [user]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
    console.log("Logged out successfully");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const countByStatus = (status) => {
    return data.filter((item) => item.fn_info_status === status).length;
  };
  const countByresults = (result) => {
    return datamanage.filter((item) => item.mfi_results === result).length;
  };

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>{label} {text}</Typography>
  );

  const items = [
    { key: "1", label: createTypography("จำนวนข้อมูลที่แจ้ง"), children: createTypography(data.length) },
    { key: "2", label: createTypography("จำนวนข้อมูลที่ยังไม่ตรวจสอบ"), children: createTypography(countByStatus(0)) },
    { key: "3", label: createTypography("จำนวนข้อมูลทีกำลังตรวจสอบ"), children: createTypography(countByStatus(1)) },
    { key: "4", label: createTypography("จำนวนข้อมูลทีตรวจสอบเรียบร้อย"), children: createTypography(countByStatus(2)) },
    { key: "5", label: createTypography("จำนวนข้อมูลทีเป็นข่าวจริง"), children: createTypography(countByresults(1)) },
    { key: "6", label: createTypography("จำนวนข้อมูลทีเป็นข่าวเท็จ"), children: createTypography(countByresults(0)) },
  ];

  const items2 = [
    { key: "0", label: "", children: user && (<img src={"https://www.jollyboxdesign.com/wp-content/uploads/2021/08/Administrator.png"} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />), },
    { key: "1", label: createTypography("ชื่อ-สกุล"), children: user && createTypography(user.username, user.lastname) },
    { key: "2", label: createTypography("เบอร์ติดต่อ"), children: user && createTypography(user.phone_number) },
    { key: "3", label: createTypography("ไอดีไลน์"), children: user && createTypography(user.Id_line) },
    { key: "4", label: createTypography("อีเมล"), children: user && createTypography(user.email) },
    { key: "5", label: createTypography("จังหวัด"), children: province.length > 0 && createTypography("จังหวัดที่อยู่", province[0].prov_name) },
    { key: "6", label: createTypography("เกี่ยวกับผู้เขียน"), children: user && createTypography("เกี่ยวกับผู้เขียน", "เกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียน") },
  ];

  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [chartData3, setChartData3] = useState([]);

  const [options] = useState([
    {
      title: "ประเภทสื่อ",
      value: "MediaChannels_request",
      name: "med_c_name",
      dataIndex: "mfi_med_c",
    },
    {
      title: "รูปแบบข่าว",
      value: "FormatData_request",
      name: "fm_d_name",
      dataIndex: "mfi_fm_d",
    },
    {
      title: "จังหวัด",
      value: "Province_request",
      name: "prov_name",
      dataIndex: "mfi_province",
    },
  ]);

  useEffect(() => {
    const fetchData = async (endpoint, name, dataIndex) => {
      try {
        const Manage_Fake_Info = await fetch(
          "https://fakenews001-392577897f69.herokuapp.com/api/Manage_Fake_Info_request"
        );
        const MediaChannels = await fetch(
          `https://fakenews001-392577897f69.herokuapp.com/api/${endpoint}`
        );

        if (Manage_Fake_Info.ok && MediaChannels.ok) {
          const Manage_Fake_Infodata = await Manage_Fake_Info.json();
          const MediaChannelsData = await MediaChannels.json();

          const countByMedCId = MediaChannelsData.map((channel) => {
            const count = Manage_Fake_Infodata.filter(
              (fakeInfo) => fakeInfo[dataIndex] === channel.id
            ).length;

            return {
              name: channel[name],
              value: count,
            };
          });

          return countByMedCId;
        } else {
          console.error("Failed to fetch data");
          return [];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return [];
      }
    };

    Promise.all(
      options.map((option) => fetchData(option.value, option.name, option.dataIndex))
    ).then((data) => {
      setChartData1(data[0]);
      setChartData2(data[1]);
      setChartData3(data[2]);
    });

  }, []);

  const validData = data.filter(item => item.created_at && Date.parse(item.created_at));
  const dateObjects = validData.map(item => new Date(item.created_at));

  if (dateObjects.length === 0) {
    // Handle the case when there is no valid date data
    console.error('No valid date data found.');
    return null; // or return some default content, depending on your requirements
  }

  // Find the oldest and newest months and years
  const oldestDate = dateObjects.reduce((minDate, currentDate) => (currentDate < minDate ? currentDate : minDate), dateObjects[0]);
  const newestDate = dateObjects.reduce((maxDate, currentDate) => (currentDate > maxDate ? currentDate : maxDate), dateObjects[0]);

  // Format the result in Thai language
  const thaiLocale = { locale: thLocale }; // Use the Thai locale
  const oldestMonthYear = format(oldestDate, 'LLLL yyyy', thaiLocale);
  const newestMonthYear = format(newestDate, 'LLLL yyyy', thaiLocale);

  return (
    <AdminMenu>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card
            hoverable
            style={{
              margin: "auto",
              borderRadius: `${curveAngle}px`,
              backgroundColor: paperColor,
              width: "100%",
              height: "100%",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart style={{
                fontSize: "20px",
                fontWeight: "bold",
                fontFamily: "'Th Sarabun New', sans-serif",
              }}>
                <Tooltip />
                <Legend />
                <Pie
                  data={chartData1}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData1.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            hoverable
            style={{
              margin: "auto",
              borderRadius: `${curveAngle}px`,
              backgroundColor: paperColor,
              width: "100%",
              height: "100%",
            }}
          >text
            <ResponsiveContainer width="100%" height={300}>
              <PieChart style={{
                fontSize: "20px",
                fontWeight: "bold",
                fontFamily: "'Th Sarabun New', sans-serif",
              }}>
                <Tooltip />
                <Legend />
                <Pie
                  data={chartData2}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData2.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            hoverable
            style={{
              margin: "auto",
              borderRadius: `${curveAngle}px`,
              backgroundColor: paperColor,
              width: "100%",
              height: "100%",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart style={{
                fontSize: "20px",
                fontWeight: "bold",
                fontFamily: "'Th Sarabun New', sans-serif",
              }}>
                <Tooltip />
                <Legend />
                <Pie
                  data={chartData3}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData3.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
      <Divider />
      <Card
        style={{
          margin: "auto",
          borderRadius: `${curveAngle}px`,
          backgroundColor: paperColor,
          width: "100%",
          height: "65%",
        }}
      >
        <Typography variant="body1" sx={{ fontSize: "35px" }}>ข้อมูลที่แจ้งตั้งแต่ {oldestMonthYear} ถึง {newestMonthYear} (ปัจจุบัน)</Typography>
        <br />
        <Descriptions title={createTypography("ข้อมูล")} bordered items={items} />
        <br />
        <Divider />
        <Descriptions
          style={{
            fontSize: "30px",
          }}
          title="ข้อมูล Admin"
          items={items2}
        />
        <br />
        <Button type="primary" onClick={showModal} style={{
          fontSize: "18px",
          padding: "20px 25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#7BBD8F",
          border: "none",
          color: "#ffffff",
        }}>
          {createTypography("ออกจากระบบ")}
        </Button>
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <p>{createTypography("ต้องการออกจากระบบ")}</p>
        </Modal>
      </Card>
      <Divider />
    </AdminMenu>
  );
};

export default M_DB_Adm_Menu;
