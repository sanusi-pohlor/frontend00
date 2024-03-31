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

const Adm_Article_Edit = () => {
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
  const [detailsImages, setDetailsImages] = useState([]);
  useEffect(() => {
    const fetchFakeData = async () => {
      try {
        const response = await fetch(
          `https://checkkonproject-sub.com/api/Article_show/${id}`
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
    fetchFakeData();
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

  var modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      ["link", "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] },
      ],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
      ],
    ],
  };
  var formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "size",
  ];

  const handleChange = (html) => {
    const regex = /<img src="[^"]+"[^>]*>/g;
    const matches = html.match(regex);
    const cleanedHtml = html.replace(regex, "");
    if (cleanedHtml.trim() !== "") {
      setEditorHtml(cleanedHtml);
    }
    if (matches) {
      const images = [];
      matches.forEach(async (match, index) => {
        const srcRegex = /src="([^"]+)"/;
        const src = srcRegex.exec(match)[1];
        try {
          const response = await fetch(src);
          const blob = await response.blob();
          images.push(blob);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      });
      setDetailsImages(images);
    } else {
      console.error("No matches found");
    }
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
      if (values.tag !== undefined) {
        formData.append("tag", JSON.stringify(values.tag));
      }
      detailsImages.forEach((image, index) => {
        formData.append(`details_image_${index}`, image);
      });
      const response = await fetch(
        `https://checkkonproject-sub.com/api/Adm_Article_update/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        message.success("Data saved successfully");
        navigate("/Admin/Adm_Article_Menu");
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
        <div className="cardsectionContent">แก้ไขบทความ</div>
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
          <Form.Item
            name="title"
            label={createTypography("หัวข้อ")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
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
          <br />
          <br />
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
                placeholder="เพิ่มรายละเอียดเพิ่มเติม"
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
                placeholder={createTypography("เพิ่มรายละเอียดเพิ่มเติม")}
                value={
                  details &&
                  details
                    .split("<p></p>")
                    .map(
                      (paragraph, index) =>
                        `<p>${paragraph}</p>` +
                        (data[`details_image_${index}`]
                          ? `<img src="${
                              data[`details_image_${index}`]
                            }" style="max-width: 100%; max-height: 300px; border-radius: 8px;" />`
                          : "")
                    )
                    .join("")
                }
                formats={formats}
                modules={modules}
                style={{ height: "950px" }}
              />
            </div>
          </Form.Item>
          <br />
          <br />
          <br />
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

export default Adm_Article_Edit;
