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
  Card,
  Input,
  Select,
  Form,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
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
  const [data, setData] = useState([]);
  const [fakeNewsInfo, setFakeNewsInfo] = useState(null);
  const [province, setProvince] = useState([]);
  const [current, setCurrent] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmedStep, setConfirmedStep] = useState(-1);
  const [value3, setValue3] = useState("Apple");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [info_source, setInfo_source] = useState(null);
  const { id } = useParams();
  const curveAngle = 20;
  const paperColor = "#FFFFFF";
  const navigate = useNavigate();
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

  const fetchInfo_source = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/MediaChannels_request"
      );
      if (response.ok) {
        const Data = await response.json();
        console.log("source :", Data);
        setInfo_source(Data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchInfo_source();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Manage_Fake_Info_request"
      );
      if (response.ok) {
        const data = await response.json();
        const filteredIds = data.filter(
          (item) => item.mfi_fninfo === parseInt(id, 10)
        );
        setData(filteredIds);
        console.log("Filtered IDs:", filteredIds); // Logging the filtered IDs
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

  const handleCheck = () => {
    if (fakeNewsInfo.fn_info_status === 0) {
      setIsModalVisible(true);
    } else if (fakeNewsInfo.fn_info_status === 1) {
      navigate(`./Adm_Info_Check`);
    } else if (fakeNewsInfo.fn_info_status === 2) {
      navigate(`/Admin/Manage_Fake_Info_View/${data[0].id}`);
    } else {
      setIsModalVisible(false);
    }
  };
  const onChange = (newStatus) => {
    if (newStatus === 1) {
      setIsModalVisible(true);
    } else if (newStatus === 2) {
      navigate("./Adm_Info_Check");
    } else {
      setIsModalVisible(false);
    }
  };

  const handleConfirm = async () => {
    setModalVisible(false);
    setConfirmedStep(current);
    console.log("current: ", current);

    try {
      const formData = new FormData();
      formData.append("status", 1);
      const response = await fetch(
        `https://checkkonproject-sub.com/api/updateFakeNewsStatus/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        fetchFakeNewsInfo();
        window.location.reload();
      } else {
        console.error("Error updating status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const fetchFakeNewsInfo = async () => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/FakeNewsInfo_show/${id}`
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

  const renderReporterInfo = () => {
    if (!userInfo) {
      return null;
    }

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

  const renderReporter_fn_info_source = () => {
    if (!info_source) {
      return null;
    }

    const source = info_source.find(
      (source) => source.id === fakeNewsInfo?.fn_info_source
    );

    return (
      source && (
        <>
          <span>{source.med_c_name}</span>
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
      children: fakeNewsInfo && (
        <span>
          {province.length > 0 ? province[0].prov_name : "Loading..."}
        </span>
      ),
    },
    {
      key: "4",
      label: "เนื้อหา",
      children: fakeNewsInfo && <span>{fakeNewsInfo.fn_info_content}</span>,
    },
    {
      key: "5",
      label: "แหล่งที่มาของข่าวปลอม",
      children: fakeNewsInfo && <span>{renderReporter_fn_info_source()}</span>,
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
      <Card
        style={{
          borderRadius: "20px",
          backgroundColor: "#7BBD8F",
        }}
      >
        <div
          style={{
            fontSize: "70px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Th Sarabun New', sans-serif",
            color: "white",
          }}
        >
          จัดการข้อมูลรับแจ้ง
        </div>
        <div
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleCheck}
            type="primary"
          // style={{
          //   fontSize: "20px",
          //   color: "#7BBD8F",
          // }}
          >
            ตรวจสอบข้อมูล
          </Button>
        </div>
      </Card>
      <Card
        style={{
          margin: "auto",
          borderRadius: `${curveAngle}px`,
          backgroundColor: paperColor,
          width: "100%",
          height: "100%",
        }}
      >
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
      </Card>
    </AdminMenu>
  );
};

export default ManageInfo_view;
