import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, Divider, Select, DatePicker } from "antd";
import moment from "moment";
import { Typography } from "@mui/material";
const { Option } = Select;
const { RangePicker } = DatePicker;

const MyPieChart = () => {
  const [formattedDateRange, setFormattedDateRange] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#6A5ACD",
    "#B22222",
    "#7FFFD4",
    "#3CB371",
    "#FFD700",
    "#FF4500",
    "#4169E1",
    "#32CD32",
    "#FFD700",
    "#808080",
    "#800080",
    "#FF1493",
    "#8A2BE2",
    "#00FA9A",
    "#AF19FF",
    "#20B2AA",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
    "#FF00FF",
    "#000000",
    "#808000",
    "#800000",
  ];
  const [options] = useState([
    {
      title: "ประเภทข้อมูล",
      value: "TypeInformation_request",
      name: "type_info_name",
      dataIndex: "mfi_ty_info",
    },
    {
      title: "แหล่งที่มาของข้อมูล",
      value: "MediaChannels_request",
      name: "med_c_name",
      dataIndex: "mfi_c_info",
    },
    {
      title: "รูปแบบข้อมูล",
      value: "FormatData_request",
      name: "fm_d_name",
      dataIndex: "mfi_fm_d",
    },
  ]);

  useEffect(() => {
    if (!selectedOption) {
      setSelectedOption(options[0].title);
    }

    if (!formattedDateRange) {
      setFormattedDateRange([]);
    }
  }, [options, selectedOption, formattedDateRange]);

  useEffect(() => {
    const fetchData = async (endpoint, name, dataIndex) => {
      try {
        const Manage_Fake_Info = await fetch(
          `https://checkkonproject-sub.com/api/mfi_d_request`
        );
        const MediaChannels = await fetch(
          `https://checkkonproject-sub.com/api/${endpoint}`
        );

        if (Manage_Fake_Info.ok && MediaChannels.ok) {
          const Manage_Fake_Infodata = await Manage_Fake_Info.json();
          const formattedManage_Fake_Infodata = Manage_Fake_Infodata.map(
            (data) => ({
              ...data,
              created_at: moment(data.created_at).format("YYYY-MM"),
            })
          );

          const filteredManage_Fake_Infodata =
            formattedManage_Fake_Infodata.filter((data) => {
              if (formattedDateRange.length === 0) return true;
              return (
                data.created_at >= formattedDateRange[0] &&
                data.created_at <= formattedDateRange[1]
              );
            });

          const MediaChannelsData = await MediaChannels.json();
          const countByMedCId = MediaChannelsData.map((channel) => {
            const count = filteredManage_Fake_Infodata.filter(
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
  }, [options, selectedOption, formattedDateRange]);

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const handleSelectDate = (dates) => {
    if (dates) {
      setFormattedDateRange(dates.map((date) => date.format("YYYY-MM")));
    } else {
      setFormattedDateRange([]);
    }
  };
  const renderCustomizedLabel = ({ name, value }) => {
    if (value === 0) return null;
    return `${value}`;
  };
  return (
    <div>
      <Card hoverable className="DB-Card-container1">
        <div className="cardTitle">
          <div className="setcardContent">
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              className="selectContainer"
            >
              {options.map((option) => (
                <Option key={option.value} value={option.title}>
                  <Typography variant="body1" sx={{ fontSize: "20px" }}>
                    {option.title}
                  </Typography>
                </Option>
              ))}
            </Select>
            <RangePicker
              onChange={handleSelectDate}
              placeholder={['ตั้งแต่เดือน', 'ถึงเดือน']}
              picker="month"
              size="large"
              defaultValue={null}
              className="selectContainer"
            />
          </div>
        </div>
        <Divider />
        <ResponsiveContainer width="100%" height={400}>
          <PieChart className="PieChartContainer">
            <Tooltip />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={130}
              label={renderCustomizedLabel}
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
    </div>
  );
};

export default MyPieChart;
