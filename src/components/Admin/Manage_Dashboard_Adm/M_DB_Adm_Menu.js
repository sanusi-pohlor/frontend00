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
import { Grid } from "@mui/material";

const M_DB_Adm_Menu = () => {
  const [data, setData] = useState([]);
  const [datamanage, setDatamanage] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];
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
  
  
  const items = [
    { key: "1", label: "จำนวนข้อมูลที่แจ้ง", children: data.length },
    { key: "2", label: "จำนวนข้อมูลที่ยังไม่ตรวจสอบ", children: countByStatus(0) },
    { key: "3", label: "จำนวนข้อมูลทีกำลังตรวจสอบ", children: countByStatus(1) },
    { key: "4", label: "จำนวนข้อมูลทีตรวจสอบเรียบร้อย", children: countByStatus(2) },
    { key: "5", label: "จำนวนข้อมูลทีเป็นข่าวจริง", children: countByresults(1) },
    { key: "6", label: "จำนวนข้อมูลทีเป็นข่าวเท็จ", children: countByresults(0) },
  ];

  const items2 = [
    {
      key: "0",
      label: "",
      children: user && (
        <img
          src={
            "https://www.jollyboxdesign.com/wp-content/uploads/2021/08/Administrator.png"
          }
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      ),
    },
    { key: "1", label: "ชื่อ-สกุล", children: user && <span>{user.username}</span> },
    { key: "2", label: "เบอร์ติดต่อ", children: user && <span>{user.phone_number}</span> },
    { key: "3", label: "ไอดีไลน์", children: user && <span>{user.Id_line}</span> },
    { key: "4", label: "อีเมล", children: user && <span>{user.email}</span> },
    { key: "5", label: "จังหวัด", children: user && <span>{user.province}</span> },
    {
      key: "6",
      label: "เกี่ยวกับผู้เขียน",
      children:
        "เกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียน",
    },
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
              <PieChart>
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
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
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
              <PieChart>
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
          height: "50%",
        }}
      >
        <Descriptions title="ข้อมูล" bordered items={items} />
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
        <Button type="primary" onClick={showModal}>
          ออกจากระบบ
        </Button>
        <Modal
          title="Basic Modal"
          open={isModalOpen} ห
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>ต้องการออกจากระบบ</p>
        </Modal>
      </Card>
    </AdminMenu>
  );
};

export default M_DB_Adm_Menu;
