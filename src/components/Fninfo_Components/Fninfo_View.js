import React, { useEffect, useState } from "react";
import { Badge, Descriptions, Image, Steps, Divider } from "antd";
import { useParams } from "react-router-dom";
import UserProfile from "../User_Comoponents/Profile_Menu";
import moment from "moment";

const FnInfoView = () => {
  const [fakeNewsInfo, setFakeNewsInfo] = useState(null);

  // Get the fn_info_id from the URL using useParams
  const { id } = useParams();
  const stepsStyle = {
    current: {
      color: "#7BBD8F", // Set the color for the current step
    },
    tail: {
      color: "#7BBD8F", // Set the color for the steps after the current step
    },
    head: {
      backgroundColor: "#7BBD8F", // Set the background color for the previous steps
    },
  };

  // Fetch fake news information based on id
  useEffect(() => {
    const fetchFakeNewsInfo = async () => {
      try {
        const response = await fetch(
          `https://fakenew-c1eaeda38e26.herokuapp.com/api/FakeNewsInfo_show/${id}`
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

    fetchFakeNewsInfo();
  }, [id]);

  if (fakeNewsInfo === null) {
    // Data is still loading
    return (
      <UserProfile>
        <div>Loading...</div>
      </UserProfile>
    );
  }

  const items = [
    { key: "1", label: "หัวข้อ", children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_head}</span> },
    { key: "2", label: "ผู้แจ้ง", children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_nameid}</span> },
    { key: "3", label: "จังหวัด", children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_province}</span> },
    { key: "4", label: "เนื้อหา", children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_content}</span> },
    { key: "5", label: "แหล่งที่มาของข่าวปลอม", children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_source}</span> },
    { key: "6", label: "แจ้งเมื่อ", children: fakeNewsInfo && <span>{fakeNewsInfo.created_at && moment(fakeNewsInfo.created_at).locale("th").format("DD MMMM YYYY")}</span> },
    { key: "7", label: "รายละเอียดเพิ่มเติม", span: 3, children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_more}</span> },
    { key: "8", label: "ลิ้งค์ข้อมูล", children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_link}</span> },
    { key: "9", label: "จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ", children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_num_mem}</span> },
    { key: "10", label: "วัน/เดือน/ปี ที่เกิดเหตุ", children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_dmy && moment(fakeNewsInfo.fn_info_dmy).locale("th").format("DD MMMM YYYY")}</span> },
    { key: "11", label: "ภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ", children: fakeNewsInfo && <span><Image width={200} src={fakeNewsInfo.fn_info_image} alt="รูปภาพข่าวปลอม" /></span> },
    {
      key: "12",
      label: "สถานะ",
      span: 3,
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
                ? "รอตรวจสอบ"
                : fakeNewsInfo.fn_info_status === 1
                ? "กำลังตรวจสอบ"
                : "ตรวจสอบแล้ว"
            }
          />
        </React.Fragment>
      ),
    },
  ];  

  return (
    <UserProfile>
      <React.Fragment>
        <Steps
          current={fakeNewsInfo?.fn_info_status}
          items={[
            {
              title: "รอรับเรื่อง",
              description: "สมาชิกแจ้งข้อมูลแล้ว",
              disabled: true,
            },
            {
              title: "ตรวจสอบ",
              description: "รับเรื่องไปตรวจสอบ",
              disabled: fakeNewsInfo?.fn_info_status > 0,
            },
            {
              title: "เสร็จสิ้น",
              description: "ตรวจสอบเสร็จสิ้น",
              disabled: fakeNewsInfo?.fn_info_status > 1,
            },
          ]}
        />
        <Divider />
        <Descriptions
          title="รายละเอียดการแจ้ง"
          layout="vertical"
          bordered
          items={items}
        />
      </React.Fragment>
    </UserProfile>
  );
};

export default FnInfoView;
