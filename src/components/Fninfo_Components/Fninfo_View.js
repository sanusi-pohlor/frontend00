import React, { useEffect, useState } from "react";
import { Badge, Descriptions, Image, Steps, Divider } from "antd";
import { useParams } from "react-router-dom";
import UserProfile from "../User_Comoponents/Profile_Menu";
import moment from "moment";
import { Typography } from "@mui/material";
import axios from 'axios';

const FnInfoView = () => {
  const [fakeNewsInfo, setFakeNewsInfo] = useState(null);
  const [province, setProvince] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [data, setData] = useState([]);
  const [about, setAbout] = useState([]);
  const { id } = useParams();
  const [results, setResults] = useState([]);

  const fetchFakeNewsInfo = async () => {
    try {
      const response = await axios.get(
        `https://checkkonproject-sub.com/api/FakeNewsInfo_show/${id}`
      );
      if (response.status === 200) {
        const data = await response.data;
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://checkkonproject-sub.com/api/mfi_fn_request/${fakeNewsInfo.id}`
        );
        if (response.status === 200) {
          const pv = await response.data;
          setData(pv);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [fakeNewsInfo]);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get(
          "https://checkkonproject-sub.com/api/About_request"
        );
        if (response.status === 200) {
          const pv = await response.data;
          const filteredIds = pv.filter(
            (item) => item.id === (data.length > 0 && data[0].mfi_con_about)
          );
          setAbout(filteredIds);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAbout();
  }, [data]);

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await axios.get(
          "https://checkkonproject-sub.com/api/Province_request"
        );
        if (response.status === 200) {
          const pv = await response.data;
          const filteredIds = pv.filter(
            (item) =>
              item.id === (fakeNewsInfo && fakeNewsInfo.fn_info_province)
          );
          setProvince(filteredIds);
        } else {
          console.error("Error fetching province data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching province data:", error);
      }
    };
    fetchProvince();
  }, [fakeNewsInfo]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          "https://checkkonproject-sub.com/api/AmUser"
        );
        if (response.status === 200) {
          const userData = await response.data;
          const filteredIds = userData.filter(
            (item) => item.id === (fakeNewsInfo && fakeNewsInfo.fn_info_nameid)
          );
          setUserInfo(filteredIds);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserInfo();
  }, [fakeNewsInfo]);

  useEffect(() => {
    const fetchDataAndSetOptions = async () => {
      try {
        const response = await axios.get(
          "https://checkkonproject-sub.com/api/MediaChannels_request"
        );
        if (response.status === 200) {
          const userData = await response.data;
          const filteredIds = userData.filter(
            (item) => item.id === (fakeNewsInfo && fakeNewsInfo.fn_info_source)
          );
          setSelectOptions_med(filteredIds);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchDataAndSetOptions();
  }, [fakeNewsInfo]);
  const Results = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Result_request"
      );
      if (response.ok) {
        const pv = await response.json();
        setResults(pv);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    Results();
  }, [])
  if (fakeNewsInfo === null) {
    return (
      <UserProfile>
        <div>Loading...</div>
      </UserProfile>
    );
  }

  const createTypography = (text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {text}
    </Typography>
  );
  const renderResultText = (id) => {
    console.log(id);
        const ResultsData = results.find(
          (item) => item.id === id
        );
        return ResultsData ? ResultsData.result_name : "ไม่พบข้อมูล";
  };
  const items = [
    {
      key: "1",
      label: createTypography("หัวข้อ"),
      children: fakeNewsInfo && createTypography(fakeNewsInfo.fn_info_head),
    },
    {
      key: "2",
      label: createTypography("ผู้แจ้ง"),
      children:
        fakeNewsInfo &&
        createTypography(
          userInfo.length > 0
            ? `${userInfo[0].username} ${userInfo[0].lastName || ""}`
            : "Loading..."
        ),
    },
    {
      key: "3",
      label: createTypography("จังหวัด"),
      children:
        fakeNewsInfo &&
        createTypography(
          province.length > 0 ? province[0].prov_name : "Loading..."
        ),
    },
    {
      key: "4",
      label: createTypography("เนื้อหา"),
      children: fakeNewsInfo && createTypography(fakeNewsInfo.fn_info_content),
    },
    {
      key: "5",
      label: createTypography("แหล่งที่มาของข่าวปลอม"),
      children:
        fakeNewsInfo &&
        createTypography(
          selectOptions_med.length > 0
            ? selectOptions_med[0].med_c_name
            : "Loading..."
        ),
    },
    {
      key: "6",
      label: createTypography("แจ้งเมื่อ"),
      children:
        fakeNewsInfo &&
        createTypography(
          fakeNewsInfo.created_at &&
          moment(fakeNewsInfo.created_at).locale("th").format("DD MMMM YYYY")
        ),
    },
    {
      key: "7",
      label: createTypography("รายละเอียดเพิ่มเติม"),
      children: fakeNewsInfo && fakeNewsInfo.fn_info_more ? createTypography(fakeNewsInfo.fn_info_more) : createTypography("ไม่ได้กรอกข้อมูล"),
    },    
    {
      key: "8",
      label: createTypography("ลิ้งค์ข้อมูล"),
      children: fakeNewsInfo && fakeNewsInfo.fn_info_link ? createTypography(fakeNewsInfo.fn_info_link) : createTypography("ไม่ได้กรอกข้อมูลแทน"),
    },
    {
      key: "9",
      label: createTypography(
        "จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ"
      ),
      children: fakeNewsInfo && createTypography(fakeNewsInfo.fn_info_num_mem),
    },
    {
      key: "10",
      label: createTypography("วัน/เดือน/ปี ที่เกิดเหตุ"),
      children:
        fakeNewsInfo &&
        createTypography(
          fakeNewsInfo.fn_info_dmy &&
          moment(fakeNewsInfo.fn_info_dmy).locale("th").format("DD MMMM YYYY")
        ),
    },
    {
      key: "11",
      label: createTypography("ภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ"),
      children: (
        fakeNewsInfo &&
        (
          <>
            {[
              fakeNewsInfo.fn_info_image_0,
              fakeNewsInfo.fn_info_image_1,
              fakeNewsInfo.fn_info_image_2,
            ]
              .filter(image => image !== null)
              .map((image, index) => (
                <Image
                  key={`image_${index}`}
                  style={{ width: '200px', height: '200px', marginRight: '10px' }}
                  src={image}
                  alt={`รูปภาพข่าวปลอม ${index}`}
                />
              ))}
          </>
        )
      ),
      span: 2,
    },
    {
      key: "12",
      label: createTypography("สถานะ", "25px", 3),
      children: fakeNewsInfo && (
        <React.Fragment>
          <Badge
            status={
              fakeNewsInfo.fn_info_status === 0
                ? "warning"
                : fakeNewsInfo.fn_info_status === 1
                  ? "processing"
                  : "success"
            }
            text={
              fakeNewsInfo.fn_info_status === 0
                ? createTypography("รอตรวจสอบ")
                : fakeNewsInfo.fn_info_status === 1
                  ? createTypography("กำลังตรวจสอบ")
                  : createTypography("ตรวจสอบแล้ว")
            }
          />
        </React.Fragment>
      ),
    },
    {
      key: "13",
      label: createTypography("ผลการตรวจสอบ", "25px", 3),
      children: createTypography(data.length > 0 && data[0].mfi_results !== undefined ? renderResultText(data[0].mfi_results) : "รอตรวจสอบ"),
    },    
    {
      key: "14",
      label: createTypography("เกี่ยวกับ"),
      children: fakeNewsInfo && createTypography(about.length > 0 ? about[0].about_name : "รอตรวจสอบ"),
    },
  ];

  return (
    <UserProfile>
      <Typography variant="h3" gutterBottom sx={{ color: "#000000" }}>
        รายละเอียดการแจ้งข้อมูลเท็จ
      </Typography>
      <br />
      <React.Fragment>
        <Steps
          current={fakeNewsInfo?.fn_info_status}
          items={[
            {
              title: createTypography("รอรับเรื่อง"),
              description: createTypography("สมาชิกแจ้งข้อมูลแล้ว"),
              disabled: true,
            },
            {
              title: createTypography("ตรวจสอบ"),
              description: createTypography("รับเรื่องไปตรวจสอบ"),
              disabled: fakeNewsInfo?.fn_info_status > 0,
            },
            {
              title: createTypography("เสร็จสิ้น"),
              description: createTypography("ตรวจสอบเสร็จสิ้น"),
              disabled: fakeNewsInfo?.fn_info_status > 1,
            },
          ]}
        />
        <Divider />
        <Descriptions
          layout="vertical"
          bordered
          items={items}
        />
      </React.Fragment>
    </UserProfile>
  );
};

export default FnInfoView;
