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
  Card,
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
  const [province, setProvince] = useState([]);
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
  const [options, setOptions] = useState([]);
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(null);

  const fetchTag = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Tags_request",
      );
      if (response.ok) {
        const data = await response.json();
        const formattedOptions = data.map((item) => ({
          label: item.tag_name,
          //value: item.tag_name,
        }));
        setOptions(formattedOptions);
      } else {
        console.error("Tag data retrieval failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchTag();
  }, []);

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
          { label: data.tag_name },
        ]);
      } else {
        console.error("Error adding tag:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };
  const fetchInfo_source = async () => {
    try {
      const response = await fetch("https://checkkonproject-sub.com/api/MediaChannels_request");
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
        "https://checkkonproject-sub.com/api/Manage_Fake_Info_request"
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

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await fetch(
          "https://checkkonproject-sub.com/api/Province_request"
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

  const parsedId = parseInt(id, 10);
  const onFinish = async (values) => {
    console.log("mfi_fninfo = ", values);
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
      //formData.append("mfi_con_about", values.mfi_con_about);
      formData.append("mfi_moti", values.mfi_moti);
      formData.append("mfi_iteration", values.mfi_iteration);
      formData.append("mfi_che_d", values.mfi_che_d);
      formData.append("mfi_data_cha", values.mfi_data_cha);
      formData.append("mfi_fninfo", parseInt(id, 10));
      formData.append("mfi_results", values.mfi_results);
      formData.append("mfi_tag", JSON.stringify(values.mfi_tag));
      for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Manage_Fake_Info_upload",
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

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/${endpoint}`
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

  useEffect(() => {
    onChange_mfi_c_info_id();
    onChange_mfi_fm_d_id();
    onChange_mfi_dis_c_id();
    onChange_mfi_ty_info_id();
    onChange_mfi_moti_id();
    onChange_mfi_data_cha_id();
    onChange_dnc_med_id();
  }, []);
  
  return (
    <AdminMenu>
      <Card
        className="cardsection"
      >
        <div
          className="cardsectionContent"
        >
          จัดการข้อมูลรับแจ้ง
        </div>
      </Card>
      <br />
      <Card
      >
        <Form
          form={form}
          layout="vertical"
          name="member_form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                //name="mfi_time"
                label="ประทับเวลา"
                rules={[
                  {
                    required: false,
                    message: "กรุณาเพิ่มประทับเวลา!",
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
                      : "ไม่มีการประทับเวลา"
                  }
                  disabled
                />
              </Form.Item>
              {province && province.length > 0 && (
                <Form.Item
                  label="จังหวัดของท่าน"
                  //name="fn_info_province"
                  rules={[
                    {
                      required: true,
                      message: "กรุณาเพิ่มจังหวัดของท่าน!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={province[0].prov_name}
                    disabled
                  />
                </Form.Item>
              )}
            </Col>
            <Col span={8}>
              <Form.Item
                //name="mfi_mem"
                label="ผู้ส่งรายงาน"
                rules={[
                  {
                    required: false,
                    message: "กรุณาเพิ่มผู้ส่งรายงาน!",
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
                    message: "กรุณาเพิ่มแหล่งที่มาของข่าวปลอม!",
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
                    message: "กรุณาเพิ่มภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ!",
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
                    message: "กรุณาเพิ่มลิ้งค์ข้อมูล!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={
                    fakeNewsInfo
                      ? fakeNewsInfo.fn_info_link
                      : "เพิ่มลิ้งค์ข้อมูล"
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
                    message: "กรุณาเพิ่มแหล่งที่มาของข้อมูล!",
                  },
                ]}
              >
                <Select
                  placeholder="แหล่งที่มาของข้อมูล"
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
                    message: "กรุณาเพิ่มจำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ!",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={
                    fakeNewsInfo
                      ? fakeNewsInfo.fn_info_num_mem
                      : "จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ"
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
                    message: "กรุณาเพิ่มหน่วยงานที่เก็บข้อมูล!",
                  },
                ]}
              >
                <Input placeholder="เพิ่มหน่วยงานที่เก็บข้อมูล" />
              </Form.Item>
              <Form.Item
                name="mfi_d_topic"
                label="หัวข้อข้อมูลผิดพลาด"
                rules={[
                  {
                    required: false,
                    message: "กรุณาเพิ่มหัวข้อข้อมูลผิดพลาด!",
                  },
                ]}
              >
                <Input placeholder="เพิ่มหัวข้อข้อมูลผิดพลาด" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="mfi_fm_d"
                label="รูปแบบของข้อมูล"
                rules={[
                  {
                    required: false,
                    message: "กรุณาเพิ่มรูปแบบของข้อมูล!",
                  },
                ]}
              >
                <Select
                  placeholder="เลือกรูปแบบของข้อมูล"
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
                    message: "กรุณาเพิ่มช่องทางการเผยแพร่!",
                  },
                ]}
              >
                <Select
                  placeholder="เลือกช่องทางการเผยแพร่"
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
                    message: "กรุณาเพิ่มผู้เผยแพร่ข้อมูล!",
                  },
                ]}
              >
                <Input placeholder="ผู้เผยแพร่ข้อมูล" />
              </Form.Item>
              <Form.Item
                name="mfi_ty_info"
                label="ประเภทของข้อมูล"
                rules={[
                  {
                    required: false,
                    message: "กรุณาเพิ่มประเภทของข้อมูล!",
                  },
                ]}
              >
                <Select
                  placeholder="เลือกประเภทของข้อมูล"
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
                label="เป็นเนื้อหาเกี่ยวกับโควิด-15"
                rules={[
                  {
                    required: false,
                    message: "กรุณาเลือกว่าเป็นเนื้อหาเกี่ยวกับโควิด-15 หรือไม่?",
                  },
                ]}
              >
                <Select
                  placeholder="เป็นเนื้อหาเกี่ยวกับโควิด-15 หรือไม่?"
                  allowClear
                  style={{ width: "100%" }}
                >
                  <Select.Option value="0">ไม่ใช่</Select.Option>
                  <Select.Option value="1">ใช่</Select.Option>
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
                    message: "กรุณาเพิ่มแรงจูงใจการเผยแพร่!",
                  },
                ]}
              >
                <Select
                  placeholder="เลือกแรงจูงใจการเผยแพร่"
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
                    message: "กรุณาเพิ่มจำนวนการวนซ้ำ!",
                  },
                ]}
              >
                <Input placeholder="จำนวนการวนซ้ำ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mfi_che_d"
                label="การตรวจสอบข้อมูล"
                rules={[
                  {
                    required: false,
                    message: "กรุณาเพิ่มการตรวจสอบข้อมูล!",
                  },
                ]}
              >
                <Input placeholder="การตรวจสอบข้อมูล" />
              </Form.Item>
              <Form.Item
                name="mfi_data_cha"
                label="ลักษณะข้อมูล"
                rules={[
                  {
                    required: false,
                    message: "กรุณาเพิ่มลักษณะข้อมูล!",
                  },
                ]}
              >
                <Select
                  placeholder="เลือกลักษณะข้อมูล"
                  onChange={onChange_mfi_data_cha_id}
                  allowClear
                >
                  {selectOptions_data}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: '10px' }}>
            <Form.Item
              name="mfi_results"
              label="ผลสรุป"
              rules={[
                {
                  required: false,
                  message: "กรุณาเพิ่มผลสรุป!",
                },
              ]}
              style={{
                marginRight: "10px",
                width: "50%"
              }}
            >
              <Select
                placeholder="เลือกผลสรุปของข้อมูล"
                allowClear
                style={{ width: "100%" }}
              >
                <Select.Option value="0">ข่าวเท็จ</Select.Option>
                <Select.Option value="1">ข่าวจริง</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="mfi_data_cha"
              label="เกี่ยวกับ"
              rules={[
                {
                  required: false,
                  message: "กรุณาเพิ่มเกี่ยวกับ!",
                },
              ]}
              style={{
                width: "50%"
              }}
            >
              <Select
                placeholder="เลือกเกี่ยวกับ"
                onChange={onChange_mfi_data_cha_id}
                allowClear
                style={{ width: "100%" }}
              >
                {selectOptions_data}
              </Select>
            </Form.Item>
          </Row>
          <Row style={{ marginBottom: '10px' }}>
            <Form.Item
              name="mfi_tag"
              label="แท็ก"
              rules={[
                {
                  required: false,
                  message: "กรุณาเพิ่มแท็ก!",
                },
              ]}
              style={{
                marginRight: "10px",
                width: "50%"
              }}
            >
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="เลือกแท็ก"
                onSearch={(value) => {
                  if (Array.isArray(options)) {
                    handleTagCreation(value);
                  }
                }}
                options={options}
              />
            </Form.Item>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="form-button">
              บันทึก
            </Button>
          </Form.Item>
        </Form></Card>
    </AdminMenu>
  );
};

export default Adm_Info_Check;
