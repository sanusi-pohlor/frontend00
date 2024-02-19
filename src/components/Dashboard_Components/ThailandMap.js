import React, { useState, useEffect } from "react";
import { Card, Tooltip, Divider, DatePicker } from "antd";

const MapWidget = () => {
  const [formattedDate, setFormattedDate] = useState("");
  const [data, setData] = useState([]);
  const regionCounts = {};

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/FakeNewsInfo_request"
      );
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const countRegionData = () => {
    data
      .filter((item) => item.created_at.startsWith(formattedDate))
      .forEach((item) => {
        const regionId = item.fn_info_province;
        if (regionId) {
          regionCounts[regionId] = (regionCounts[regionId] || 0) + 1;
        }
      });
  };

  countRegionData();

  const getTooltipTitle = (regionId) => {
    const count = regionCounts[regionId] || 0;
    return ` จำนวน ${count} การรับแจ้ง`;
  };

  const handleSelectDate = (date) => {
    if (date) {
      setFormattedDate(date.format("YYYY-MM"));
      console.log("date.format", date.format("YYYY-MM"));
    } else {
      setFormattedDate("");
    }
  };
  return (
    <div>
      <Card hoverable className="DB-Card-container2">
        <div className="cardTitle">
          จำนวนการรับแจ้งข้อมูลเท็จโดยเครือข่ายผู้บริโภคภาคใต้
          <DatePicker
            onChange={handleSelectDate}
            placeholder="เดือน/ปี"
            picker="month"
            size="large"
            defaultValue={null}
            className="selectContainer"
          />
        </div>
        <Divider />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-60 630 500 400"
          aria-label="Map of Thailand"
        >
          <Tooltip
            title={`นครศรีธรรมราช${getTooltipTitle(4)}`}
            arrow
            placement="top"
            key="1"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={4}
              name="Nakhon Si Thammarat"
              d="m 164.65844,774.22255 0.79,0.01 0.33,-0.12 0.32,0.33 -0.43,0.61 0.58,0.38 1.1,0.09 0.32,-0.81 0.41,0.29 0.77,1.56 0.08,1.92 1.07,0.44 1.19,2.6 -0.41,0.75 -0.02,3.92 0.34,0.92 0.81,0.19 1.17,1.8 0.36,5.64 0.02,1.71 -0.03,5.42 2.96,20.2 0.9,1.41 0.48,0.26 0.7,-0.45 1.25,0.83 0.25,0.53 0.19,0.61 1.99,2.8 3,7.42 3.31,1.67 2.36,0.08 -1.24,-1.67 -0.41,-1.77 1.12,-2.71 -0.35,-1.46 -3.02,-1.33 1.54,0 2.1,1.07 2.62,3.22 3.46,9.25 1.31,4.83 3.91,21.4 0,0 -1.1,0.16 -0.12,-0.49 -0.44,0.03 -0.3,1.52 -4.08,-0.17 -0.21,0.79 -0.85,0.56 -5.88,1.82 0,0 -3.18,0.51 -1.67,1.32 -1.64,0.41 -4.05,-1.6 -1.95,-1.94 -2.55,0.45 -2.26,-0.76 -1.62,0.55 -1.25,-0.45 -0.77,0.5 -1.82,-0.4 -1.57,2.26 -3.14,0.08 0,0 0.44,-1.1 -0.65,-0.91 0.72,-1.49 -0.54,-0.43 0.44,-1.01 -0.6,-1 1.61,-1.13 -0.33,-1.28 -1.54,-1.23 -1.74,0.49 -3.15,-1.56 -1.75,0.23 -1.05,1.48 -0.9,0.22 0.26,0.41 -0.96,1.05 0.3,0.39 -0.83,0.09 -0.26,0.75 -0.67,-0.08 -0.79,1.77 -0.81,0.18 -0.8,1.37 0.31,1.02 -1.62,0.46 -1.71,-0.78 -0.56,0.42 -0.61,-1.62 -2.41,2.04 -0.74,-0.11 -0.4,-0.66 0.06,-4.61 -1.55,-0.15 0,0 0.05,-1.87 1.22,-1.15 -1.36,-2.74 -0.74,-4.51 -2.61,-1.85 -3.35,0.23 0.17,-0.61 -0.7,-0.68 0.08,-0.94 1.15,-0.63 -0.06,-1.04 0.93,-0.79 -0.51,-2.21 1.56,-2.4 -0.35,-1.47 -2.13,-1.06 0.02,-0.59 -0.51,0.16 0,0 -0.57,-0.27 -0.52,-2.34 -0.93,0.04 -1.02,-1.16 -0.4,0.08 -0.39,-1.29 -0.02,-0.8 0.98,-0.87 0.88,-1.76 -0.16,-0.79 2.39,-1.66 -0.4,-0.87 0.91,0.45 0.65,-0.86 1.29,-0.42 0.48,-1.49 1.53,1.34 1.11,-1.01 1.05,0.11 0.1,-0.9 1.06,-0.23 0.36,-1.01 -0.65,-0.02 -0.01,-0.64 2.33,-3 1,-0.19 -0.49,-2.04 0.98,-1.18 1.13,0.17 -0.08,-0.7 1.12,-1 -0.18,-1.61 2.05,-1.61 0.52,-2.74 -0.51,-0.28 0.26,-3.14 -0.6,-1.69 0.89,-0.96 1.94,-0.08 -0.16,-1.72 1.13,-1.08 0.15,-1.29 1.98,-1.11 0.68,0.01 0.87,1.07 1.29,-1.24 0.3,0.52 3,-0.88 -0.01,-1.06 -0.5,-0.59 0.37,-0.99 1.27,0.24 0.82,-0.65 0.52,-2.23 0.76,-0.87 0.12,-2.5 -0.39,-3.62 0.34,-1.73 -1.35,-1.05 0.97,-1.14 -0.05,-1.8 0.55,-0.23 0.47,-1.17 -0.37,-4.91 0.92,-0.63 0.51,-1.38 0,0 0.95,0.39 z"
              fill="#f8a45e"
            />
          </Tooltip>
          <Tooltip
            title={`กระบี่${getTooltipTitle(1)}`}
            arrow
            placement="top"
            key="2"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={1}
              name="Krabi"
              d="m 114.33844,887.05255 0.83,0.7 0.63,1.9 1.47,1.16 -0.29,2.36 2.35,4.72 -0.91,1.6 -2.12,-2.18 -2.21,-4.57 -0.46,-3.68 0.33,-0.64 -0.47,-0.91 0.85,-0.46 z m 2.02,-2.51 1.87,0.6 0.94,-0.46 0.78,0.93 0.66,1.66 -0.8,1.35 0.37,1.27 -0.36,1.51 -0.7,-1.03 -1.14,0.02 -0.24,0.49 -1.25,-1 -1.25,-2.6 -0.79,-0.39 0.02,-2.08 1.89,-0.27 z m -1.27,-11.12 0.78,0.06 1.21,1.01 1.23,-0.17 0.31,1.54 1.04,-0.31 0.52,0.4 0.37,2.18 -0.89,1.26 -0.53,3.65 -1.03,1.35 -3.48,-0.79 -1.23,-3.26 -0.07,-2.36 0.56,-0.81 -0.86,-2.06 1.69,-0.38 0.38,-1.31 z m -6.32,-0.28 1.37,0.59 0.7,2.05 -0.13,0.99 0.61,0.54 -0.41,0.87 -1.73,-2.6 -1.75,-1.17 0.25,-1.01 1.09,-0.26 z m 3.79,-1.85 0.76,0.04 1.19,1.56 -0.59,1.32 -0.87,0.34 -1.08,-2.04 0.15,-1.09 0.44,-0.13 z m 4.08,-2.03 0.54,-0.07 0.04,0.82 -0.9,1.76 -0.52,0.06 0.45,-2.97 0.39,0.4 z m -5.94,-0.9 0.48,0.19 0.63,1.76 -0.57,1.22 -0.04,2.1 -1.59,-4.86 1.09,-0.41 z m -18.920004,-47.66 1.27,0.16 1.72,-3.03 0.86,0.15 2.36,2.16 0.32,-1.01 2.920004,0.02 1.06,1.92 1.94,0.58 3.19,3.8 -0.14,1.36 0.55,0.66 0.59,2.75 -0.77,3.4 0.62,1.14 1.57,0.57 4.92,3.68 5.31,-0.33 5.76,2.02 3.7,2.37 0.87,0.08 1.05,-0.83 0,0 0.51,-0.16 -0.02,0.59 2.13,1.06 0.35,1.47 -1.56,2.4 0.51,2.21 -0.93,0.79 0.06,1.04 -1.15,0.63 -0.08,0.94 0.7,0.68 -0.17,0.61 3.35,-0.23 2.61,1.85 0.74,4.51 1.36,2.74 -1.22,1.15 -0.05,1.87 0,0 -0.52,0.52 0,0 -0.25,0.45 -0.61,-0.09 0,0 -0.58,-0.23 -0.77,0.98 -1.54,0.23 -0.02,0.65 -1.39,0.38 -0.59,1.27 0.9,0.65 -2.58,2.17 1.06,1.94 -0.4,1.01 1.03,0.1 -0.14,1.27 -0.9,1.09 0.06,0.77 1.15,0.46 0.23,3.03 -0.85,1.48 -0.73,-0.01 -0.06,0.55 -0.74,0.05 -1.05,1.28 0,0 -1.08,-1.12 -1.08,0.4 -0.84,-0.44 -0.57,-0.63 -0.35,-0.79 -0.31,0.52 -0.36,-0.23 -0.08,-0.57 -0.29,0.02 -0.47,-0.02 -0.63,-1.7 -2.12,-1.54 -0.01,-2.06 -0.27,-0.18 -0.35,-2.29 -0.78,-0.55 -1,0.43 -0.35,-0.7 0.38,-0.87 -1.51,0.13 -1.04,-0.97 2.12,-5.51 -1.04,1.08 -0.62,-0.14 0.78,-1.26 1.33,-0.68 -0.06,-1.13 -0.26,0.81 -1.05,0.45 -0.25,-0.37 -0.94,1.07 0.17,0.62 -0.76,1.6 -1.82,1.13 -0.6,-0.61 -0.34,-1.79 -1.08,-1.11 -1.44,0.14 -0.38,0.47 -2.02,-3.73 0.99,-0.83 -2.58,-2.45 0.35,-0.73 -0.3,-0.31 -0.48,0.44 -1.5,-0.88 -0.66,0.08 1.38,0.58 0.13,0.58 -1.53,1.32 -1.38,-0.5 -1.12,1.76 -1.900004,-2.58 -0.87,-0.42 -1.99,0.33 0.08,1.11 -0.6,0.09 -0.07,-1.13 -1.77,-2.42 0.6,-0.96 0.11,-2.12 0.66,-0.59 -0.5,-0.57 0.11,-0.83 -0.61,1.08 -0.54,-0.06 0.36,-0.44 -0.2,-1 0.92,-1.74 -0.24,-1.12 0.44,-0.19 -0.82,-0.66 -0.33,-1.69 -0.6,-0.44 0.34,-1.83 -0.6,-0.61 0.19,1.3 -0.76,2.68 -0.55,-0.18 0.75,-2.67 -0.45,-0.2 0.18,-0.72 -0.58,-0.81 0.07,-1.81 -3.21,1.96 -0.71,0.9 -0.5,-1.3 -0.67,0.64 -0.37,-0.26 -0.05,-1.78 0.93,-2.55 -0.27,-1.32 2.22,-0.91 -1.41,-1.84 1.12,-1.11 0,0 0.03,-2.16 -1.07,-1.52 1.61,-2.05 1.2,-4.33 1.08,-1.4 -0.21,-2.48 z"
              fill="#17b2fe"
            />
          </Tooltip>
          <Tooltip
            title={`พังงา${getTooltipTitle(7)}`}
            arrow
            placement="top"
            key="3"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={7}
              name="Phangnga"
              d="m 80.918436,856.63255 2.18,1.64 1.62,-0.35 -0.39,1.25 1.19,1.34 -0.73,1.73 0.97,3.71 -1.17,5.1 -0.17,-1.06 -0.78,-0.8 -0.16,1.68 -0.27,-2.63 -0.81,-2.01 0.47,-1.02 -0.41,-1.07 0.99,0.26 0.54,-1.78 -1.49,-1.49 -1,-0.1 -1.36,-2.32 -0.42,-1.24 0.6,-0.92 0.6,0.08 z m 6.33,-5.76 -0.11,3.03 -0.8,0.76 0.14,1.98 -0.43,0.25 -0.05,1.14 -0.4,0 -0.41,-1.26 -1.29,0.14 -1.62,-1.51 0.87,0.35 0.82,-0.26 0.9,-2.46 1.4,-1.9 0.98,-0.26 z m -24.68,-56.05 3.46,1.55 0.19,0.57 -1.77,2.84 -0.8,1.51 -1.27,3.66 -0.16,-1.56 -1.1,-1.78 1,-2.69 -0.24,-2.11 -0.82,-1.48 1.51,-0.51 z m 1.35,-10.43 0.6,1.02 -0.12,1.32 0.63,-0.55 1.14,1.58 0.71,2.87 -2.01,2.49 -3.52,0.68 -0.4,-0.18 0.21,-6.41 0.84,-0.99 -0.03,-1.65 1.95,-0.18 z m 2.65,0.62 0.66,0.68 -0.43,1.53 -1.4,-1.83 0.06,-1.81 1.11,1.43 z m -1.07,-6.7 0.26,0.41 -1.95,2.88 0.47,0.9 -0.63,0.36 -0.17,0.81 -1.33,0.49 0.02,-2.37 0.84,-0.17 2,-3.77 0.49,0.46 z m 5.34,-6.1 0.77,-0.21 0.84,0.72 2.09,-0.76 1.46,1.46 -0.91,0.91 1.06,-0.33 0.63,1.12 1.7,-0.29 0,0 1.42,0.82 0.24,2.84 -0.39,1.25 -1.49,1.31 -0.42,1.08 -0.16,1.93 0.58,1.26 -1.38,0.42 -0.11,1.63 0.92,2.89 -1.44,1.22 1.02,3.2 1.54,1.39 -0.36,0.84 -0.75,-0.15 -2.92,1.31 -0.53,1.39 0.91,0.87 -0.74,2.51 4.05,1.01 0.57,1.36 1.46,0.16 -0.19,0.92 1.34,1.08 0.15,0.99 2.95,1.15 -0.3,5.76 -1.61,2.03 -1.64,0.55 -0.58,0.93 1.87,1.5 2.61,0.79 0.55,-0.78 1.86,-0.48 0.63,-0.98 0.89,0.29 0.83,-0.38 1.96,1.96 0,0 0.24,2.41 -1.08,1.4 -1.2,4.33 -1.61,2.05 1.07,1.52 -0.03,2.16 0,0 -1.42,0.93 0.94,1.97 -1.36,0.31 -0.97,-0.07 -0.83,-1.83 -0.1,1.02 -0.9,0.55 0.33,0.85 -0.57,0.75 -2.17,0.67 -0.62,0.67 -2.25,1.06 -0.69,-1.11 -0.77,1.62 -3.62,-0.19 -0.66,0.68 0.89,0.21 1.04,1.06 -0.26,1.74 0.77,3.21 -1.6,1.87 -0.61,1.88 0.53,0.82 -0.7,0.93 -0.34,0.13 -0.42,-1.48 -0.63,-0.34 -0.55,1.72 -1.1,0.7 -0.93,-0.85 -0.9,-3.3 -0.99,0 -0.65,0.53 -0.77,-0.75 0.15,-0.88 -0.7,0.35 -1.61,-0.59 -0.72,0.21 0.01,-2.75 -1.78,-8.4 -3.39,-12.39 0.61,-0.8 0.95,1.17 0.74,0.39 1.18,2.61 0.14,-2.54 -2.41,-1.98 -0.05,-0.63 1.19,-0.85 -0.15,-1.66 -0.53,-0.38 0.93,-0.59 0.15,-1.56 -0.82,-4.59 -1.27,-1.01 0.12,-0.54 0.54,0.66 0.82,-0.09 1.57,-1.8 0.02,-1.91 -0.61,-1.3 0.84,-0.95 -0.05,-2.41 0.77,-0.54 0.89,-3.47 2.26,-3.59 0.74,-0.47 1.84,1.27 1.5,2.18 0.19,-0.86 -0.88,-2.13 -0.95,-0.87 1.5,-0.65 -1.39,-0.46 2.63,-2.32 -0.76,0.02 -2.66,2.15 -1.44,-0.95 -0.58,-1.16 0.79,-1.55 1.13,-0.84 1.28,-0.06 1.3,1.01 0.07,-0.54 -0.7,-0.62 0.84,-0.67 -1.29,0.21 -0.24,-0.73 0.47,-0.75 -1.39,0.36 -0.6,-1.43 -0.05,-2.3 -1.77,-3.04 0.92,-1.91 0.37,2.28 0.53,0.56 -0.33,-0.87 0.56,-1.86 2.23,1.9 -0.91,-1.29 0,-0.99 -1.47,-0.96 1.65,-2.15 -0.53,-0.66 1.15,-0.61 0.97,-3.75 z"
              fill="#00c7bc"
            />
          </Tooltip>
          <Tooltip
            title={`ภูเก็ต${getTooltipTitle(9)}`}
            arrow
            placement="top"
            key="4"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={9}
              name="Phuket"
              d="m 64.148436,849.97255 2.99,1.87 1.08,4.07 1.34,-0.48 0.13,1.33 0.75,0.92 1.31,0.39 1.86,-1.27 0.42,0.41 -0.32,1.19 0.57,0.33 -0.9,0.93 0.08,1.16 -0.67,-0.22 -0.72,1.13 -0.01,1.57 1.07,1.02 -0.33,0.3 -0.96,-0.47 -0.9,0.73 0.28,2.29 1.03,1.26 0.38,1.94 0.65,0.22 0.18,-1.08 0.68,-0.25 -0.21,1.43 0.46,0.67 -0.95,0.43 0.44,0.81 -0.81,-0.63 -0.57,0.35 -0.48,-0.56 -0.75,0.47 0.25,0.54 -0.6,0.85 0.3,0.72 0.86,0.18 -0.54,0.39 0.67,2.01 -1.13,-0.86 -0.45,0.62 -0.74,-2.2 -0.82,-0.08 -1.36,1.06 -0.82,2.31 0.4,0.6 -1.36,0.67 -0.52,0.83 -0.62,-0.07 0.25,-1.15 -1.16,0.01 -0.27,-0.86 0.95,-1.16 -0.05,-0.93 -0.6,-0.36 0.36,-0.58 -0.27,-1.58 -1.98,-2 0.23,-0.45 1.65,0.44 0.45,-1.51 -1.51,-1.11 -0.73,0.13 -0.3,-0.87 0.31,-0.9 1.03,-0.06 0.36,-0.54 -0.85,-2.08 0.97,0.25 0.46,-0.9 -0.27,-2.12 -1.08,-0.58 0.39,-1.37 -0.48,-0.88 0.1,-0.46 1.65,-0.7 0.34,-1.31 -1.2,-5.99 0.61,-0.21 z"
              fill="#0f5d09"
            />
          </Tooltip>
          <Tooltip
            title={`สุราษฎร์ธานี${getTooltipTitle(14)}`}
            arrow
            placement="top"
            key="5"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={14}
              name="Surat Thani"
              d="m 183.90844,755.75255 0.66,0.08 0.02,0.92 0.71,0.34 -2.3,3.81 -0.04,0.83 1.2,2.11 -1.63,0.13 -0.66,1.13 -0.8,0.09 -1.22,2.11 -1.59,-0.19 -1.46,0.92 -0.9,-0.88 -1.49,0.32 -0.01,-0.75 0.53,-0.09 -0.16,-1.85 -1.08,-2.38 1,-0.4 0.05,-2.71 -0.39,-1.29 -1.07,-1 4.66,-1.13 1.07,1.11 1.31,-0.23 0.69,0.89 0.97,-0.25 0.77,0.55 0.97,-1.4 -0.11,-0.91 0.3,0.12 z m -89.730004,-0.78 1.85,-1.84 0.15,-3.97 0.93,-0.38 0.62,0.61 1.88,-1.32 1.710004,-0.06 1.79,-1.83 0.93,0.32 1.3,-0.64 1.66,1 1.93,0 0.31,0.59 1.67,0.08 0.64,0.52 0.58,-0.49 0.18,0.74 1.76,0.41 1.26,1.83 1.52,1.03 1.4,-0.78 -1.05,-1 0.06,-0.51 -0.61,-0.2 0.42,-1.06 1.64,0 1,0.71 0.74,-0.66 2.07,-0.05 0,0 0.78,3.32 2.62,3.6 -0.02,2.19 2.19,5.75 1.48,2.49 2.9,3.49 -1.09,-0.4 -1.91,2.24 0.05,0.51 -1.55,0.55 -1.44,1.11 -0.19,0.66 0.17,2.41 0.64,0.91 -0.36,1.42 1.2,1.51 1.78,1.09 2.87,-1.62 0.39,0.79 0.37,0.04 0.79,0.43 0.47,1.01 1.55,-0.46 -0.09,1.25 0.6,0.49 2.91,-1.07 3.62,0.5 0.41,-0.66 1.31,-0.38 0.88,-2.73 1.65,-2.07 5.15,1.17 2.74,-2.53 1.38,0.1 0.98,-0.67 -0.08,-1.63 0.79,0.81 2.12,0.89 1.25,-0.85 0.92,0.62 0.93,-0.46 0,0 -0.51,1.38 -0.92,0.63 0.37,4.91 -0.47,1.17 -0.55,0.23 0.05,1.8 -0.97,1.14 1.35,1.05 -0.34,1.73 0.39,3.62 -0.12,2.5 -0.76,0.87 -0.52,2.23 -0.82,0.65 -1.27,-0.24 -0.37,0.99 0.5,0.59 0.01,1.06 -3,0.88 -0.3,-0.52 -1.29,1.24 -0.87,-1.07 -0.68,-0.01 -1.98,1.11 -0.15,1.29 -1.13,1.08 0.16,1.72 -1.94,0.08 -0.89,0.96 0.6,1.69 -0.26,3.14 0.51,0.28 -0.52,2.74 -2.05,1.61 0.18,1.61 -1.12,1 0.08,0.7 -1.13,-0.17 -0.98,1.18 0.49,2.04 -1,0.19 -2.33,3 0.01,0.64 0.65,0.02 -0.36,1.01 -1.06,0.23 -0.1,0.9 -1.05,-0.11 -1.11,1.01 -1.53,-1.34 -0.48,1.49 -1.29,0.42 -0.65,0.86 -0.91,-0.45 0.4,0.87 -2.39,1.66 0.16,0.79 -0.88,1.76 -0.98,0.87 0.02,0.8 0.39,1.29 0.4,-0.08 1.02,1.16 0.93,-0.04 0.52,2.34 0.57,0.27 0,0 -1.05,0.83 -0.87,-0.08 -3.7,-2.37 -5.76,-2.02 -5.31,0.33 -4.92,-3.68 -1.57,-0.57 -0.62,-1.14 0.77,-3.4 -0.59,-2.75 -0.55,-0.66 0.14,-1.36 -3.19,-3.8 -1.94,-0.58 -1.06,-1.92 -2.920004,-0.02 -0.32,1.01 -2.36,-2.16 -0.86,-0.15 -1.72,3.03 -1.27,-0.16 0,0 -1.96,-1.96 -0.83,0.38 -0.89,-0.29 -0.63,0.98 -1.86,0.48 -0.55,0.78 -2.61,-0.79 -1.87,-1.5 0.58,-0.93 1.64,-0.55 1.61,-2.03 0.3,-5.76 -2.95,-1.15 -0.15,-0.99 -1.34,-1.08 0.19,-0.92 -1.46,-0.16 -0.57,-1.36 -4.05,-1.01 0.74,-2.51 -0.91,-0.87 0.53,-1.39 2.92,-1.31 0.75,0.15 0.36,-0.84 -1.54,-1.39 -1.02,-3.2 1.44,-1.22 -0.92,-2.89 0.11,-1.63 1.38,-0.42 -0.58,-1.26 0.16,-1.93 0.42,-1.08 1.49,-1.31 0.39,-1.25 -0.24,-2.84 -1.42,-0.82 0,0 0.44,-1.21 2.3,-2.32 1.23,0.16 1.47,-0.63 0.24,0.85 1.43,0.91 1.54,-0.99 1.46,0.63 0.66,-0.53 0.42,-2.27 -1.62,0.03 0.41,-0.77 -0.46,-1.89 0.85,0.5 0.77,-0.37 0.64,-0.68 -0.98,-1.09 0.19,-1.02 1.68,-0.24 0.67,-1.07 0.76,-0.1 0.1,-0.83 2.03,-2.44 1.12,-0.1 0.3,-0.55 -0.66,-0.93 0.02,-1.07 -1.37,-0.57 0.14,-1.24 z m 89.980004,-6.61 -0.87,1.36 -1.25,-1.16 -3.56,-1.16 -1.15,-0.97 -0.1,-1.55 -0.87,-0.78 -0.19,-1.55 0.58,-1.46 3.66,0 2.21,0.78 1.64,1.75 -0.1,4.74 z m -15.88,-29.09 0.9,1.08 -0.34,0.43 0.43,0.08 0.22,0.89 -1.14,1.25 0.24,0.45 -0.69,-0.06 -0.32,0.55 0,-0.51 -0.84,-0.4 0.8,-1.47 -0.54,-1.49 0.32,-0.79 0.73,0.36 0.23,-0.37 z"
              fill="#fd464a"
            />
          </Tooltip>
          <Tooltip
            title={`ระนอง${getTooltipTitle(11)}`}
            arrow
            placement="top"
            key="6"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={11}
              name="Ranong"
              d="m 72.338436,743.47255 0.88,2.46 -1.78,1.95 -0.78,0.11 0.41,-1.01 -1.08,-0.88 0.61,-1.25 0.41,0.42 0.69,-0.18 0.22,-1.04 -0.53,-0.22 0.95,-0.36 z m 2.79,-6.28 0.91,0 0.11,0.43 -0.54,1.25 0.35,0.94 -0.31,0.72 -0.68,-0.07 -0.12,1.7 -0.38,-0.69 -0.5,0.16 -0.38,-0.45 -0.15,-1.13 0.79,-1 -0.36,-1.46 0.93,-1.14 0.33,0.74 z m 28.580004,-62.8 0.62,0.78 0,0 0.37,1.22 1.32,0.58 -1.63,3.55 0.28,0.94 0.77,-0.58 0.26,0.87 0.87,-0.1 0.52,0.48 -0.13,1.6 0.81,-0.02 0.71,0.81 -0.37,1.74 0.92,-0.31 0.42,0.82 -0.35,1.39 -1.25,0.98 1.44,2.05 -0.71,0.3 -0.45,1.18 -1.82,0.68 -0.47,1.21 -1.1,0.49 -0.69,1.68 0.73,1.19 -0.12,1.64 0.77,0.43 -0.26,0.77 1.86,0.28 0.06,0.61 0.54,0.17 -0.42,1.25 0.8,0.93 -2.9,4.26 -0.1,0.72 0.66,0.84 -2.57,5.34 1.18,1.14 0.07,0.67 -1.31,0.37 -0.11,1.44 -0.62,0.34 0.31,2.22 -1.87,2.06 1.54,0.36 2.33,-0.24 0.67,0.66 0.12,1.83 -2.59,2.32 -1.47,-0.01 -1,1.09 -0.410004,2.05 -0.63,0.76 -2.27,-0.96 -1.69,1.14 -0.22,1.02 -2.06,1.66 -0.14,1.97 -1.82,2.21 -0.69,-0.12 -3.38,3.12 0.03,1.43 -0.42,0.23 1.04,1.8 -0.27,1.2 0.83,1.35 -0.27,0.56 0.89,0.55 -0.83,1.48 0.43,0.62 1.28,-0.1 1.64,1.31 1.68,0.46 1.13,1.84 0,0 -0.04,1.29 1.37,0.57 -0.02,1.07 0.66,0.93 -0.3,0.55 -1.12,0.1 -2.03,2.44 -0.1,0.83 -0.76,0.1 -0.67,1.07 -1.68,0.24 -0.19,1.02 0.98,1.09 -0.64,0.68 -0.77,0.37 -0.85,-0.5 0.46,1.89 -0.41,0.77 1.62,-0.03 -0.42,2.27 -0.66,0.53 -1.46,-0.63 -1.54,0.99 -1.43,-0.91 -0.24,-0.85 -1.47,0.63 -1.23,-0.16 -2.3,2.32 -0.44,1.21 0,0 -1.7,0.29 -0.63,-1.12 -1.06,0.33 0.91,-0.91 -1.46,-1.46 -2.09,0.76 -0.84,-0.72 -0.77,0.21 0,0 0.3,-3.77 0.71,0.3 0.74,-0.61 0.99,-3.63 0.25,-3.01 1.25,-3.95 0.94,-0.17 -0.58,0.66 1.01,2.02 0.41,-0.41 0.4,-0.2 0.66,1.55 0.41,0 -0.33,-2.71 2.42,-1.11 -0.72,-0.79 -1.05,-0.98 -1.85,0.19 -1.07,-0.77 -0.11,-1.7 0.5,0.26 0.54,-0.66 1.67,1.8 0.33,-0.52 -0.56,-1.25 0.88,-1.61 -0.99,0.4 -0.92,-2.27 1.65,0.87 1.28,-0.67 1.83,-3.1 0.01,-1.32 -1.12,0.26 -0.56,-0.57 -1.57,1.04 -0.49,-0.17 0.82,-1.05 -0.37,-1.93 1.98,-0.54 0.08,0.57 2.62,-3.11 -0.22,-0.6 -1.73,2.31 -0.75,0.18 -1.4,-3.61 1.2,-0.32 -0.32,-1.06 0.93,-0.9 0.68,0.09 0.27,0.63 1.07,-2.04 -0.21,-1.06 1.1,-0.62 1.24,-4.49 3.41,-6.03 0.43,-0.91 1.03,-1.49 4.14,-12.59 0.94,-1.06 0.21,-4.65 2.02,-3.36 1.24,-0.39 -0.23,-0.54 0.82,-0.96 -0.59,-0.97 0.82,-0.46 0.48,-1.14 -0.11,-1.34 -0.3,-1.52 -0.67,-0.68 0.43,-1.55 -0.74,-1.59 -0.83,-0.06 -1.06,-1.01 0.9,-2.1 -0.31,-1.88 0.68,-0.25 0.77,-1.63 5.100004,-5.55 z"
              fill="#ff73a6"
            />
          </Tooltip>
          <Tooltip
            title={`ชุมพร${getTooltipTitle(2)}`}
            arrow
            placement="top"
            key="7"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={2}
              name="Chumphon"
              d="m 121.97844,657.54255 -0.23,1.19 1.18,0.33 0.25,0.57 2.07,0.35 0.16,0.73 2.38,0.46 0.29,0.52 2.09,0.42 0.52,0.56 0.72,-0.8 2.99,0.27 0.72,-0.68 1.06,0.44 0.92,-0.24 0.47,0.73 1.8,0.44 4.13,-2.52 1.77,0.26 0,0 -0.35,3.41 0.69,1.53 0.63,-0.02 -0.09,0.78 0.69,0.44 -0.81,0.98 0.15,0.77 -0.84,0.79 -0.04,-0.93 -1.05,-0.88 -0.93,1.12 -1.77,0.04 -1.89,7.36 -1.34,1.31 -0.89,2.45 -1.39,1.11 0.02,0.76 0.69,0.33 -0.73,0.73 -0.63,-1.24 -1.88,0.73 -1.69,3.64 -1.03,1.1 0.17,1.35 -0.61,0.8 -0.03,1.92 -0.93,0.44 -0.94,-0.39 -0.53,0.41 0.27,1.84 0.42,0.21 1.25,-0.63 -0.6,1.08 -1.77,0.31 -0.3,1.48 0.91,1.72 2.84,2.49 0.01,3.33 -0.76,0.64 -1.22,-0.67 -1.02,1.29 -0.64,-0.9 -2.49,-1.04 -3.09,1.91 0.51,0.85 -0.39,1.39 0.67,1.44 0.65,0.37 1.39,0.62 0.3,0.66 0.85,-0.37 -0.15,1.46 1.2,1.6 1.2,-0.76 0.54,0.33 -2.3,1.59 -0.74,-0.54 -0.55,0.23 -1.49,4.16 -1.15,0.76 -0.46,1.29 0.07,1.98 0.56,0.84 -0.33,0.78 1.06,1.7 0.92,0.1 0.06,0.43 -0.65,0.61 0.48,0.69 -0.26,0.67 -1.06,-0.25 -0.62,1.3 0.66,3.17 -0.26,3.47 0.58,2.45 -1.27,1.12 -0.6,1.47 0.56,5.4 0.87,2.54 0,0 -2.07,0.05 -0.74,0.66 -1,-0.71 -1.64,0 -0.42,1.06 0.61,0.2 -0.06,0.51 1.05,1 -1.4,0.78 -1.52,-1.03 -1.26,-1.83 -1.76,-0.41 -0.18,-0.74 -0.58,0.49 -0.64,-0.52 -1.67,-0.08 -0.31,-0.59 -1.93,0 -1.66,-1 -1.3,0.64 -0.93,-0.32 -1.79,1.83 -1.710004,0.06 -1.88,1.32 -0.62,-0.61 -0.93,0.38 -0.15,3.97 -1.85,1.84 0,0 -1.13,-1.84 -1.68,-0.46 -1.64,-1.31 -1.28,0.1 -0.43,-0.62 0.83,-1.48 -0.89,-0.55 0.27,-0.56 -0.83,-1.35 0.27,-1.2 -1.04,-1.8 0.42,-0.23 -0.03,-1.43 3.38,-3.12 0.69,0.12 1.82,-2.21 0.14,-1.97 2.06,-1.66 0.22,-1.02 1.69,-1.14 2.27,0.96 0.63,-0.76 0.410004,-2.05 1,-1.09 1.47,0.01 2.59,-2.32 -0.12,-1.83 -0.67,-0.66 -2.33,0.24 -1.54,-0.36 1.87,-2.06 -0.31,-2.22 0.62,-0.34 0.11,-1.44 1.31,-0.37 -0.07,-0.67 -1.18,-1.14 2.57,-5.34 -0.66,-0.84 0.1,-0.72 2.9,-4.26 -0.8,-0.93 0.42,-1.25 -0.54,-0.17 -0.06,-0.61 -1.86,-0.28 0.26,-0.77 -0.77,-0.43 0.12,-1.64 -0.73,-1.19 0.69,-1.68 1.1,-0.49 0.47,-1.21 1.82,-0.68 0.45,-1.18 0.71,-0.3 -1.44,-2.05 1.25,-0.98 0.35,-1.39 -0.42,-0.82 -0.92,0.31 0.37,-1.74 -0.71,-0.81 -0.81,0.02 0.13,-1.6 -0.52,-0.48 -0.87,0.1 -0.26,-0.87 -0.77,0.58 -0.28,-0.94 1.63,-3.55 -1.32,-0.58 -0.37,-1.22 0,0 1.09,-0.47 1.24,-3.12 0.84,0.96 1.53,0.05 0.95,-1.33 0.68,0.01 1.88,-1.69 0.06,-1.07 -0.76,-0.65 0.37,-0.77 -0.44,-2.09 1.64,-3.17 1.74,0.54 0.53,1.04 1.47,-0.51 0.97,-1.21 0.62,-2.79 1.83,-1.18 1.37,-0.16 z"
              fill="yellow"
            />
          </Tooltip>
          <Tooltip
            title={`สงขลา${getTooltipTitle(12)}`}
            arrow
            placement="top"
            key="8"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={12}
              name="Songkhla"
              d="m 204.61844,910.47255 0.01,0.13 0,0 0.54,1.85 3.44,1.8 -1.08,0.51 0,0 -1.41,0.5 -0.72,1.96 0.93,0.56 0.64,-0.31 0.53,2.66 1.21,0.66 0.54,-0.2 0.36,-0.32 0.25,1.04 0.46,0.01 0.43,-0.85 1.42,1.54 4.18,-0.56 2.86,-2.44 -1.14,-3.11 0.21,-0.43 2.9,3.26 7.56,11.08 2.75,2.83 3.59,1.68 1.34,-0.74 4.13,3.73 5.66,3.21 4.61,0.17 0,0 -0.03,0.37 -1.21,0.22 -0.09,0.58 2.06,0.79 -0.68,-0.1 -0.44,1.71 -1.9,1.7 0.22,2.4 -0.92,1.2 2.51,0.56 0.17,3.11 3.34,2.86 0,0 -1.32,1.05 1.58,1.77 -1.85,1.14 -0.99,1.67 -1.9,0.26 -0.23,1.55 -0.97,1.3 -1.58,1.13 -1.56,-0.27 -1.1,2.35 -0.57,0.02 -0.26,0.58 -0.99,-0.18 -0.43,0.57 -0.71,2.64 0.67,1.89 -0.09,0.94 -0.4,0.09 0.62,2.24 -0.71,0.15 -0.58,1 -3.04,0.44 -1.04,0.57 -0.41,-1.22 0,0 0.42,-0.37 -0.13,-2.8 -0.4,-0.21 -0.77,0.68 -0.55,-0.65 0.1,-4.95 -3.07,-2.24 -0.82,0.53 -0.88,-0.26 -0.8,-3.27 -0.53,-0.12 -1.62,2.61 -0.76,0.02 -0.92,1.16 -2.06,0.67 -0.72,-0.42 -1.72,-0.67 -0.61,-0.76 -2.3,-0.8 -0.83,-0.85 -0.94,0.73 -2.45,-0.65 -1.44,-2.08 -1.4,0.29 -0.76,-0.72 -2.29,1.13 -3.97,-1.72 -0.81,-2.18 -2.61,-2.07 0.8,-1.03 -0.06,-3 -1.75,-1.11 -0.24,-1.97 -1.15,0.04 -0.38,1.11 -0.78,-0.18 -0.67,-0.11 -1.05,0.12 -2.06,-2.14 0,0 0.6,-2.34 -0.93,-0.84 -0.62,-2.4 0.53,-1.9 1.47,-2.39 -0.89,-1.58 -1.5,-1.12 -4.23,-0.77 -0.32,-0.97 -2.57,-2.54 0.24,-1.49 -1.35,-1.46 0.07,-0.79 1.02,-0.63 -1.02,-1.07 -0.5,-3.43 0,0 0.64,-0.14 -0.2,-1.88 2.18,-0.91 1.07,-0.98 3.02,1.12 1.25,-1.78 3.3,-1.24 1.23,0.04 1.61,-0.68 0.66,0.31 0.63,-0.83 1.31,0.08 0.76,-1.42 1.66,-1.27 -0.26,-1.48 1.6,-0.39 -0.26,-1.46 1.08,-0.42 0.3,-0.62 0,0 0.03,0.09 0,0 -0.01,0.49 0,0 0.01,0.03 z m -15.72,-38.18 5.88,-1.82 0.85,-0.56 0.21,-0.79 4.08,0.17 0.3,-1.52 0.44,-0.03 0.12,0.49 1.1,-0.16 0,0 5.42,23.72 2.95,10.37 3.45,7.95 4.25,5.96 -0.13,0.74 0.57,0.97 -0.97,0.51 -0.74,-0.63 -0.52,0.2 -0.73,-1.17 -4.07,-2.94 -2.44,0.33 0,0 -1.94,-1.25 1.34,-0.88 -0.06,-1.8 -0.46,-0.78 0.06,-2.73 -1.36,-1.28 0.44,-6.27 -1.29,-6.08 -2.44,-1.08 -2.38,0.06 -1.85,3.33 -0.16,1.57 -1.3,-0.96 -0.54,-2.52 1,-0.94 0.67,-1.64 0,0 1,0.75 0.5,-0.31 0,0 0.72,-3.13 0,0 -1.04,-7.82 -1.68,-3.41 -0.99,0.16 0,0 -1.05,1.09 -0.84,0.25 -1.87,-0.44 -0.63,0.52 0,0 -1.28,-0.51 0.03,-0.72 -0.65,-0.6 -1.88,-0.3 -1.25,0.63 1.16,-4.7 z"
              fill="#46b37a"
            />
          </Tooltip>
          <Tooltip
            title={`สตูล${getTooltipTitle(13)}`}
            arrow
            placement="top"
            key="9"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={13}
              name="Satun"
              d="m 130.45844,959.49255 1.34,0.81 1.3,0.09 -0.1,0.54 0.77,0.3 -0.13,1.84 -0.71,1.02 -1.97,0.06 -0.65,-3.06 0.15,-1.6 z m -1.97,-0.37 0.61,0.55 0.08,1.26 -2.5,1.19 -2.08,-0.52 -0.45,0.46 -0.78,-0.08 -0.49,-0.47 0.17,-0.36 1.04,0.41 -0.1,-0.54 0.99,-1.39 3.51,-0.51 z m 27.82,-9.18 0.36,1.1 0.3,0.39 0.43,-0.28 0.52,1.14 -0.37,3.96 1.05,1.66 -0.22,2.12 0.53,1.52 -0.37,1.27 -1.14,-0.76 -0.53,0.99 0.33,0.88 -0.54,-0.09 -0.59,0.7 -0.88,-1.03 -0.4,-1.97 -0.92,-1.28 -0.7,-0.01 -1.22,-2.3 0.35,-0.81 0.76,-0.24 0.14,-2.96 0.88,-0.19 0.89,-1.1 0.15,-3.97 0.34,-0.11 0.85,1.37 z m 6.42,-27.24 0.74,-0.15 0,0 1.44,-0.1 2.19,2.05 0.9,0.08 0.1,1.07 1.77,0.73 0.33,-0.76 1.46,-0.04 0.79,-1.06 2.76,-0.69 0.85,0.67 0.77,-0.12 1.04,-0.26 0.15,-0.67 1.06,-0.09 0,0 1.75,0.67 0.27,0.9 0.73,-1.27 1.18,0.11 0,0 0.5,3.43 1.02,1.07 -1.02,0.63 -0.07,0.79 1.35,1.46 -0.24,1.49 2.57,2.54 0.32,0.97 4.23,0.77 1.5,1.12 0.89,1.58 -1.47,2.39 -0.53,1.9 0.62,2.4 0.93,0.84 -0.6,2.34 0,0 -1.17,0.65 -1.07,1.51 0.55,0.95 0.07,1.71 -0.96,2.14 1.18,3.06 -1.32,0.44 -0.53,-0.45 -0.07,3.92 0.53,1.42 -0.33,1.3 -0.9,0.67 0.17,1.04 -1.58,3.26 -1.54,-6.15 -1.14,0.09 0.98,-2.36 -0.14,-1.4 -1.27,-0.42 -0.97,2.81 -2.85,-1.97 -2.17,-3.35 0.39,-0.27 -0.52,-0.66 -2.49,1.59 -0.09,-2.21 0.86,0.02 0.88,-0.86 -0.78,-0.53 -0.76,-2.74 -0.42,1.1 -0.67,0.39 -1.1,-1.27 0.25,-0.9 -0.54,-0.49 -0.58,0.38 -0.19,-1.07 0.64,-0.47 0.24,-1.06 -0.39,0.27 -0.34,-1.11 -0.21,1.34 -1.7,0.05 -2.65,-4.69 -0.4,1.01 -1.4,0.34 -0.46,-0.47 -0.33,-2.04 -1.45,-2.09 -0.45,-0.27 -1.25,0.64 -2.02,-1.46 -0.05,-0.57 -1.71,0.42 -0.79,-2.6 -0.52,-0.34 0.69,-0.47 -0.36,-2.66 0.67,-0.62 0.52,0.11 0.41,-0.15 -0.37,-0.97 -1.25,0.73 -0.82,-2.91 1.02,-0.84 -1.02,-1.66 1.78,-2.48 0.38,0.73 0.93,-1.55 -0.27,-0.79 1.54,-0.67 0.2,-1.28 1.2,0.44 z"
              fill="#998ed9"
            />
          </Tooltip>
          <Tooltip
            title={`ตรัง${getTooltipTitle(3)}`}
            arrow
            placement="top"
            key="10"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={3}
              name="Trang"
              d="m 150.02844,923.23255 1.25,0.25 2.02,2.07 -3.4,-0.82 -0.75,-2.2 0.88,0.7 z m -11.41,-10.24 1.86,0.04 1.67,0.79 -2.56,0.82 -1.24,1.2 0.01,0.98 -0.73,0.32 -1.27,-1.24 0.47,-1.29 -0.22,-1.56 1.14,-1.03 0.87,0.97 z m -0.05,-46.54 1.55,0.15 -0.06,4.61 0.4,0.66 0.74,0.11 2.41,-2.04 0.61,1.62 0.56,-0.42 1.71,0.78 1.62,-0.46 -0.31,-1.02 0.8,-1.37 0.81,-0.18 0.79,-1.77 0.67,0.08 0.26,-0.75 0.83,-0.09 -0.3,-0.39 0.96,-1.05 -0.26,-0.41 0.9,-0.22 1.05,-1.48 1.75,-0.23 3.15,1.56 1.74,-0.49 1.54,1.23 0.33,1.28 -1.61,1.13 0.6,1 -0.44,1.01 0.54,0.43 -0.72,1.49 0.65,0.91 -0.44,1.1 0,0 -0.27,0.48 1.18,0.92 0.58,2.13 0.83,1.02 -0.26,1.32 1.11,0.64 -0.26,0.62 0.56,0.46 0.01,2.91 1.98,1.42 -0.29,2.03 -1.89,0.35 1.65,1.51 -0.72,2.53 2.48,2.54 -1.12,1.71 0.08,0.63 2.06,1.83 -0.14,1.42 0.56,0.26 0.3,1.34 2.68,3.54 -0.43,1.55 0.64,0.86 0.03,1.62 2.27,0.76 0.51,3.46 -0.89,1.68 1.01,2.48 0.76,0.48 0.06,1.87 2.55,3.78 0,0 -1.06,0.09 -0.15,0.67 -1.04,0.26 -0.77,0.12 -0.85,-0.67 -2.76,0.69 -0.79,1.06 -1.46,0.04 -0.33,0.76 -1.77,-0.73 -0.1,-1.07 -0.9,-0.08 -2.19,-2.05 -1.44,0.1 0,0 -1.74,-0.55 -0.79,0.23 -1.74,-0.21 -2.38,1.34 0.19,-0.8 -0.8,-3.35 -1.41,0.65 -2.07,1.94 -1.48,-0.73 -1.81,-4.1 -2.5,-2.79 -0.01,-0.55 0.75,-1.7 1.83,-0.42 1.72,-4.45 0.89,0.52 -1.06,-1.87 -0.97,1.15 -0.48,2.54 -2.2,1.56 -1.36,-0.72 0.25,-1.03 -0.63,-1.61 0.71,-5.69 -0.55,0.37 -0.27,2.29 -1.18,0.94 -0.18,1.48 0.67,2.57 -0.46,1.73 -1,0.6 -3.35,-1.01 -1.14,-0.55 -0.53,-0.08 -1.16,-1.95 -2.67,-2.8 0.72,-1.63 -0.26,-2.63 -1.18,-3.57 -1.12,-0.94 -0.6,0.03 -0.39,0.69 -0.81,-1.25 1.41,-0.19 0.4,-1.53 -1.1,-1.35 -1.11,-2.64 -0.09,-1.91 -0.96,0.83 -0.56,-0.85 -0.21,-0.7 0.69,-0.9 -0.13,-0.51 0,0 1.05,-1.28 0.74,-0.05 0.06,-0.55 0.73,0.01 0.85,-1.48 -0.23,-3.03 -1.15,-0.46 -0.06,-0.77 0.9,-1.09 0.14,-1.27 -1.03,-0.1 0.4,-1.01 -1.06,-1.94 2.58,-2.17 -0.9,-0.65 0.59,-1.27 1.39,-0.38 0.02,-0.65 1.54,-0.23 0.77,-0.98 0.58,0.23 0,0 0.57,0.11 0.29,-0.47 0,0 0.6,-0.54 z"
              fill="#e676c5"
            />
          </Tooltip>
          <Tooltip
            title={`พัทลุง${getTooltipTitle(8)}`}
            arrow
            placement="top"
            key="11"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={8}
              name="Phatthalung"
              d="m 205.07844,903.77255 0.46,0.04 0,0 0.55,3.87 -0.28,0.8 2.1,1.74 -0.15,1.45 -1.07,0.49 -0.46,0.27 -0.92,-0.48 -0.29,-3.25 -0.31,0.34 0,0 -0.24,-0.12 0,0 -1.55,-1.79 0.8,-1.53 -0.13,-0.74 1.35,-1.11 0,0 0.14,0.02 z m -0.88,-6.72 0.75,0.05 -0.56,1.17 -1.29,0.13 -0.28,0.5 0.39,1.24 0.63,-0.17 0.26,1.52 -0.48,2.12 -1.03,0.47 0.16,3.02 -1.68,-0.17 -0.22,-0.87 0.59,-3.37 0.92,0.13 0.24,-0.48 -0.41,-0.6 -0.4,0.39 0,0 0,0 0,0 0.37,-2.44 -0.3,-1.38 2,-0.43 0,0 0.34,-0.83 z m -42.77,-23.82 3.14,-0.08 1.57,-2.26 1.82,0.4 0.77,-0.5 1.25,0.45 1.62,-0.55 2.26,0.76 2.55,-0.45 1.95,1.94 4.05,1.6 1.64,-0.41 1.67,-1.32 3.18,-0.51 0,0 -1.14,4.72 1.25,-0.63 1.88,0.3 0.65,0.6 -0.03,0.72 1.28,0.51 0,0 -0.7,1.26 -3.01,2.08 0.22,5.6 1.75,8.49 1.91,1.93 0.74,0.21 0.76,-0.7 -0.15,2.05 1.88,3.8 0.27,1.49 1.04,0.47 1.83,1.99 0.04,1 0.81,-0.03 0.93,-1.02 0.92,0.6 1.08,0.04 1.43,1.88 0,0 0.06,0.19 0,0 -0.3,0.62 -1.08,0.42 0.26,1.46 -1.6,0.39 0.26,1.48 -1.66,1.27 -0.76,1.42 -1.31,-0.08 -0.63,0.83 -0.66,-0.31 -1.61,0.68 -1.23,-0.04 -3.3,1.24 -1.25,1.78 -3.02,-1.12 -1.07,0.98 -2.18,0.91 0.2,1.88 -0.64,0.14 0,0 -1.18,-0.11 -0.73,1.27 -0.27,-0.9 -1.75,-0.67 0,0 -2.55,-3.78 -0.06,-1.87 -0.76,-0.48 -1.01,-2.48 0.89,-1.68 -0.51,-3.46 -2.27,-0.76 -0.03,-1.62 -0.64,-0.86 0.43,-1.55 -2.68,-3.54 -0.3,-1.34 -0.56,-0.26 0.14,-1.42 -2.06,-1.83 -0.08,-0.63 1.12,-1.71 -2.48,-2.54 0.72,-2.53 -1.65,-1.51 1.89,-0.35 0.29,-2.03 -1.98,-1.42 -0.01,-2.91 -0.56,-0.46 0.26,-0.62 -1.11,-0.64 0.26,-1.32 -0.83,-1.02 -0.58,-2.13 -1.18,-0.92 0.23,-0.49 z"
              fill="gray"
            />
          </Tooltip>
          <Tooltip
            title={`ปัตตานี${getTooltipTitle(6)}`}
            arrow
            placement="top"
            key="12"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={6}
              name="Pattani"
              d="m 265.75844,934.28255 5.2,3.32 5.94,1.15 4.03,1.6 1.15,-0.21 1.25,1.28 0.84,-0.02 11.32,18.17 0,0 -1.34,0.62 -2.37,-0.41 -1.1,-1.85 0.43,-0.32 -0.54,-0.58 0.23,-0.69 -1.36,0.25 -0.28,-0.98 -0.25,0.75 -0.14,-0.6 -0.84,0.02 -2.4,1.02 -0.21,1.29 1.52,1.18 -0.26,1.06 0,0 -1.86,1.06 -2.01,-0.43 -1.2,-1.4 0.06,-1.11 -0.97,-0.77 -1.44,0.22 -0.44,0.49 -1.22,-0.23 0,0 -0.01,0.62 0,0 -0.52,0.79 -1.61,-1.24 -2.44,1.81 -3.11,0.42 -0.27,0.52 -1.41,-0.96 -0.93,0.04 -0.82,-2.26 -0.05,-0.92 0.73,-0.43 -1.03,-3.46 0.62,-0.27 -0.49,-0.41 -0.95,1.7 -2.42,1.55 -1.7,2.62 -5.49,-0.9 -1.72,-1.32 0,0 -3.33,-2.85 -0.17,-3.12 -2.51,-0.56 0.91,-1.2 -0.21,-2.4 1.89,-1.7 0.44,-1.7 0.68,0.1 -2.06,-0.78 0.09,-0.58 1.21,-0.22 0.03,-0.37 0,0 8.31,-0.58 2.76,-1.02 2.02,-1.49 1.83,0.73 -0.19,0.54 0.46,0.39 1.38,-0.59 1.61,0.8 1.02,-0.95 -0.33,-1.32 -0.91,-0.21 -0.35,-1.07 -0.7,0.36 -0.82,-0.38 -0.35,-0.62 -0.77,-0.07 0.28,-0.32 -0.34,-0.37 -2.86,0.86 0.26,-0.47 z"
              fill="#fe1d93"
            />
          </Tooltip>
          <Tooltip
            title={`ยะลา${getTooltipTitle(10)}`}
            arrow
            placement="top"
            key="13"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={10}
              name="Yala"
              d="m 253.87844,956.06255 1.72,1.32 5.49,0.9 1.7,-2.62 2.42,-1.55 0.95,-1.7 0.49,0.41 -0.62,0.27 1.03,3.46 -0.73,0.43 0.05,0.92 0.82,2.26 0.93,-0.04 1.41,0.96 0.27,-0.52 3.11,-0.42 2.44,-1.81 1.61,1.24 0.52,-0.79 0,0 0.01,-0.62 0,0 1.22,0.23 0.44,-0.49 1.44,-0.22 0.97,0.77 -0.06,1.11 1.2,1.4 2.01,0.43 1.86,-1.06 0,0 1.07,1.55 -2.25,2.89 -2.85,2.15 1.15,0.83 -0.03,0.68 -1.35,0.07 -2.95,-1.29 -1.49,-0.15 0.37,2.71 -0.84,-0.43 -2.2,0.68 -0.21,1.16 -0.62,0.53 0.51,0.42 -0.15,1.23 -1.31,0.91 -0.67,1.48 0.81,1.27 -0.42,1.17 0.62,2.02 -0.49,1.71 0.53,0.39 -0.5,1.03 -1.66,1.09 1.14,2.82 1.54,0.57 0.3,0.98 0.74,0.06 0.58,0.87 0.4,1.24 -0.23,0.95 0.61,0.98 1.35,0.12 0.57,0.96 -0.07,1.8 0.56,1.79 -0.64,1.62 0.76,0.73 0.14,1.44005 0.73,0.53 -0.46,0.74 -0.02,2.41 0.57,0.06 0.13,0.54 0,0 -1.99,1.25 -5.19,-0.01 -1.68,2.61 -3.59,1.85 -1.85,-0.92 -0.9,0.56 -0.75,0.79 -0.95,2.67 0.67,1.99 -0.18,1.17 -2.23,1.82 -1.23,1.74 -2.13,0.79 -2.68,2.31 -0.15,-1.4 -1.25,-2.75 -3.32,-4.27 -0.48,-0.41 -1.83,-0.03 -0.96,-1.71 -1.76,-1.22 -0.25,-1.03 1.98,-1.94 -0.63,-1.02 0.22,-1.56 1.33,-1.87 -0.24,-0.76 0.72,-0.35 1.06,0.52 0.8,-0.6 1.47,0.56 1.08,-2.76 1.71,-1.78005 -1.39,-1.4 0.46,-2.43 -0.71,-1.33 1.98,-3.18 -2.86,-2.15 -2.09,-0.59 1.83,-2.41 1.48,-0.06 1.25,-1.05 -1.42,-2.88 0.44,-0.74 -1.19,-0.83 -5.04,0.5 -2.8,-2.42 -2.54,2.68 -2.36,0.31 -1.74,-1.13 -1.26,1.48 -1.7,-3.21 0.51,-1.29 0,0 0.41,1.22 1.04,-0.57 3.04,-0.44 0.58,-1 0.72,-0.15 -0.62,-2.24 0.4,-0.09 0.09,-0.94 -0.67,-1.89 0.71,-2.64 0.43,-0.58 0.99,0.19 0.26,-0.59 0.56,-0.01 1.11,-2.36 1.56,0.28 1.58,-1.13 0.97,-1.3 0.23,-1.55 1.9,-0.26 0.99,-1.68 1.85,-1.14 -1.58,-1.77 z"
              fill="#37bee8"
            />
          </Tooltip>
          <Tooltip
            title={`นราธิวาส${getTooltipTitle(5)}`}
            arrow
            placement="top"
            key="14"
            overlayStyle={{ fontSize: "25px" }}
          >
            <path
              id={5}
              name="Narathiwat"
              d="m 286.57844,960.33255 0.26,-1.06 -1.52,-1.18 0.21,-1.29 2.4,-1.02 0.84,-0.02 0.14,0.6 0.25,-0.75 0.28,0.98 1.36,-0.25 -0.23,0.69 0.54,0.58 -0.43,0.32 1.1,1.85 2.37,0.41 1.34,-0.62 0,0 6.3,8.5 2.47,1.51 1.31,0.25 5.25,5.77 9.01,6.22 0.35,0.68 -0.74,0.74 -0.2,1.85 1.03,3.45 -2.11,2.95 -0.53,1.53 -4.24,2.7 -1.31,1.41 0.06,0.91 -1.8,1.28 -0.4,0.97005 0.31,1.1 -1,0.48 -0.11,1.66 -0.44,0.46 0.07,0.47 0.72,0.24 0.71,2.35 -1.77,1.93 -1.43,-0.16 -0.82,0.56 -0.24,1.73 -2.22,1.43 -1.13,0.18 0.08,0.67 -0.88,1.46 0.29,1.19 -0.56,0.07 -1.61,-1.21 -0.96,-1.94 -1.24,-1 -1.46,0.72 -1.27,0.04 -0.24,1.53 -0.78,0.33 -0.61,-1.44 -1.97,-2.29 -0.11,-3.83 -1.79,-0.5 -1.39,-2.12 -2.24,-1.55 -2.82,1.02 -2.68,1.77 0,0 -0.13,-0.54 -0.57,-0.06 0.02,-2.41 0.46,-0.74 -0.73,-0.53 -0.14,-1.44005 -0.76,-0.73 0.64,-1.62 -0.56,-1.79 0.07,-1.8 -0.57,-0.96 -1.35,-0.12 -0.61,-0.98 0.23,-0.95 -0.4,-1.24 -0.58,-0.87 -0.74,-0.06 -0.3,-0.98 -1.54,-0.57 -1.14,-2.82 1.66,-1.09 0.5,-1.03 -0.53,-0.39 0.49,-1.71 -0.62,-2.02 0.42,-1.17 -0.81,-1.27 0.67,-1.48 1.31,-0.91 0.15,-1.23 -0.51,-0.42 0.62,-0.53 0.21,-1.16 2.2,-0.68 0.84,0.43 -0.37,-2.71 1.49,0.15 2.95,1.29 1.35,-0.07 0.03,-0.68 -1.15,-0.83 2.85,-2.15 2.25,-2.89 z"
              fill="#dd2ff2"
            />
          </Tooltip>
        </svg>
      </Card>
    </div>
  );
};

export default MapWidget;
