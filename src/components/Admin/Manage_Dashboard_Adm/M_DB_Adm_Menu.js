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
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"]; // Array of different colors
  const curveAngle = 20;
  const paperColor = "#FFFFFF";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
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

  const items = [
    {
      key: "1",
      label: "จำนวนข้อมูลที่แจ้ง",
      children: "20",
    },
    {
      key: "2",
      label: "จำนวนข้อมูลที่ยังไม่ตรวจสอบ",
      children: "5",
    },
    {
      key: "3",
      label: "จำนวนข้อมูลทีกำลังตรวจสอบ",
      children: "8",
    },
    {
      key: "4",
      label: "จำนวนข้อมูลทีตรวจสอบเรียบร้อย",
      children: "7",
    },
    {
      key: "5",
      label: "จำนวนข้อมูลทีเป็นข่าวจริง",
      children: "2",
    },
    {
      key: "6",
      label: "จำนวนข้อมูลทีเป็นข่าวเท็จ",
      children: "5",
    },
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
    {
      key: "1",
      label: "ชื่อ-สกุล",
      children: user && <span>{user.username}</span>,
    },
    {
      key: "2",
      label: "เบอร์ติดต่อ",
      children: user && <span>{user.phone_number}</span>,
    },
    {
      key: "3",
      label: "ไอดีไลน์",
      children: user && <span>{user.Id_line}</span>,
    },
    { key: "4", label: "อีเมล", children: user && <span>{user.email}</span> },
    {
      key: "5",
      label: "จังหวัด",
      children: user && <span>{user.province}</span>,
    },
    {
      key: "6",
      label: "เกี่ยวกับผู้เขียน",
      children:
        "เกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียนเกี่ยวกับผู้เขียน",
    },
  ];
  const [chartData, setChartData] = useState([]);

  const fetchData = async (endpoint, name, dataIndex) => {
    try {
      const response = await fetch(
        `https://fakenews001-392577897f69.herokuapp.com/api/${endpoint}`
      );
      if (response.ok) {
        const data = await response.json();

        const countByCategory = data.map((item) => {
          return {
            name: item[name],
            value: item[dataIndex],
          };
        });

        setChartData(countByCategory);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (options.length > 0) {
  //     options.forEach((option) => {
  //       fetchData(option.value, option.name, option.dataIndex);
  //     });
  //   }
  // }, [options]);
  const [options] = useState([
    {
      title: "แหล่งที่มาของข้อมูล",
      value: "MediaChannels_request",
      name: "med_c_name",
      dataIndex: "mfi_med_c",
    },
    {
      title: "รูปแบบข้อมูล",
      value: "FormatData_request",
      name: "fm_d_name",
      dataIndex: "mfi_fm_d",
    },
    {
      title: "ประเภทข้อมูล",
      value: "TypeInformation_request",
      name: "type_info_name",
      dataIndex: "mfi_ty_info",
    },
  ]);

  useEffect(() => {
    if (options.length > 0 && !selectedOption) {
      setSelectedOption(options[0].title);
    }
  }, [options, selectedOption]);

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

          setChartData(countByMedCId);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedOption) {
      const selected = options.find((opt) => opt.title === selectedOption);
      if (selected) {
        fetchData(selected.value, selected.name, selected.dataIndex);
      }
    }
  }, [selectedOption, options]);

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };
  return (
    <AdminMenu>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <Grid container spacing={2}>
        {options.map((option, index) => (
          <Grid key={index} item xs={12} md={4}>
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
              <Select value={selectedOption} onChange={handleSelectChange}>
                {options.map((option) => (
                  <Select.Option key={option.value} value={option.title}>
                    {option.title}
                  </Select.Option>
                ))}
              </Select>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((entry, index) => (
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
        ))}
      </Grid>
      <Divider />
      <Descriptions title="ข้อมูล" bordered items={items} />
      <br />
      <Divider />
      <Descriptions
        style={{
          fontSize: "30px",
        }}
        title="ข้อมูล Admin"
        items={items}
      />
      <br />
      <Button type="primary" onClick={showModal}>
        ออกจากระบบ
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>ต้องการออกจากระบบ</p>
      </Modal>
    </AdminMenu>
  );
};

export default M_DB_Adm_Menu;
