import React, { useCallback, useEffect, useState } from "react";
import AdminMenu from "../../Adm_Menu";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Card,
  Select,
  Image,
  Divider,
} from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
const { Option } = Select;

const Adm_News_Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [data, setData] = useState(null);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [editorHtml, setEditorHtml] = useState("");
  const [user, setUser] = useState(null);
  const [selectOptions_tags, setSelectOptions_tags] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchFakeNewsData = async () => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/News_show/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setData(data);
          form.setFieldsValue({
            title: data.title,
          });
          setDetails(data.details);
        } else {
          console.error("Invalid date received from the server");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchFakeNewsData();
  }, [id, form]);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
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
        setOptions((prevOptions) => [...prevOptions, { label: data.tag_name }]);
      } else {
        console.error("Error adding tag:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
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

  const modules = {
    toolbar: {
      container: [
        [
          { header: "1" },
          { header: "2" },
          { header: [3, 4, 5, 6] },
          { font: [] },
        ],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
        ["code-block"],
        [{ align: [] }],
      ],
    },
    clipboard: {
      matchVisual: true,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "align",
  ];

  const handleChange = (html) => {
    setEditorHtml(html);
    setDetails(data.details);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const appendIfDefined = (fieldName, value) => {
        if (value !== undefined) {
          formData.append(fieldName, value);
        }
      };
      appendIfDefined("title", values.title);
      if (values.cover_image !== undefined) {
        formData.append("cover_image", values.cover_image[0].originFileObj);
      }
      appendIfDefined("details", editorHtml);
      if (values.details_image !== undefined) {
        if (values.details_image && values.details_image.length > 0) {
          values.details_image.forEach((image, index) => {
            formData.append(`details_image_${index}`, image.originFileObj);
          });
        }
      }
      if (values.tag !== undefined) {
        formData.append("tag", JSON.stringify(values.tag));
      }

      const response = await fetch(
        `https://checkkonproject-sub.com/api/Adm_News_update/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Data saved successfully");
        navigate("/Admin/Adm_News_Menu");
      } else {
        message.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onChange_Tags = useCallback(async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Tags_request"
      );
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

  useEffect(() => {
    onChange_Tags();
  }, []);

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label} {text}
    </Typography>
  );

  return (
    <AdminMenu>
      <Card className="cardsection">
        <div className="cardsectionContent">แก้ไขข่าวสาร</div>
      </Card>
      <br />
      <Card>
        <Form
          form={form}
          layout="vertical"
          name="dynamic_form_complex"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label={createTypography("ผู้เขียน")}
            rules={[
              {
                required: true,
                message: createTypography("กรุณาเพิ่มผู้เขียน!"),
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder={user ? user.username : createTypography("ผู้เขียน")}
              disabled
            />
          </Form.Item>
          <Divider />
          <Form.Item
            name="title"
            label={createTypography("หัวข้อ")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Divider />
          <Form.Item
            label={createTypography("รูปภาพหน้าปกใหม่")}
            name="cover_image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: false,
                message: createTypography(
                  "กรุณาแนบภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ"
                ),
              },
            ]}
          >
            <Upload
              name="cover_image"
              maxCount={1}
              listType="picture-card"
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Typography variant="body1" sx={{ fontSize: "25px", color: "red" }}>
            รูปภาพหน้าปกเก่า (หากไม่ต้องการเปลี่ยน ไม่ต้องอัพโหลดใหม่)
          </Typography>
          {data && data.cover_image ? (
            <Image width={200} src={data.cover_image} alt="รูปภาพข่าวปลอม" />
          ) : (
            <div>No image available</div>
          )}
          <Divider />
          <Form.Item
            name="details"
            label={createTypography("รายละเอียดเพิ่มเติม")}
            rules={[{ required: false }]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
            }}
          >
            <div style={{ height: "1000px" }}>
              <ReactQuill
                onChange={handleChange}
                placeholder={createTypography("เพิ่มรายละเอียดเพิ่มเติม")}
                formats={formats}
                modules={modules}
                style={{ height: "950px" }}
              />
            </div>
          </Form.Item>
          <Form.Item
            name=""
            label={
              <Typography
                variant="body1"
                sx={{ fontSize: "25px", color: "red" }}
              >
                รายละเอียดเพิ่มเติมเก่า (หากไม่ต้องการเปลี่ยน
                ไม่ต้องอัพโหลดใหม่)
              </Typography>
            }
            rules={[{ required: false }]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <div style={{ height: "1000px" }}>
              <ReactQuill
                onChange={handleChange}
                placeholder={createTypography("เพิ่มรายละเอียดเพิ่มเติม")}
                value={details}
                formats={formats}
                modules={modules}
                style={{ height: "950px" }}
              />
            </div>
          </Form.Item>
          <Divider />
          <Form.Item
            label={
              <Typography
                variant="body1"
                sx={{ fontSize: "25px", color: "red" }}
              >
                รูปภาพเพิ่มเติม (ให้อัพโหลดใหม่ทุกครั้ง อัปโหลดใหม่แล้วรูปจะทับรูปเดิมทั้งหมด)
              </Typography>
            }
            name="details_image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: false,
                message: createTypography(
                  "กรุณาแนบภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ"
                ),
              },
            ]}
          >
            <Upload
              name="details_image"
              maxCount={10}
              listType="picture-card"
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          {createTypography("รูปภาพเพิ่มเติมเก่า")}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {Array.from({ length: 8 }, (_, index) => {
              const imageKey = `details_image_${index}`;
              return data && data[imageKey] ? (
                <Image
                  key={imageKey}
                  width={200}
                  height={200}
                  src={data[imageKey]}
                  style={{ borderRadius: "8px" }}
                />
              ) : (
                <div></div>
              );
            })}
          </div>
          <Divider />
          <Form.Item
            name="tag"
            label={createTypography("เพิ่มแท็ก")}
            rules={[{ required: false }]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="เพิ่มแท็ก"
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
          <Typography variant="body1" sx={{ fontSize: "25px", color: "red" }}>
            แท็กเก่า (หากไม่ต้องการเปลี่ยน ไม่ต้องอัพโหลดใหม่)
          </Typography>
          {data && data.tag ? data.tag : <div>ไม่มีแท็ก</div>}
          <Divider />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="form-button"
            >
              {createTypography("บันทึก")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AdminMenu>
  );
};

export default Adm_News_Edit;
