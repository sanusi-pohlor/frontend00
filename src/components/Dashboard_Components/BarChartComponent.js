import React, { useState, useEffect } from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, Select, DatePicker, Divider, Form, Button, } from "antd";
import moment from "moment";

const MyBarChart = () => {
  const [formattedDate, setFormattedDate] = useState("");
  const curveAngle = 20;
  const paperColor = "#FFFFFF";
  const [chartData, setChartData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"];
  const [form] = Form.useForm();
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

  const fetchData = async (endpoint, name, dataIndex) => {
    try {
      const Manage_Fake_Info = await fetch(
        `https://fakenews001-392577897f69.herokuapp.com/api/Manage_Fake_Info_request`
      );
      const MediaChannels = await fetch(
        `https://fakenews001-392577897f69.herokuapp.com/api/${endpoint}`
      );

      if (Manage_Fake_Info.ok && MediaChannels.ok) {
        const Manage_Fake_Infodata = await Manage_Fake_Info.json();
        const formattedManage_Fake_Infodata = Manage_Fake_Infodata.map((data) => ({
          ...data,
          created_at: moment(data.created_at).format("YYYY-MM"),
        }));

        const filteredManage_Fake_Infodata = formattedManage_Fake_Infodata.filter(
          (data) => data.created_at === formattedDate
        );

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

  useEffect(() => {
    if (options.length > 0 && !selectedOption) {
      setSelectedOption(options[0].title);
    }
  }, [options, selectedOption]);

  // useEffect(() => {
  //   if (selectedOption || formattedDate) {
  //     const selected = options.find((opt) => opt.title === selectedOption);
  //     if (selected) {
  //       fetchData(selected.value, selected.name, selected.dataIndex);
  //     }
  //   }
  // }, [selectedOption, options, formattedDate]);

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const handleSelectDate = (date) => {
    const formattedDateValue = moment(date).format("YYYY-MM");
    setFormattedDate(formattedDateValue);
    // const selected = options.find((opt) => opt.title === selectedOption);
    // if (selected) {
    //   fetchData(selected.value, selected.name, selected.dataIndex);
    // }
  };

  const onFinish = async (values) => {
    const { selectedOption, formattedDate } = values;
    
    const selected = options.find((opt) => opt.title === selectedOption);
    
    if (selected && formattedDate) {
      setFormattedDate(formattedDate);
      setSelectedOption(selectedOption);
      
      fetchData(selected.value, selected.name, selected.dataIndex);
    }
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
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
        <div
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Th Sarabun New', sans-serif",
          }}
        >
          กราฟข้อมูล
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Form
              form={form}
              layout="vertical"
              name="form_register"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              style={{
                maxWidth: "100%",
                fontSize: "50px",
              }}
              labelCol={{ style: { fontSize: '18px' } }}
            >
              <Select
                value={selectedOption}
                onChange={handleSelectChange}
                style={{
                  marginRight: "10px",
                  fontSize: "50px",
                  height: "50px",
                }}
              >
                {options.map((option) => (
                  <Select.Option key={option.value} value={option.title}>
                    {option.title}
                  </Select.Option>
                ))}
              </Select>
              <DatePicker
                onChange={handleSelectDate}
                placeholder="เดือน/ปี"
                picker="month"
                size="large"
                style={{
                  marginRight: "10px",
                  fontSize: "30px",
                  height: "50px",
                }}
              />
              <Button 
              style={{
                fontSize: "15px",
                height: "50px",
              }}
                type="primary" htmlType="submit">
                ค้นหา
              </Button>
            </Form>
          </div>
        </div>
        <Divider />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" nameKey="name">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default MyBarChart;
