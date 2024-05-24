import React, { useState, useEffect } from "react";
import { Card, Divider, DatePicker, Select } from "antd";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Box } from "@mui/material";
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

    if (!formattedDate) {
      setFormattedDate("");
    }
  }, [options, selectedOption, formattedDate]);

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
              if (!formattedDate || formattedDate.length === 0) return true;
              return data.created_at === formattedDate;
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
  
          setTableData(countByMedCId);
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
  }, [options,selectedOption, formattedDate]);

  

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const handleSelectDate = (date) => {
    if (date) {
      setFormattedDate(date.format("YYYY-MM"));
    } else {
      setFormattedDate("");
    }
  };

  useEffect(() => {
    if (selectedOption) {
      const selected = options.find((opt) => opt.title === selectedOption);
      if (selected) {
        const columns = [
          {
            field: "name",
            headerName: selected.title,
            flex: 1,
            headerClassName: "header-class",
            cellClassName: "cell-class",
            align: 'left', // ปรับชิดขวาเป็นชิดซ้าย
          },
          {
            field: "value",
            headerName: "จำนวน",
            flex: 0.2,
            headerClassName: "header-class header-right-aligned",
            cellClassName: "cell-class",
            align: 'right', // ปรับชิดขวาเป็นชิดซ้าย
          },
        ];
        setSelectedOptionColumns(columns);
      }
    }
  }, [selectedOption,options]);

  const tableDataWithId = tableData.map((row, index) => ({
    ...row,
    id: index + 1,
  }));
  return (
    <div>
      <Card hoverable className="DB-Card-container2">
        <div className="cardTitle">
          <div className="setcardContent">
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              className="selectContainer"
            >
              {options.map((option) => (
                <Option key={option.value} value={option.title}>
                  <Typography variant="body1" sx={{ fontSize: "25px" }}>
                    {option.title}
                  </Typography>
                </Option>
              ))}
            </Select>
            <DatePicker
              onChange={handleSelectDate}
              placeholder="เดือน/ปี"
              picker="month"
              size="large"
              defaultValue={null}
              className="selectContainer"
            />
          </div>
        </div>
        <Divider />
        <Box />
        <div className="chart-container" style={{ overflowX: 'auto', height: '500px' }}>
        <DataGrid
          rows={tableDataWithId}
          columns={selectedOptionColumns}
        /></div>
      </Card>
    </div>
  );
};

export default MyTable;
