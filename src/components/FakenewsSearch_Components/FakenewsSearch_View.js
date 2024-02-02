import React, { useEffect, useState } from "react";
import { Card, Descriptions, Image, Input, Divider, Modal } from "antd";
import { Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";

const FakenewsSearch_View = () => {
  const [fakeNewsInfo, setFakeNewsInfo] = useState(null);
  const { id } = useParams();
  const [province, setProvince] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [selectOptions_c_info, setSelectOptions_c_info] = useState([]);
  const [selectOptions_fm, setSelectOptions_fm] = useState([]);
  const [selectOptions_dis, setSelectOptions_dis] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_moti, setSelectOptions_moti] = useState([]);
  const [selectOptions_data, setSelectOptions_data] = useState([]);
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/AmUser"
      );
      if (response.ok) {
        const userData = await response.json();
        console.log("user :", userData);
        setUserInfo(userData);
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

  const fetchFakeNewsInfo = async () => {
    console.log("id :", id);
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/Manage_Fake_Info_show/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setFakeNewsInfo(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchFakeNewsInfo();
  }, [id]);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await fetch(
          "https://checkkonproject-sub.com/api/Province_request"
        );
        if (response.ok) {
          const pv = await response.json();
          const filteredIds = pv.filter(
            (item) =>
              item.id === (fakeNewsInfo && fakeNewsInfo.fn_info_province)
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

    if (fakeNewsInfo && fakeNewsInfo.fn_info_province) {
      fetchProvince();
    }
  }, [fakeNewsInfo]);

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/${endpoint}`
      );
      if (response.ok) {
        const typeCodes = await response.json();
        console.log("ddd = ", typeCodes);
        stateSetter(typeCodes);
      } else {
        console.error(
          `Error fetching ${fieldName} codes:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error fetching ${fieldName} codes:`, error);
    }
  };

  const onChange_mfi_med_c_id = () => {
    fetchDataAndSetOptions(
      "MediaChannels_request",
      "med_c",
      setSelectOptions_med
    );
  };

  const onChange_mfi_c_info_id = () => {
    fetchDataAndSetOptions(
      "Motivation_request",
      "c_info",
      setSelectOptions_c_info
    );
  };

  const onChange_mfi_fm_d_id = () => {
    fetchDataAndSetOptions("FormatData_request", "fm_d", setSelectOptions_fm);
  };

  const onChange_mfi_dis_c_id = () => {
    fetchDataAndSetOptions(
      "DetailsNotiChannels_request",
      "dnc_scop",
      setSelectOptions_dis
    );
  };
  const onChange_mfi_ty_info_id = () => {
    fetchDataAndSetOptions(
      "TypeInformation_request",
      "type_info",
      setSelectOptions_ty
    );
  };

  const onChange_mfi_moti_id = () => {
    fetchDataAndSetOptions("Motivation_request", "moti", setSelectOptions_moti);
  };

  const onChange_mfi_data_cha_id = () => {
    fetchDataAndSetOptions(
      "DataCharacteristics_request",
      "data_cha",
      setSelectOptions_data
    );
  };
  const onChange_dnc_med_id = () => {
    fetchDataAndSetOptions(
      "MediaChannels_request",
      "med_c",
      setSelectOptions_med
    );
  };

  const onChange_mfi_province = () => {
    fetchDataAndSetOptions("Province_request", "prov", setSelectOptions_prov);
  };

  useEffect(() => {
    onChange_dnc_med_id();
    onChange_mfi_data_cha_id();
    onChange_mfi_moti_id();
    onChange_mfi_ty_info_id();
    onChange_mfi_dis_c_id();
    onChange_mfi_fm_d_id();
    onChange_mfi_c_info_id();
    onChange_mfi_med_c_id();
    onChange_mfi_province();
  }, []);

  const renderReporter_fn_info_source = () => {
    if (!selectOptions_med || !fakeNewsInfo?.mfi_med_c) {
      return null;
    }

    const source = selectOptions_med.find(
      (source) => source.id === fakeNewsInfo?.mfi_med_c
    );
    return source && <span>{source.med_c_name}</span>;
  };

  const renderReporter_mfi_dis_c = () => {
    if (!selectOptions_med || !fakeNewsInfo?.mfi_dis_c) {
      return null;
    }

    const source = selectOptions_med.find(
      (source) => source.id === fakeNewsInfo?.mfi_dis_c
    );
    return source && <span>{source.med_c_name}</span>;
  };

  const render_fm_d_name = () => {
    if (!selectOptions_fm || !fakeNewsInfo?.mfi_fm_d) {
      return null;
    }

    const source = selectOptions_fm.find(
      (source) => source.id === fakeNewsInfo?.mfi_fm_d
    );
    return source && <span>{source.fm_d_name}</span>;
  };

  const render_prov_name = () => {
    const provinceId = parseInt(fakeNewsInfo.mfi_province, 10);
    if (!selectOptions_prov || !provinceId) {
      return null;
    }

    const source = selectOptions_prov.find(
      (source) => source.id === provinceId
    );
    return source && <span>{source.prov_name}</span>;
  };

  const render_mfi_moti_name = () => {
    if (!selectOptions_moti || !fakeNewsInfo?.mfi_moti) {
      return null;
    }

    const source = selectOptions_moti.find(
      (source) => source.id === fakeNewsInfo?.mfi_moti
    );
    return source && <span>{source.moti_name}</span>;
  };

  const render_mfi_data_cha = () => {
    if (!selectOptions_data || !fakeNewsInfo?.mfi_data_cha) {
      return null;
    }

    const source = selectOptions_data.find(
      (source) => source.id === fakeNewsInfo?.mfi_data_cha
    );
    return source && <span>{source.data_cha_name}</span>;
  };

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>{label}</Typography>
  );

  const items = [
    {
      key: "1",
      label: createTypography("ประทับเวลา"),
      children: fakeNewsInfo && createTypography(
        <span>
          {fakeNewsInfo.mfi_time &&
            moment(fakeNewsInfo.mfi_time).locale("th").format("DD MMMM YYYY")}
        </span>
      ),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "2",
      label: createTypography("จังหวัดของท่าน"),
      children: fakeNewsInfo && createTypography(<span>{render_prov_name()}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "4",
      label: createTypography("แหล่งที่มาของข่าวปลอม"),
      children: fakeNewsInfo && createTypography(<span>{renderReporter_fn_info_source()}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "6",
      label: createTypography("ระบุลิ้งค์ข้อมูล (ถ้ามี)"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_link}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "7",
      label: createTypography("แหล่งที่มาของข้อมูล"),
      span: 3,
      children: fakeNewsInfo && createTypography(<span>{renderReporter_mfi_dis_c()}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "8",
      label: createTypography("จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_num_mem}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "9",
      label: createTypography("หน่วยงานที่เก็บข้อมูล"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_agency}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "10",
      label: createTypography("หัวข้อข้อมูลผิดพลาด"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_d_topic}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "11",
      label: createTypography("รูปแบบของข้อมูล"),
      children: fakeNewsInfo && createTypography(<span>{render_fm_d_name()}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "12",
      label: createTypography("ช่องทางการเผยแพร่"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_dis_c}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "13",
      label: createTypography("ผู้เผยแพร่ข้อมูล"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_publ}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "14",
      label: createTypography("ประเภทของข้อมูล"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_ty_info}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "15",
      label: createTypography("เฉพาะโควิด-15"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_only_cv}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "16",
      label: createTypography("มีเนื้อหาเกี่ยวกับ"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_con_about}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "17",
      label: createTypography("แรงจูงใจการเผยแพร่"),
      children: fakeNewsInfo && createTypography(<span>{render_mfi_moti_name()}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "18",
      label: createTypography("จำนวนการวนซ้ำ"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_iteration}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "19",
      label: createTypography("การตรวจสอบข้อมูล"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.mfi_che_d}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "20",
      label: createTypography("ลักษณะข้อมูล"),
      children: fakeNewsInfo && createTypography(<span>{render_mfi_data_cha()}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
    {
      key: "21",
      label: createTypography("เพิ่มเมื่อ"),
      children: fakeNewsInfo && createTypography(<span>{fakeNewsInfo.created_at}</span>),
      labelStyle: { background: '#7BBD8F', color: '#FFFFFF' } 
    },
  ];

  return (
    <Paper
      elevation={0}
      className="paperContainer"
      style={{ backgroundColor: "#e4e4e4" }}
    >
      <Card className="cardsection">
        <div className="cardsectionContent">
          ข่าวสาร
          <div className="searchContainer">
            <Input
              type="text"
              size="large"
              placeholder="ค้นหา"
              style={{ marginRight: "10px" }}
              onChange={handleSearch}
              prefix={<SearchOutlined className="site-form-item-icon" />}
            />
          </div>
        </div>
      </Card>
      <br />
      <Card
        className="cardContent"
      >
        <Descriptions
          title="รายละเอียดข้อมูลเท็จ"
          layout="vertical"
          bordered
          items={items}
        />{" "}</Card>
    </Paper>
  );
};

export default FakenewsSearch_View;
