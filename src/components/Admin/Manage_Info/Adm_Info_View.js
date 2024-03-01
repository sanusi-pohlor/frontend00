import React, { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Descriptions,
  Image,
  Steps,
  Button,
  Divider,
  Modal,
  Card,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import AdminMenu from "../Adm_Menu";
import moment from "moment";
import { Typography } from "@mui/material";

const ManageInfo_view = () => {
  const [data, setData] = useState([]);
  const [fakeNewsInfo, setFakeNewsInfo] = useState(null);
  const [province, setProvince] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [info_source, setInfo_source] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          "https://checkkonproject-sub.com/api/AmUser"
        );
        if (response.ok) {
          const userData = await response.json();
          setUserInfo(userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchInfo_source = async () => {
      try {
        const response = await fetch(
          "https://checkkonproject-sub.com/api/MediaChannels_request"
        );
        if (response.ok) {
          const Data = await response.json();
          setInfo_source(Data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchInfo_source();
  }, []);



  const fetchFakeNewsInfo = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchFakeNewsInfo();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/mfi_info_view_request/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
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

    if (fakeNewsInfo && fakeNewsInfo.fn_info_province) {
      fetchProvince();
    }
  }, [fakeNewsInfo]);

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

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label}
    </Typography>
  );

  const items = [
    {
      key: "1",
      label: createTypography("หัวข้อ"),
      children: fakeNewsInfo && createTypography(fakeNewsInfo.fn_info_head),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "2",
      label: createTypography("ผู้แจ้ง"),
      children: userInfo && createTypography(renderReporterInfo()),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "3",
      label: createTypography("จังหวัด"),
      children:
        fakeNewsInfo &&
        createTypography(
          province.length > 0 ? province[0].prov_name : "Loading..."
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "4",
      label: createTypography("เนื้อหา"),
      children: fakeNewsInfo && createTypography(fakeNewsInfo.fn_info_content),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "5",
      label: createTypography("แหล่งที่มาของข่าวปลอม"),
      children:
        fakeNewsInfo && createTypography(renderReporter_fn_info_source()),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
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
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "7",
      label: createTypography("รายละเอียดเพิ่มเติม"),
      span: 3,
      children: fakeNewsInfo && createTypography(fakeNewsInfo.fn_info_more),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "8",
      label: createTypography("ลิ้งค์ข้อมูล"),
      children: fakeNewsInfo && createTypography(fakeNewsInfo.fn_info_link),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "9",
      label: createTypography(
        "จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ"
      ),
      children: fakeNewsInfo && createTypography(fakeNewsInfo.fn_info_num_mem),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
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
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "11",
      label: createTypography("ภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ"),
      children:
        fakeNewsInfo &&
        createTypography(
          <Image
            width={200}
            src={fakeNewsInfo.fn_info_image}
            alt="รูปภาพข่าวปลอม"
          />
        ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "12",
      label: createTypography("สถานะ"),
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
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
  ];

  return (
    <AdminMenu>
      <Card className="cardsection">
        <div className="cardsectionContent">
          <Typography variant="h3">จัดการข้อมูลรับแจ้ง</Typography>
          <Button
            onClick={handleCheck}
            type="primary"
            className="buttonfilterStyle"
          >
            ตรวจสอบข้อมูล
          </Button>
        </div>
      </Card>
      <br />
      <Card>
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
          open={isModalVisible}
          onOk={handleConfirm}
          onCancel={() => setIsModalVisible(false)}
        ></Modal>
        <Divider />
        <Typography variant="h3" gutterBottom sx={{ color: "#000000" }}>
          รายละเอียดการแจ้ง
        </Typography>
        <Divider />
        <Descriptions layout="vertical" bordered items={items} />
      </Card>
    </AdminMenu>
  );
};

export default ManageInfo_view;
