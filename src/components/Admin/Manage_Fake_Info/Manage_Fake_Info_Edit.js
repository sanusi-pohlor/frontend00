import React, {useCallback, useEffect, useState } from "react";
import {
  Badge,
  Form,
  Input,
  Button,
  Select,
  message,
  Card,
  Image,
  Divider,
  Descriptions,
} from "antd";
import AdminMenu from "../Adm_Menu";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { Typography } from "@mui/material";
const { Option } = Select;

const Manage_Fake_Info_Edit = () => {
  const navigate = useNavigate();
  const [fakeNewsInfo, setFakeNewsInfo] = useState(null);
  const [province, setProvince] = useState([]);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [selectOptions_check_d, setSelectOptions_check_d] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [selectOptions_fm, setSelectOptions_fm] = useState([]);
  const [selectOptions_dis, setSelectOptions_dis] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_moti, setSelectOptions_moti] = useState([]);
  const [selectOptions_data, setSelectOptions_data] = useState([]);
  const [selectOptions_tags, setSelectOptions_tags] = useState([]);
  const [selectOptions_about, setSelectOptions_About] = useState([]);
  const [selectOptions_result, setSelectOptions_Result] = useState([]);
  const [info_source, setInfo_source] = useState(null);
  const [options, setOptions] = useState([]);
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchManage_Fake_Info_Edit = async () => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/Manage_Fake_Info_show/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setData(data);
          form.setFieldsValue({
            mfi_time: data.mfi_time
              ? moment(data.mfi_time).locale("th").format("DD MMMM YYYY")
              : "ไม่มีการประทับเวลา",
            mfi_province: data.mfi_province,
            mfi_mem: data.mfi_mem,
            mfi_med_c: data.mfi_med_c,
            mfi_img: data.mfi_img,
            mfi_link: data.mfi_link,
            mfi_c_info: data.mfi_c_info,
            mfi_num_mem: data.mfi_num_mem,
            mfi_agency: data.mfi_agency,
            mfi_d_topic: data.mfi_d_topic,
            mfi_fm_d: data.mfi_fm_d,
            mfi_dis_c: data.mfi_dis_c,
            mfi_publ: data.mfi_publ,
            mfi_ty_info: data.mfi_ty_info,
            mfi_only_cv: data.mfi_only_cv === 1 ? "ใช่" : "ไม่ใช่",
            mfi_moti: data.mfi_moti,
            mfi_iteration: data.mfi_iteration,
            mfi_che_d: data.mfi_che_d,
            mfi_data_cha: data.mfi_data_cha,
            mfi_fninfo: data.mfi_fninfo,
            mfi_results: data.mfi_results === 1 ? "จริง" : "เท็จ",
            mfi_con_about: data.mfi_con_about,
            mfi_tag: data.mfi_tag,
          });
        } else {
          console.error("Invalid data received from the server");
          return;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchManage_Fake_Info_Edit();
  }, [id, form]);

  const handleTagCreation = async (value) => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Tags_upload",
        {
          method: "POST",
          body: JSON.stringify({ tag_name: value }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOptions((prevOptions) => [
          ...prevOptions,
          { label: data.tag_name, value: data.tag_name },
        ]);
      } else {
        console.error("Error adding tag:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

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

  const fetchFakeNewsInfo = useCallback(async () => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/FakeNewsInfo_show/${data[0].mfi_fninfo}`
      );
      if (response.ok) {
        const responseData = await response.json();
        setFakeNewsInfo(responseData);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [data]);
  
  useEffect(() => {
    fetchFakeNewsInfo();
  }, [fetchFakeNewsInfo, data]);

  const renderReporterInfo = () => {
    if (!userInfo || !fakeNewsInfo) {
      return "";
    }

    const user = userInfo.find(
      (user) => user.id === fakeNewsInfo.fn_info_nameid
    );

    return user ? `${user.username} ${user.lastName}` : "";
  };

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

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      const appendIfDefined = (fieldName, value) => {
        if (value !== undefined) {
          formData.append(fieldName, value);
        }
      };
      appendIfDefined("mfi_c_info", values.mfi_c_info);
      appendIfDefined("mfi_agency", values.mfi_agency);
      appendIfDefined("mfi_d_topic", values.mfi_d_topic);
      appendIfDefined("mfi_fm_d", values.mfi_fm_d);
      appendIfDefined("mfi_dis_c", values.mfi_dis_c);
      appendIfDefined("mfi_publ", values.mfi_publ);
      appendIfDefined("mfi_ty_info", values.mfi_ty_info);
      const mfi_only_cv = data.mfi_only_cv === 1 ? "ใช่" : "ไม่ใช่";
      if (values.mfi_only_cv !== mfi_only_cv) {
        formData.append("mfi_only_cv", values.mfi_only_cv);
      }
      appendIfDefined("mfi_con_about", values.mfi_con_about);
      appendIfDefined("mfi_moti", values.mfi_moti);
      appendIfDefined("mfi_iteration", values.mfi_iteration);
      appendIfDefined("mfi_che_d", values.mfi_che_d);
      appendIfDefined("mfi_data_cha", values.mfi_data_cha);
      const mfi_results = data.mfi_results === 1 ? "จริง" : "เท็จ";
      if (values.mfi_results !== mfi_results) {
        formData.append("mfi_results", values.mfi_results);
      }
      appendIfDefined("mfi_tag", JSON.stringify(values.mfi_tag));
      const response = await fetch(
        `https://checkkonproject-sub.com/api/Manage_Fake_Info_update/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        console.log("Form data sent successfully");
        message.success("Form data sent successfully");
        form.resetFields();
        handleConfirm();
        navigate("/Admin/Manage_Fake_Info_Menu");
      } else {
        message.error("Error sending form data");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      message.error("Error sending form data");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleConfirm = async () => {
    try {
      const formData = new FormData();
      formData.append("status", 2);
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

  const renderReporter_fn_info_source = () => {
    if (!info_source) {
      return null;
    }
    const source = info_source.find(
      (source) => source.id === fakeNewsInfo?.fn_info_source
    );

    return source.med_c_name;
  };

  const fetchDataAndSetOptions = useCallback(async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(`https://checkkonproject-sub.com/api/${endpoint}`);
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code[`id`]} value={code[`id`]}>
            {code[`${fieldName}_name`]}
          </Option>
        ));
        form.setFieldsValue({ [fieldName]: undefined });
        form.setFields([
          {
            name: fieldName,
            value: undefined,
          },
        ]);
        stateSetter(options);
      } else {
        console.error(`Error fetching codes:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching codes:`, error);
    }
  }, [form]);
  
  const onChange_mfi_che_d_id = useCallback(async () => {
    try {
      const response = await fetch("https://checkkonproject-sub.com/api/CheckingData_request");
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code.id} value={code.id}>
            {code.che_d_format}
          </Option>
        ));
        setSelectOptions_check_d(options);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [setSelectOptions_check_d]);
  
  const onChange_mfi_fm_d_id = useCallback(() => {
    fetchDataAndSetOptions("FormatData_request", "fm_d", setSelectOptions_fm);
  }, [fetchDataAndSetOptions, setSelectOptions_fm]);
  
  const onChange_mfi_dis_c_id = useCallback(() => {
    fetchDataAndSetOptions("DetailsNotiChannels_request", "detail", setSelectOptions_dis);
  }, [fetchDataAndSetOptions, setSelectOptions_dis]);
  
  const onChange_mfi_ty_info_id = useCallback(() => {
    fetchDataAndSetOptions("TypeInformation_request", "type_info", setSelectOptions_ty);
  }, [fetchDataAndSetOptions, setSelectOptions_ty]);
  
  const onChange_mfi_moti_id = useCallback(() => {
    fetchDataAndSetOptions("Motivation_request", "moti", setSelectOptions_moti);
  }, [fetchDataAndSetOptions, setSelectOptions_moti]);
  
  const onChange_mfi_data_cha_id = useCallback(() => {
    fetchDataAndSetOptions("DataCharacteristics_request", "data_cha", setSelectOptions_data);
  }, [fetchDataAndSetOptions, setSelectOptions_data]);
  
  const onChange_dnc_med_id = useCallback(() => {
    fetchDataAndSetOptions("MediaChannels_request", "med_c", setSelectOptions_med);
  }, [fetchDataAndSetOptions, setSelectOptions_med]);
  
  const onChange_mfi_con_about_id = useCallback(() => {
    fetchDataAndSetOptions("About_request", "about", setSelectOptions_About);
  }, [fetchDataAndSetOptions, setSelectOptions_About]);

  const onChange_mfi_results_id = () => {
    fetchDataAndSetOptions("Result_request", "result", setSelectOptions_Result);
  };
  
  const onChange_Tags = useCallback(async () => {
    try {
      const response = await fetch("https://checkkonproject-sub.com/api/Tags_request");
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code[`id`]} value={code[`tag_name`]}>
            {code[`tag_name`]}
          </Option>
        ));
        setSelectOptions_tags(options);
      } else {
        console.error(`Error fetching codes:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching codes:`, error);
    }
  }, [setSelectOptions_tags]);
  
  const memoizedFunctions = useCallback(() => {
    onChange_mfi_con_about_id();
    onChange_mfi_fm_d_id();
    onChange_mfi_dis_c_id();
    onChange_mfi_ty_info_id();
    onChange_mfi_moti_id();
    onChange_mfi_data_cha_id();
    onChange_dnc_med_id();
    onChange_mfi_che_d_id();
    onChange_mfi_results_id();
    onChange_Tags();
  }, [
    onChange_mfi_con_about_id,
    onChange_mfi_fm_d_id,
    onChange_mfi_dis_c_id,
    onChange_mfi_ty_info_id,
    onChange_mfi_moti_id,
    onChange_mfi_data_cha_id,
    onChange_dnc_med_id,
    onChange_mfi_che_d_id,
    onChange_Tags,
  ]);
  
  useEffect(() => {
    memoizedFunctions();
  }, [memoizedFunctions]);

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
        <div className="cardsectionContent">แก้ไขข้อมูลรับแจ้ง</div>
      </Card>
      <br />
      <Card>
        <Typography variant="h3" gutterBottom>
          รายละเอียดการแจ้ง
        </Typography>
        <Divider />
        <Descriptions layout="vertical" bordered items={items} />
        <Divider />
        <Typography variant="h3" gutterBottom>
          วิเคราะห์ข้อมูลรับแจ้ง
        </Typography>
        <Divider />
        <Form
          form={form}
          name="member_form"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{
            maxWidth: "90%",
            margin: "auto",
          }}
          size="large"
        >
          <Form.Item
            name="mfi_c_info"
            label={createTypography("แหล่งที่มาของข้อมูล")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มแหล่งที่มาของข้อมูล!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
            }}
          >
            <Select onChange={onChange_dnc_med_id} allowClear>
              {selectOptions_med}
            </Select>
          </Form.Item>
          <Form.Item
            name="mfi_agency"
            label={createTypography("หน่วยงานที่เก็บข้อมูล")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มหน่วยงานที่เก็บข้อมูล!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
              margin: "0 8px",
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mfi_d_topic"
            label={createTypography("หัวข้อข้อมูลผิดพลาด")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มหัวข้อข้อมูลผิดพลาด!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mfi_fm_d"
            label={createTypography("รูปแบบของข้อมูล")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มรูปแบบของข้อมูล!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
            }}
          >
            <Select onChange={onChange_mfi_fm_d_id} allowClear>
              {selectOptions_fm}
            </Select>
          </Form.Item>
          <Form.Item
            name="mfi_dis_c"
            label={createTypography("ขอบเขตการเผยแพร่")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มขอบเขตการเผยแพร่!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
              margin: "0 8px",
            }}
          >
            <Select onChange={onChange_mfi_dis_c_id} allowClear>
              {selectOptions_dis}
            </Select>
          </Form.Item>
          <Form.Item
            name="mfi_publ"
            label={createTypography("ผู้เผยแพร่ข้อมูล")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มผู้เผยแพร่ข้อมูล!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mfi_ty_info"
            label={createTypography("ประเภทของข้อมูล")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มประเภทของข้อมูล!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
            }}
          >
            <Select onChange={onChange_mfi_ty_info_id} allowClear>
              {selectOptions_ty}
            </Select>
          </Form.Item>
          <Form.Item
            name="mfi_only_cv"
            label={createTypography("เป็นเนื้อหาเกี่ยวกับโควิด")}
            rules={[
              {
                required: false,
                message: "กรุณาเลือกว่าเป็นเนื้อหาเกี่ยวกับโควิด-15 หรือไม่?",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
              margin: "0 8px",
            }}
          >
            <Select allowClear style={{ width: "100%" }}>
              <Select.Option value="0">ไม่ใช่</Select.Option>
              <Select.Option value="1">ใช่</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="mfi_moti"
            label={createTypography("แรงจูงใจการเผยแพร่")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มแรงจูงใจการเผยแพร่!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
            }}
          >
            <Select onChange={onChange_mfi_moti_id} allowClear>
              {selectOptions_moti}
            </Select>
          </Form.Item>
          <Form.Item
            name="mfi_iteration"
            label={createTypography("จำนวนการวนซ้ำ")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มจำนวนการวนซ้ำ!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mfi_che_d"
            label={createTypography("การตรวจสอบข้อมูล")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มการตรวจสอบข้อมูล!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
              margin: "0 8px",
            }}
          >
            <Select onChange={onChange_mfi_che_d_id} allowClear>
              {selectOptions_check_d}
            </Select>
          </Form.Item>
          <Form.Item
            name="mfi_data_cha"
            label={createTypography("ลักษณะข้อมูล")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มลักษณะข้อมูล!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
            }}
          >
            <Select onChange={onChange_mfi_data_cha_id} allowClear>
              {selectOptions_data}
            </Select>
          </Form.Item>
          <Form.Item
            name="mfi_results"
            label={createTypography("ผลสรุป")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มผลสรุป!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
            }}
          >
              <Select onChange={onChange_mfi_results_id} allowClear>
                {selectOptions_result}
              </Select>
          </Form.Item>
          <Form.Item
            name="mfi_con_about"
            label={createTypography("เกี่ยวกับ")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มเกี่ยวกับ!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
              margin: "0 8px",
            }}
          >
            <Select
              onChange={onChange_mfi_con_about_id}
              allowClear
              style={{ width: "100%" }}
            >
              {selectOptions_about}
            </Select>
          </Form.Item>
          <Form.Item
            name="mfi_tag"
            label={createTypography("แท็ก")}
            rules={[
              {
                required: false,
                message: "กรุณาเพิ่มแท็ก!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(33% - 8px)",
            }}
          >
            <Select
              mode="tags"
              size="large"
              onChange={onChange_Tags}
              onSearch={(value) => {
                if (Array.isArray(options)) {
                  handleTagCreation(value);
                }
              }}
              allowClear
            >
              {selectOptions_tags}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="form-button">
              {createTypography("บันทึก")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AdminMenu>
  );
};

export default Manage_Fake_Info_Edit;
