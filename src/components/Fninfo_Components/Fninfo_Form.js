import {
  PlusOutlined,
  UserOutlined,
  LinkOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import UserProfile from "../User_Comoponents/Profile_Menu";
import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Upload,
  message,
  Divider,
} from "antd";
import { Typography } from "@mui/material";
import moment from "moment";
import "moment/locale/th";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import axios from 'axios';
moment.locale("th");

const { Option } = Select;
const { TextArea } = Input;

const FakeNewInformation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const [province, setProvince] = useState([]);
  const [selectednum_mem, setSelectednum_mem] = useState("");
  const [selectOptions_med, setSelectOptions_med] = useState([]);

  const handlenum_memChange = (value) => {
    setSelectednum_mem(value);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      const images = values.fn_info_image;
      formData.append("fn_info_nameid", user.id);
      formData.append("fn_info_province", user.province);
      formData.append("fn_info_head", values.fn_info_head);
      formData.append("fn_info_content", values.fn_info_content);
      formData.append("fn_info_source", values.fn_info_source);
      formData.append("fn_info_num_mem", values.fn_info_num_mem);
      formData.append("fn_info_more", values.fn_info_more);
      formData.append("fn_info_link", values.fn_info_link);
      formData.append("fn_info_dmy", values.fn_info_dmy);
      if (images && images.length > 0) {
        images.forEach((file, index) => {
            formData.append(`fn_info_image_${index}`, file.originFileObj);
        });
    } else {
        formData.append('fn_info_image', '');
    }
      const response = await fetch(
        "https://checkkonproject-sub.com/api/FakeNewsInfo_upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        console.log("Form data sent successfully");
        message.success("Form data sent successfully");
        navigate(`/FakeNews/NotificationHistory`);
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

  const fetchUser = async () => {
    try {
      const response = await fetch("https://checkkonproject-sub.com/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("User data retrieval failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchUser();
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
            (item) => item.id === (user && user.province)
          );
          setProvince(filteredIds);
        } else {
          console.error("Error fetching province data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching province data:", error);
      }
    };

    if (user && user.province) {
      fetchProvince();
    }
  }, [user]);

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/${endpoint}`
      );
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code[`id`]} value={code[`id`]}>
            <Typography variant="body1" sx={{ fontSize: "20px" }}>
              {code[`${fieldName}_name`]}
            </Typography>
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

  const onChange_dnc_med_id = () => {
    fetchDataAndSetOptions(
      "MediaChannels_request",
      "med_c",
      setSelectOptions_med
    );
  };

  if (!user) {
    return <UserProfile>Loading...</UserProfile>;
  } else {
    return (
      <UserProfile>
        <Typography variant="h3" gutterBottom sx={{ color: "#000000" }}>
          ฟอร์มแจ้งข้อมูลเท็จ
        </Typography>
        <Divider />
        <Form
          form={form}
          layout="vertical"
          name="FakeNewInformation"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{
            maxWidth: "90%",
            margin: "auto",
          }}
        >
          <Form.Item
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                ผู้ส่งรายงาน
              </Typography>
            }
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder={user.username}
              disabled
            />
          </Form.Item>
          {province && province.length > 0 && (
            <Form.Item
              label={
                <Typography variant="body1" sx={{ fontSize: "25px" }}>
                  จังหวัดของท่าน
                </Typography>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
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
          <Form.Item
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                หัวข้อ
              </Typography>
            }
            name="fn_info_head"
            rules={[
              {
                required: true,
                message: "กรุณาระบุหัวข้อ",
              },
            ]}
          >
            <Input
              size="large"
            />
          </Form.Item>
          <Form.Item
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                เนื้อหา
              </Typography>
            }
            name="fn_info_content"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <TextArea
              rows={4}
              size="large"
              prefix={<EnvironmentOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                แหล่งที่มาของข่าวปลอม
              </Typography>
            }
            name="fn_info_source"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
            onClick={() => {
              onChange_dnc_med_id();
            }}
          >
            <Select onChange={onChange_dnc_med_id} allowClear>
              {selectOptions_med}
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ
              </Typography>
            }
            name="fn_info_num_mem"
            rules={[
              {
                required: false,
                message: "กรุณากรอกจำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ",
              },
            ]}
          >
            <Select
              size="large"
              onChange={handlenum_memChange}
              value={selectednum_mem}
            >
              {[...Array(10).keys()].map((index) => (
                <Select.Option
                  key={index}
                  value={`${index * 50 + 1}-${index * 50 + 50}`}
                >
                  <Typography variant="body1" sx={{ fontSize: "20px" }}>
                    {index === 9
                      ? `มากกว่า 501`
                      : `${index * 50 + 1}-${index * 50 + 50}`}
                  </Typography>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                รายละเอียดเพิ่มเติม
              </Typography>
            }
            name="fn_info_more"
            rules={[
              {
                required: false,
                message: "กรุณากรอกรายละเอียดเพิ่มเติม",
              },
            ]}
          >
            <TextArea
              rows={4}
              size="large"
              prefix={<EnvironmentOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                ระบุลิ้งค์ข้อมูล(ถ้ามี)
              </Typography>
            }
            name="fn_info_link"
            rules={[
              {
                required: false,
                message: "กรุณาระบุลิ้งค์ข้อมูล(ถ้ามี)",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<LinkOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                วัน/เดือน/ปี ที่เกิดเหตุ
              </Typography>
            }
            name="fn_info_dmy"
            rules={[
              {
                required: false,
                message: "กรุณาระบุวัน/เดือน/ปี",
              },
            ]}
          >
            <DatePicker
              size="large"
              placeholder="วัน/เดือน/ปี"
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            label={
              <Typography sx={{ fontSize: "25px" }}>
                ส่งภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ
              </Typography>
            }
            name="fn_info_image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: false,
                message: "กรุณาแนบภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ",
              },
            ]}
          >
            <Upload
              name="fn_info_image"
              maxCount={3}
              listType="picture-card"
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="form-button"
              size="large"
            >
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                ส่งรายงาน
              </Typography>
            </Button>
          </Form.Item>
        </Form>
      </UserProfile>
    );
  }
};

export default FakeNewInformation;
