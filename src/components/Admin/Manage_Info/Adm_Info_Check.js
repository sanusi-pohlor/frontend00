import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  Select,
  Modal,
  message,
  Space,
  Breadcrumb,
  Row,
  Col,
  Image,
} from "antd";
import AdminMenu from "../Adm_Menu";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
const { Option } = Select;

const Adm_Info_Check = () => {
  const navigate = useNavigate();
  const [fakeNewsInfo, setFakeNewsInfo] = useState(null);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
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
  const [info_source, setInfo_source] = useState(null);
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/AmUser"
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
      const response = await fetch("https://fakenews001-392577897f69.herokuapp.com/api/MediaChannels_request");
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

  const fetchFakeNewsInfo = async () => {
    console.log("id :", id);
    try {
      const response = await fetch(
        `https://fakenews001-392577897f69.herokuapp.com/api/FakeNewsInfo_show/${id}`
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

  const renderReporterInfo = () => {
    if (!userInfo || !fakeNewsInfo) {
      return '';
    }

    const user = userInfo.find(
      (user) => user.id === fakeNewsInfo.fn_info_nameid
    );

    return user ? `${user.username} ${user.lastName}` : '';
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/Manage_Fake_Info_request"
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
  useEffect(() => {
    fetchData();
  }, []);
  const parsedId = parseInt(id, 10);
  const onFinish = async (values) => {
    console.log("mfi_fninfo = ",values);
    try {
      const formData = new FormData();
      formData.append("mfi_time", fakeNewsInfo.created_at);
      formData.append("mfi_province", fakeNewsInfo.fn_info_province);
      formData.append("mfi_mem", fakeNewsInfo.fn_info_nameid);
      formData.append("mfi_med_c", fakeNewsInfo.fn_info_source);
      formData.append("mfi_img", fakeNewsInfo.fn_info_image);
      formData.append("mfi_link", fakeNewsInfo.fn_info_link);
      formData.append("mfi_c_info", values.mfi_c_info);
      formData.append("mfi_num_mem", fakeNewsInfo.fn_info_num_mem);
      formData.append("mfi_agency", values.mfi_agency);
      formData.append("mfi_d_topic", values.mfi_d_topic);
      formData.append("mfi_fm_d", values.mfi_fm_d);
      formData.append("mfi_dis_c", values.mfi_dis_c);
      formData.append("mfi_publ", values.mfi_publ);
      formData.append("mfi_ty_info", values.mfi_ty_info);
      formData.append("mfi_only_cv", values.mfi_only_cv);
      formData.append("mfi_con_about", values.mfi_con_about);
      formData.append("mfi_moti", values.mfi_moti);
      formData.append("mfi_iteration", values.mfi_iteration);
      formData.append("mfi_che_d", values.mfi_che_d);
      formData.append("mfi_data_cha", values.mfi_data_cha);
      formData.append("mfi_fninfo", parseInt(id, 10));
      for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/Manage_Fake_Info_upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        console.log("Form data sent successfully");
        message.success("Form data sent successfully");
        form.resetFields();
        fetchData();
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
        `https://fakenews001-392577897f69.herokuapp.com/api/updateFakeNewsStatus/${id}`,
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

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(
        `https://fakenews001-392577897f69.herokuapp.com/api/${endpoint}`
      );
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
        console.error(
          `Error fetching ${fieldName} codes:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error fetching ${fieldName} codes:`, error);
    }
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
          <Input
            size="large"
            placeholder={
              source
                ? source.med_c_name
                : "No date available"
            }
            disabled
          />
        </>
      )
    );
  };
  const onChange_mfi_province = () => {
    fetchDataAndSetOptions("Province_request", "prov", setSelectOptions_prov);
  };

  const onChange_mfi_mem_id = () => {
    fetchDataAndSetOptions(
      "VolunteerMembers_request",
      "vol_mem",
      setSelectOptions_vol
    );
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
      "dis_c",
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

  const onChange_mfi_con_about_id = () => {
    fetchDataAndSetOptions(
      "VolunteerMembers_request",
      "con_about",
      setSelectOptions_con
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
  return (
    <AdminMenu>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>จัดการข้อมูลรับแจ้ง</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        name="member_form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onClick={() => {
          onChange_mfi_c_info_id();
          onChange_mfi_fm_d_id();
          onChange_mfi_dis_c_id();
          onChange_mfi_ty_info_id();
          onChange_mfi_con_about_id();
          onChange_mfi_moti_id();
          onChange_mfi_data_cha_id();
          onChange_dnc_med_id();
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              //name="mfi_time"
              label="ประทับเวลา"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder={
                  fakeNewsInfo
                    ? fakeNewsInfo.created_at &&
                    moment(fakeNewsInfo.created_at)
                      .locale("th")
                      .format("DD MMMM YYYY")
                    : "No date available"
                }
                disabled
              />
            </Form.Item>
            <Form.Item
              //name="mfi_province"
              label="จังหวัดของท่าน"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder={
                  fakeNewsInfo
                    ? fakeNewsInfo.fn_info_province
                    : "No date available"
                }
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              //name="mfi_mem"
              label="ผู้ส่งรายงาน"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input
                size="large"
                value={renderReporterInfo()}
                disabled
              />
            </Form.Item>
            <Form.Item
              name="mfi_med_c"
              label="แหล่งที่มาของข่าวปลอม"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              {renderReporter_fn_info_source()}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="mfi_img"
              label="ส่งภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Image
                width={200}
                src={fakeNewsInfo && fakeNewsInfo.fn_info_image}
                alt="รูปภาพข่าวปลอม"
              />
            </Form.Item>
            <Form.Item
              name="mfi_link"
              label="ระบุลิ้งค์ข้อมูล (ถ้ามี)"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder={
                  fakeNewsInfo
                    ? fakeNewsInfo.fn_info_link
                    : "No date available"
                }
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mfi_c_info"
              label="แหล่งที่มาของข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_dnc_med_id}
                allowClear
              >
                {selectOptions_med}
              </Select>
            </Form.Item>
            <Form.Item
              name="mfi_num_mem"
              label="จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input
                size="large"
                placeholder={
                  fakeNewsInfo
                    ? fakeNewsInfo.fn_info_num_mem
                    : "No date available"
                }
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mfi_agency"
              label="หน่วยงานที่เก็บข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mfi_d_topic"
              label="หัวข้อข้อมูลผิดพลาด"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="mfi_fm_d"
              label="รูปแบบของข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_fm_d_id}
                allowClear
              >
                {selectOptions_fm}
              </Select>
            </Form.Item>
            <Form.Item
              name="mfi_dis_c"
              label="ช่องทางการเผยแพร่"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_dis_c_id}
                allowClear
              >
                {selectOptions_dis}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="mfi_publ"
              label="ผู้เผยแพร่ข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mfi_ty_info"
              label="ประเภทของข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_ty_info_id}
                allowClear
              >
                {selectOptions_ty}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="mfi_only_cv"
              label="เฉพาะโควิด-15"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mfi_con_about"
              label="มีเนื้อหาเกี่ยวกับ"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_con_about_id}
                allowClear
              >
                {selectOptions_con}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mfi_moti"
              label="แรงจูงใจการเผยแพร่"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_moti_id}
                allowClear
              >
                {selectOptions_moti}
              </Select>
            </Form.Item>
            <Form.Item
              name="mfi_iteration"
              label="จำนวนการวนซ้ำ"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mfi_che_d"
              label="การตรวจสอบข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mfi_data_cha"
              label="ลักษณะข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_data_cha_id}
                allowClear
              >
                {selectOptions_data}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="mfi_data_cha"
              label="ผลสรุป"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_data_cha_id}
                allowClear
              >
                {selectOptions_data}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </AdminMenu>
  );
};

export default Adm_Info_Check;
