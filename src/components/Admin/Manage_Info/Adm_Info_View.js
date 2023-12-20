import React, { useEffect, useState } from "react";
import {
  Badge,
  Descriptions,
  Image,
  Steps,
  message,
  Button,
  Divider,
  Modal,
  Radio,
  Input,
  Select,
  Form,
} from "antd";
import { useParams ,useNavigate  } from "react-router-dom";
import AdminMenu from "../Adm_Menu";
import moment from "moment";
const { Option } = Select;

const plainOptions = ["1", "2"];
const options = [
  {
    label: "ข่าวจริง",
    value: "1",
  },
  {
    label: "ข่าวเท็จ",
    value: "2",
  },
];
const optionsWithDisabled = [
  {
    label: "ข่าวจริง",
    value: "1",
  },
  {
    label: "ข่าวเท็จ",
    value: "2",
  },
];
const ManageInfo_view = () => {
  const [form] = Form.useForm();
  const [fakeNewsInfo, setFakeNewsInfo] = useState(null);
  const [current, setCurrent] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmedStep, setConfirmedStep] = useState(-1); // สถานะการยืนยัน
  const [value3, setValue3] = useState("Apple");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก API
  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/AmUser");
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

  const handleCheck = () => {
    if (fakeNewsInfo.fn_info_status === 0) {
      setIsModalVisible(true);
    } else if (fakeNewsInfo.fn_info_status > 0) {
      navigate(`./Adm_Info_Check`);
    } else {
      setIsModalVisible(false);
    }

  };
  const onChange = (newStatus) => {
    // ตรวจสอบเงื่อนไขเพื่อแสดง Modal
    if (newStatus === 1) {
      setIsModalVisible(true);
    } else if (newStatus === 2){
      navigate("./Adm_Info_Check");
    } else {
      // ปิด Modal หากเปลี่ยนสถานะอื่น
      setIsModalVisible(false);
    }

  };
  const { id } = useParams();

  const handleConfirm = async () => {
    setModalVisible(false);
    setConfirmedStep(current);
    console.log("current: ", current);

    try {
      const formData = new FormData();
      formData.append("status", 1); // ใช้ append ให้ถูกต้อง

      const response = await fetch(
        `http://localhost:8000/api/updateFakeNewsStatus/${id}`,
        {
          method: "POST",
          body: formData, // ส่งข้อมูลผ่าน FormData
        }
      );
      if (response.ok) {
        fetchFakeNewsInfo(); // เมื่อส่งข้อมูลสำเร็จให้ดึงข้อมูลอัพเดท
        window.location.reload(); // รีโหลดหน้าเพื่อแสดงข้อมูลที่อัพเดทแล้ว
      } else {
        console.error("Error updating status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Fetch fake news information based on id
  const fetchFakeNewsInfo = async () => {
    console.log("id :", id);
    try {
      const response = await fetch(
        `http://localhost:8000/api/FakeNewsInfo_show/${id}`
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

  // Fetch fake news information when the component mounts
  useEffect(() => {
    fetchFakeNewsInfo();
  }, [id]);

  const renderReporterInfo = () => {
    const user = userInfo.find(
      (user) => user.id === fakeNewsInfo?.fn_info_nameid
    );

    return (
      user && (
        <>
          <span>{user.username}</span> <span>{user.lastName}</span>
        </>
      )
    );
  };
  const items = [
    {
      key: "1",
      label: "หัวข้อ",
      children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_head}</span>,
    },
    {
      key: "2",
      label: "ผู้แจ้ง",
      children: userInfo && <span>{renderReporterInfo()}</span>,
    },
    {
      key: "3",
      label: "จังหวัด",
      children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_province}</span>,
    },
    {
      key: "4",
      label: "เนื้อหา",
      children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_content}</span>,
    },
    {
      key: "5",
      label: "แหล่งที่มาของข่าวปลอม",
      children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_source}</span>,
    },
    {
      key: "6",
      label: "แจ้งเมื่อ",
      children: fakeNewsInfo && (
        <span>
          {fakeNewsInfo.created_at &&
            moment(fakeNewsInfo.created_at).locale("th").format("DD MMMM YYYY")}
        </span>
      ),
    },
    {
      key: "7",
      label: "รายละเอียดเพิ่มเติม",
      span: 3,
      children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_more}</span>,
    },
    {
      key: "8",
      label: "ลิ้งค์ข้อมูล",
      children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_link}</span>,
    },
    {
      key: "9",
      label: "จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ",
      children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_num_mem}</span>,
    },
    {
      key: "10",
      label: "วัน/เดือน/ปี ที่เกิดเหตุ",
      children: fakeNewsInfo && (
        <span>
          {fakeNewsInfo.fn_info_dmy &&
            moment(fakeNewsInfo.fn_info_dmy)
              .locale("th")
              .format("DD MMMM YYYY")}
        </span>
      ),
    },
    {
      key: "11",
      label: "ภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ",
      children: fakeNewsInfo && (
        <span>
          <Image
            width={200}
            src={fakeNewsInfo.fn_info_image}
            alt="รูปภาพข่าวปลอม"
            //style={{ maxWidth: "100%", height: "auto" }}
          />
        </span>
      ),
    },
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
  const onChange3 = ({ target: { value } }) => {
    console.log("radio3 checked", value);
    setValue3(value);
  };

  return (
    <AdminMenu>
      <div
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>จัดการข้อมูลรับแจ้ง</span>
        <Button
          onClick={handleCheck}
          style={{
            fontSize: "20px",
            color: "#7BBD8F",
          }}
        >
          ตรวจสอบข้อมูล
        </Button>
      </div>
      <Divider />
      <Steps
        current={fakeNewsInfo?.fn_info_status}
        onChange={onChange}
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
            disabled: true,
          },
        ]}
      />
      <Modal
        title="ยืนยันการรับเรื่อง"
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={() => setIsModalVisible(false)}
      ></Modal>
      <Divider />
      <Descriptions
        title="รายละเอียดการแจ้ง"
        layout="vertical"
        bordered
        items={items}
      />
    </AdminMenu>
  );
};

export default ManageInfo_view;
