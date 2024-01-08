import React, { useState, useEffect } from "react";
import { Table, Card, Select, Divider, DatePicker } from "antd";
import { Box } from "@mui/material";
import moment from "moment";
import "./MuiTable.css";

const MyTable = () => {
  const [formattedDate, setFormattedDate] = useState("");
  const curveAngle = 20;
  const paperColor = "#FFFFFF";
  const [tableData, setTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [options] = useState([
    {
      title: "ประเภทข้อมูล",
      value: "TypeInformation_request",
      name: "type_info_name",
      dataIndex: "mfi_ty_info",
      render: text => <span style={{ fontSize: '30px' }}>{text}</span>,
    },
    {
      title: "แหล่งที่มาของข้อมูล",
      value: "MediaChannels_request",
      name: "med_c_name",
      dataIndex: "mfi_med_c",
      render: text => <span style={{ fontSize: '30px' }}>{text}</span>,
    },
    {
      title: "รูปแบบข้อมูล",
      value: "FormatData_request",
      name: "fm_d_name",
      dataIndex: "mfi_fm_d",
      render: text => <span style={{ fontSize: '30px' }}>{text}</span>,
    },
  ]);

  useEffect(() => {
    if (!selectedOption) {
      setSelectedOption(options[0].title);
    }

    if (!formattedDate) {
      setFormattedDate('');
    }
  }, [options, selectedOption, formattedDate]);

  useEffect(() => {
    if (selectedOption) {
      const selected = options.find((opt) => opt.title === selectedOption);
      if (selected) {
        fetchData(selected.value, selected.name, selected.dataIndex);
      }
    }
  }, [selectedOption, formattedDate]);


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
          mfi_time: moment(data.mfi_time).format("YYYY-MM"),
        }));

        const filteredManage_Fake_Infodata = formattedManage_Fake_Infodata.filter(
          (data) => {
            if (!formattedDate || formattedDate.length === 0) return true;
            return data.mfi_time === formattedDate;
          }
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

        setTableData(countByMedCId);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const handleSelectDate = (date) => {
    if (date) {
      setFormattedDate(date.format("YYYY-MM"));
      console.log("date.format", date.format("YYYY-MM"));
    } else {
      setFormattedDate('');
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <div>
      <Card
        hoverable
        style={{
          margin: "auto",
          borderRadius: `${curveAngle}px`,
          backgroundColor: paperColor,
          width: "100%",
          height: "700px",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
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
              defaultValue={null}
              style={{
                marginRight: "10px",
                fontSize: "30px",
                height: "50px",
              }}
            />
          </div>
        </div>
        <Divider />
        <Box />
        <Table dataSource={tableData} columns={columns} /></Card></div>
  );
};

export default MyTable;
