import React, { useState, useEffect } from "react";
import { Card, Divider, DatePicker, Select } from "antd";
import { Box } from "@mui/material";
import moment from "moment";
import "./MuiTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
const { Option } = Select;

const MyTable = () => {
  const [formattedDate, setFormattedDate] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptionColumns, setSelectedOptionColumns] = useState([]);
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
      dataIndex: "mfi_med_c",
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
        `https://checkkonproject-sub.com/api/Manage_Fake_Info_request`
      );
      const MediaChannels = await fetch(
        `https://checkkonproject-sub.com/api/${endpoint}`
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

  useEffect(() => {
    if (selectedOption) {
      const selected = options.find((opt) => opt.title === selectedOption);
      if (selected) {
        const columns = [
          { field: "name", headerName: selected.title, flex: 1, headerClassName: 'header-class', cellClassName: 'cell-class' },
          { field: "value", headerName: "จำนวน", flex: 1, headerClassName: 'header-class', cellClassName: 'cell-class' },
        ];
        setSelectedOptionColumns(columns);
      }
    }
  }, [selectedOption]);

  const tableDataWithId = tableData.map((row, index) => ({
    ...row,
    id: index + 1,
  }));
  const CustomPagination = () => {
    return null;
  };
  return (
    <div>
      <Card
        hoverable
        className="CardContainer"
      >
        <div
          className="cardTitle"
        >
          <div
            className="cardContent"
          >
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              className="selectContainer"
            >
              {options.map((option) => (
                <Option key={option.value} value={option.title}>
                  <Typography variant="body1" sx={{ fontSize: "20px" }}>{option.title}</Typography>
                </Option>
              ))}
            </Select>
            <DatePicker
              onChange={handleSelectDate}
              placeholder="เดือน/ปี"
              picker="month"
              size="large"
              defaultValue={null}
              className="datePickerContainer"
            />
          </div>
        </div>
        <Divider />
        <Box />
        <DataGrid
          rows={tableDataWithId}
          columns={selectedOptionColumns}
          pageSize={5}
          autoHeight
          components={{
            Pagination: CustomPagination,
          }}
          className="datePickerContainer"
        />
      </Card>
    </div>
  );
};

export default MyTable;
