import React, { useEffect, useState } from "react";
import {  Card, Descriptions } from "antd";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import AdminMenu from "../Adm_Menu";

const Adm_Mm_View = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [province, setProvince] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/User_edit/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await fetch(
          "https://checkkonproject-sub.com/api/Province_request"
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

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label}
    </Typography>
  );

  const items = [
    {
      key: "1",
      label: createTypography("ชื่อ-นามสกุล"),
      children: user && createTypography(user.username),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "2",
      label: createTypography("นามสกุล"),
      children: user && createTypography(user.lastName),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "3",
      label: createTypography("รับข้อมูลผ่านอีเมล"),
      children:
        user &&
        createTypography(user.receive_ct_email === 1 ? "รับ" : "ไม่รับ"),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "4",
      label: createTypography("อีเมล"),
      children: user && createTypography(user.email),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "5",
      label: createTypography("เบอร์โทรศัพท์"),
      children: user && createTypography(user.phone_number),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "6",
      label: createTypography("ไลน์ไอดี"),
      children: user && createTypography(user.Id_line),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "7",
      label: createTypography("จังหวัดที่อยู่"),
      children: province.length > 0 && createTypography(province[0].prov_name),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
  ];
  
  return (
    <AdminMenu>
      <Card className="cardsection">
        <div className="cardsectionContent">ข้อมูลสมาชิก</div>
      </Card>
      <br/>
      <Card>
        <Descriptions layout="vertical" bordered items={items} />
      </Card>
    </AdminMenu>
  );
};

export default Adm_Mm_View;
