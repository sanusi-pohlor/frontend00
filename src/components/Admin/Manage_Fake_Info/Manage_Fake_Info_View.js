import React, { useEffect, useState } from "react";
import { Badge, Descriptions, Image, Steps, Divider, Modal } from "antd";
import { useParams } from "react-router-dom";
import AdminMenu from "../Adm_Menu";
import moment from "moment";

const Manage_Fake_Info_View = () => {
  const [fakeNewsInfo, setFakeNewsInfo] = useState(null);
  const { id } = useParams();
  const [province, setProvince] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [info_source, setInfo_source] = useState(null);
  const [selectOptions_vol, setSelectOptions_vol] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [selectOptions_c_info, setSelectOptions_c_info] = useState([]);
  const [selectOptions_fm, setSelectOptions_fm] = useState([]);
  const [selectOptions_dis, setSelectOptions_dis] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_con, setSelectOptions_con] = useState([]);
  const [selectOptions_moti, setSelectOptions_moti] = useState([]);
  const [selectOptions_data, setSelectOptions_data] = useState([]);
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [selectOptions_mfi_dis_c, setSelectOptions_mfi_dis_c] = useState([]);
  
  const fetchUserInfo = async () => {
    try {
      const response = await fetch("https://fakenews001-392577897f69.herokuapp.com/api/AmUser");
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
        `https://fakenews001-392577897f69.herokuapp.com/api/Manage_Fake_Info_show/${id}`
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
          "https://fakenews001-392577897f69.herokuapp.com/api/Province_request"
        );
        if (response.ok) {
          const pv = await response.json();
          const filteredIds = pv.filter(
            (item) => item.id === (fakeNewsInfo && fakeNewsInfo.fn_info_province)
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
        `https://fakenews001-392577897f69.herokuapp.com/api/${endpoint}`
      );
      if (response.ok) {
        const typeCodes = await response.json();
        console.log("ddd = ",typeCodes);
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
    fetchDataAndSetOptions(
      "Province_request",
      "prov",
      setSelectOptions_prov
    );
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

  const renderReporterInfo = () => {
    if (!userInfo) {
      return null;
    }

    const user = userInfo.find(
      (user) => user.id === fakeNewsInfo?.mfi_mem
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
    if (!selectOptions_med || !fakeNewsInfo?.mfi_med_c) {
      return null;
    }
  
    const source = selectOptions_med.find(source => source.id === fakeNewsInfo?.mfi_med_c);
    return source && <span>{source.med_c_name}</span>;
  };
  
  const renderReporter_mfi_dis_c = () => {
    if (!selectOptions_med || !fakeNewsInfo?.mfi_dis_c) {
      return null;
    }
  
    const source = selectOptions_med.find(source => source.id === fakeNewsInfo?.mfi_dis_c);
    return source && <span>{source.med_c_name}</span>;
  };

  const render_fm_d_name = () => {
    if (!selectOptions_fm || !fakeNewsInfo?.mfi_fm_d) {
      return null;
    }
  
    const source = selectOptions_fm.find(source => source.id === fakeNewsInfo?.mfi_fm_d);
    return source && <span>{source.fm_d_name}</span>;
  };

  const render_prov_name = () => {
  const provinceId = parseInt(fakeNewsInfo.mfi_province, 10);
    if (!selectOptions_prov || !provinceId) {
      return null;
    }
  
    const source = selectOptions_prov.find(source => source.id === provinceId);
    return source && <span>{source.prov_name}</span>;
  };
  
  const render_mfi_moti_name = () => {
    if (!selectOptions_moti || !fakeNewsInfo?.mfi_moti) {
      return null;
    }
  
    const source = selectOptions_moti.find(source => source.id === fakeNewsInfo?.mfi_moti);
    return source && <span>{source.moti_name}</span>;
  };

  const render_mfi_data_cha = () => {
    if (!selectOptions_data || !fakeNewsInfo?.mfi_data_cha) {
      return null;
    }
  
    const source = selectOptions_data.find(source => source.id === fakeNewsInfo?.mfi_data_cha);
    return source && <span>{source.data_cha_name}</span>;
  };

  const items = [
    {
      key: "1",
      label: "ประทับเวลา",
      children: fakeNewsInfo && (
        <span>
          {fakeNewsInfo.mfi_time &&
            moment(fakeNewsInfo.mfi_time).locale("th").format("DD MMMM YYYY")}
        </span>
      ),
    },
    {
      key: "2",
      label: "จังหวัดของท่าน",
      children: fakeNewsInfo && <span>{render_prov_name()}</span>,
    },
    {
      key: "3",
      label: "ผู้ส่งรายงาน",
      children: fakeNewsInfo && <span>{renderReporterInfo()}</span>,
    },
    {
      key: "4",
      label: "แหล่งที่มาของข่าวปลอม",
      children: fakeNewsInfo && <span>{renderReporter_fn_info_source()}</span>,
    },
    {
      key: "5",
      label: "ส่งภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ",
      children: fakeNewsInfo && (
        <span>
          <Image
            width={200}
            src={fakeNewsInfo.mfi_img}
            alt="รูปภาพข่าวปลอม"
          //style={{ maxWidth: "100%", height: "auto" }}
          />
        </span>
      ),
    },
    {
      key: "6",
      label: "ระบุลิ้งค์ข้อมูล (ถ้ามี)",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_link}</span>,
    },
    {
      key: "7",
      label: "แหล่งที่มาของข้อมูล",
      span: 3,
      children: fakeNewsInfo && <span>{renderReporter_mfi_dis_c()}</span>,
    },
    {
      key: "8",
      label: "จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_num_mem}</span>,
    },
    {
      key: "9",
      label: "หน่วยงานที่เก็บข้อมูล",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_agency}</span>,
    },
    {
      key: "10",
      label: "หัวข้อข้อมูลผิดพลาด",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_d_topic}</span>,
    },
    {
      key: "11",
      label: "รูปแบบของข้อมูล",
      children: fakeNewsInfo && <span>{render_fm_d_name()}</span>,
    },
    {
      key: "12",
      label: "ช่องทางการเผยแพร่",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_dis_c}</span>,
    },
    {
      key: "12",
      label: "ช่องทางการเผยแพร่",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_dis_c}</span>,
    },
    {
      key: "13",
      label: "ผู้เผยแพร่ข้อมูล",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_publ}</span>,
    },
    {
      key: "14",
      label: "ประเภทของข้อมูล",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_ty_info}</span>,
    },
    {
      key: "15",
      label: "เฉพาะโควิด-15",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_only_cv}</span>,
    },
    {
      key: "16",
      label: "มีเนื้อหาเกี่ยวกับ",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_con_about}</span>,
    },
    {
      key: "17",
      label: "แรงจูงใจการเผยแพร่",
      children: fakeNewsInfo && <span>{render_mfi_moti_name()}</span>,
    },
    {
      key: "18",
      label: "จำนวนการวนซ้ำ",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_iteration}</span>,
    },
    {
      key: "19",
      label: "การตรวจสอบข้อมูล",
      children: fakeNewsInfo && <span>{fakeNewsInfo.mfi_che_d}</span>,
    },
    {
      key: "20",
      label: "ลักษณะข้อมูล",
      children: fakeNewsInfo && <span>{render_mfi_data_cha()}</span>,
    },
    {
      key: "21",
      label: "เพิ่มเมื่อ",
      children: fakeNewsInfo && <span>{fakeNewsInfo.created_at}</span>,
    },
    {
      key: "22",
      label: "สถานะ",
      span: 3,
      children: fakeNewsInfo && (
        <React.Fragment>
          <Badge
            status={
              fakeNewsInfo.fn_info_status === 0
                ? "warning" // ถ้าสถานะเท่ากับ 1 (รอตรวจสอบ)
                : fakeNewsInfo.fn_info_status === 1
                  ? "processing" // ถ้าสถานะเท่ากับ 0 (กำลังตรวจสอบ)
                  : "success" // ถ้าสถานะเท่ากับอื่น ๆ (ตรวจสอบแล้ว)
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
    <AdminMenu>
      <Descriptions
        title="รายละเอียดข้อมูลเท็จ"
        layout="vertical"
        bordered
        items={items}
      />
    </AdminMenu>
  );
};

export default Manage_Fake_Info_View;
