import {
  PlusOutlined,
  UserOutlined,
  LinkOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import UserProfile from "../User_Comoponents/Profile_Menu";
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select, Upload, message } from "antd";
import { Typography } from "@mui/material";
import moment from "moment";
import "moment/locale/th";
import { useNavigate } from "react-router-dom";

moment.locale("th");

const { Option } = Select;
const { TextArea } = Input;

const FakeNewInformation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [selectednum_mem, setSelectednum_mem] = useState("");
  const [selectOptions_med, setSelectOptions_med] = useState([]); // State for select options

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
    setLoading(true);
    console.log("values:", values);
    try {
      const formData = new FormData();
      formData.append("fn_info_nameid", user.id); // Corrected the field name
      formData.append("fn_info_province", user.province);
      formData.append("fn_info_head", values.fn_info_head); // Corrected the field name
      formData.append("fn_info_content", values.fn_info_content); // Corrected the field name
      formData.append("fn_info_source", values.fn_info_source); // Corrected the field name
      formData.append("fn_info_num_mem", values.fn_info_num_mem); // Corrected the field name
      formData.append("fn_info_more", values.fn_info_more); // Corrected the field name
      formData.append("fn_info_link", values.fn_info_link); // Corrected the field name
      formData.append("fn_info_dmy", values.fn_info_dmy);
      formData.append("fn_info_image", values.fn_info_image[0].originFileObj);
      //formData.append("fn_info_vdo", values.fn_info_vdo[0].originFileObj); // Corrected the field name
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/FakeNewsInfo_upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        console.log("Form data sent successfully");
        message.success("Form data sent successfully");
        navigate("/FakeNews/NotificationHistory");
      } else {
        message.error("Error sending form data");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      message.error("Error sending form data");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("https://fakenews001-392577897f69.herokuapp.com/api/user", {
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

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(`https://fakenews001-392577897f69.herokuapp.com/api/${endpoint}`);
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            textAlign: "center",
            fontSize: "50px",
            fontWeight: "bold",
            fontFamily: "'Th Sarabun New', sans-serif",
          }}
        >
          แจ้งข้อมูลเท็จ
        </div>
        <Form
          form={form}
          layout="vertical"
          name="FakeNewInformation"
          //onChange={onChange_dnc_med_id}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{
            maxWidth: "100%",
            padding: "5%",
          }}
          enctype="multipart/form-data"
        >
          <Form.Item
            label="ผู้ส่งรายงาน"
            //name="fn_info_nameid"
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
          <Form.Item
            label="จังหวัดของท่าน"
            //name="fn_info_province"
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
              placeholder={user.province}
              disabled
            />
          </Form.Item>
          <Form.Item
            label="หัวข้อ"
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
              //prefix={<LinkOutlined className="site-form-item-icon" />}
              placeholder="ระบุหัวข้อ"
            />
          </Form.Item>
          <Form.Item
            label="เนื้อหา"
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
              placeholder="เนื้อหา"
            />
          </Form.Item>
          <Form.Item
            label="แหล่งที่มาของข่าวปลอม"
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
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_med_id}
              allowClear
            >
              {selectOptions_med}
            </Select>
          </Form.Item>
          <Form.Item
            label="จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ"
            name="fn_info_num_mem"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Select
              size="large"
              placeholder="จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ"
              onChange={handlenum_memChange}
              value={selectednum_mem}
            >
              <Select.Option value="less50">น้อยกว่า 50</Select.Option>
              <Select.Option value="51-100">51-100</Select.Option>
              <Select.Option value="101-150">101-150</Select.Option>
              <Select.Option value="151-200">151-200</Select.Option>
              <Select.Option value="201-250">201-250</Select.Option>
              <Select.Option value="251-300">251-300</Select.Option>
              <Select.Option value="301-350">301-350</Select.Option>
              <Select.Option value="351-400">351-400</Select.Option>
              <Select.Option value="401-450">401-450</Select.Option>
              <Select.Option value="Ot451-500her">451-500</Select.Option>
              <Select.Option value="MoreThan501">มากกว่า 501</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="รายละเอียดเพิ่มเติม"
            name="fn_info_more"
            rules={[
              {
                required: true,
                message: "กรุณากรอกรายละเอียดเพิ่มเติม",
              },
            ]}
          >
            <TextArea
              rows={4}
              size="large"
              prefix={<EnvironmentOutlined className="site-form-item-icon" />}
              placeholder="รายละเอียดเพิ่มเติม"
            />
          </Form.Item>

          <Form.Item
            label="ระบุลิ้งค์ข้อมูล(ถ้ามี)"
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
              placeholder="ระบุลิ้งค์ข้อมูล(ถ้ามี)"
            />
          </Form.Item>
          <Form.Item
            label="วัน/เดือน/ปี ที่เกิดเหตุ"
            name="fn_info_dmy"
            rules={[
              {
                required: true,
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
            label="ส่งภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ"
            name="fn_info_image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
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

          {/* <Form.Item
            label="แนบวิดีโอ"
            name="fn_info_vdo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                message: "กรุณาแนบวิดีโอ",
              },
            ]}
          >
            <Upload
            {...uploadProps}
              name="fn_info_vdo"
              maxCount={3}
              action="http://localhost:8000/api/report_f_n_upload"
              listType="picture-card"
              multiple
              showUploadList={{ showPreviewIcon: false }}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item> */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              size="large"
            >
              ส่งรายงาน
            </Button>
          </Form.Item>
        </Form>
        <br />
        <br />
      </UserProfile>
    );
  }
};

export default FakeNewInformation;
