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
  Image,
  Card,
} from "antd";
import Typography from "@mui/material/Typography";
import moment from "moment";
import "moment/locale/th";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
moment.locale("th");

const { Option } = Select;
const { TextArea } = Input;

const FnInfoEdit = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [province, setProvince] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [med, setmed] = useState([]);
  const [selectednum_mem, setSelectednum_mem] = useState("");
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [formattedDate, setFormattedDate] = useState(null);
  const navigate = useNavigate();
  const [source, setSource] = useState(null);

  useEffect(() => {
    fetchmed();
  }, []);
  useEffect(() => {
    fetchFakeNewsData();
  }, [id, med]);

  const handlenum_memChange = (value) => {
    setSelectednum_mem(value);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const fetchmed = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/MediaChannels_request"
      );
      if (response.ok) {
        const Data = await response.json();
        setmed(Data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchFakeNewsData = async () => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/FakeNewsInfo_edit/${id}`
      );
      if (response.ok) {
        const FakeNewsData = await response.json();
        setData(FakeNewsData);
        const filteredIds = med.filter(
          (item) => item.id === (FakeNewsData && FakeNewsData.fn_info_source)
        );
        form.setFieldsValue({
          fn_info_head: FakeNewsData.fn_info_head,
          fn_info_content: FakeNewsData.fn_info_content,
          fn_info_source: FakeNewsData.fn_info_source,
          fn_info_num_mem: FakeNewsData.fn_info_num_mem,
          fn_info_more: FakeNewsData.fn_info_more,
          fn_info_link: FakeNewsData.fn_info_link,
        });
        setSource(FakeNewsData.fn_info_source);
        setFormattedDate(moment(FakeNewsData.fn_info_dmy).format("YYYY-MM-DD"));
      } else {
        console.error("Invalid date received from the server");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinish = async (values) => {
    console.log("values : ", values);
    try {
      const filteredIds = med.filter(
        (item) => item.id === (data && data.fn_info_source)
      );
      const formData = new FormData();

      const appendIfDefined = (fieldName, value) => {
        if (value !== undefined) {
          formData.append(fieldName, value);
        }
      };

      appendIfDefined("fn_info_head", values.fn_info_head);
      appendIfDefined("fn_info_content", values.fn_info_content);
      if (values.fn_info_source !== filteredIds[0]?.med_c_name) {
        formData.append("fn_info_source", values.fn_info_source);
      }
      appendIfDefined("fn_info_num_mem", values.fn_info_num_mem);
      appendIfDefined("fn_info_more", values.fn_info_more);
      appendIfDefined("fn_info_link", values.fn_info_link);
      appendIfDefined("fn_info_dmy", values.fn_info_dmy);
      if (values.fn_info_image !== undefined) {
        formData.append("fn_info_image", values.fn_info_image[0].originFileObj);
      }
      const response = await fetch(
        `https://checkkonproject-sub.com/api/FakeNewsInfo_update/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        console.log("Form data updated successfully");
        message.success("Form data updated successfully");
        navigate("/FakeNews/NotificationHistory");
      } else {
        message.error("Error updating form data");
      }
    } catch (error) {
      console.error("Error updating form data:", error);
      message.error("Error updating form data");
    } finally {
      setLoading(false);
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
          setProvince(filteredIds[0]);
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
  useEffect(() => {
    onChange_dnc_med_id();
  }, []);

  if (!user) {
    return (
      <UserProfile>
        <div>Loading...</div>
      </UserProfile>
    );
  } else {
    return (
      <UserProfile>
        <Card className="cardsection">
          <div className="cardsectionContent">แก้ไขรายงานการแจ้งข้อมูลเท็จ</div>
        </Card>
        <Form
          form={form}
          layout="vertical"
          name="FakeNewInformation"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{
            maxWidth: "100%",
            padding: "5%",
          }}
          enctype="multipart/form-data"
        >
          <Form.Item
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                ผู้ส่งรายงาน
              </Typography>
            }
            //name="fn_info_nameid"
            rules={[
              {
                required: false,
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
              //name="fn_info_province"
              rules={[
                {
                  required: false,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
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
                required: false,
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
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                เนื้อหา
              </Typography>
            }
            name="fn_info_content"
            rules={[
              {
                required: false,
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
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                แหล่งที่มาของข่าวปลอม
              </Typography>
            }
            name="fn_info_source"
            rules={[
              {
                required: false,
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
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ
              </Typography>
            }
            name="fn_info_num_mem"
            rules={[
              {
                required: false,
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
              placeholder="รายละเอียดเพิ่มเติม"
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
              placeholder="ระบุลิ้งค์ข้อมูล(ถ้ามี)"
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
            {" "}
            <Typography variant="body1" sx={{ fontSize: "25px" }}>
              {formattedDate}
            </Typography>
            เปลี่ยนใหม่
            <br />
            <DatePicker
              size="large"
              placeholder="วัน/เดือน/ปี"
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item
            label={
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                ส่งภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จใหม่
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
          ภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จเก่า
          <br />
          {data && data.fn_info_image ? (
            <Image width={200} src={data.fn_info_image} alt="รูปภาพข่าวปลอม" />
          ) : (
            <div>No image available</div>
          )}
          <br />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="form-button"
              size="large"
            >
              <Typography variant="body1" sx={{ fontSize: "25px" }}>
                แก้ไขรายงาน
              </Typography>
            </Button>
          </Form.Item>
        </Form>
        <br />
        <br />
      </UserProfile>
    );
  }
};

export default FnInfoEdit;
