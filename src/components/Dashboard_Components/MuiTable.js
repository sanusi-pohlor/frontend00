import React, { useState, useEffect } from "react";
import { Table, Card, Select } from "antd";
import { Box } from "@mui/material";

const MyTable = () => {
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
    if (options.length > 0 && !selectedOption) {
      setSelectedOption(options[0].title);
    }
  }, [options, selectedOption]);

  useEffect(() => {
    const fetchData = async (endpoint, name, dataIndex) => {
      try {
        const Manage_Fake_Info = await fetch(
          "https://fakenew-c1eaeda38e26.herokuapp.com/api/Manage_Fake_Info_request"
        );
        const MediaChannels = await fetch(
          `https://fakenew-c1eaeda38e26.herokuapp.com/api/${endpoint}`
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
  }, [selectedOption, options]);

  const handleSelectChange = (value) => {
    setSelectedOption(value);
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
      <Select
        value={selectedOption}
        onChange={handleSelectChange}
        style={{
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
      <Box />
      <Table dataSource={tableData} columns={columns} />
    </div>
  );
};

export default MyTable;
