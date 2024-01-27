import React, { useEffect, useState } from "react";
import AdminMenu from "../../Adm_Menu";
import "react-quill/dist/quill.snow.css";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Card,
  Select,
  Space,
} from "antd";
import ReactQuill from "react-quill";
import {
  PlusOutlined,
  MinusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Typography } from "@mui/material";

const { Option } = Select;

const Adm_News_Form = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editorHtml, setEditorHtml] = useState("");
  const [user, setUser] = useState(null);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [options, setOptions] = useState([]);
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

  useEffect(() => {
    fetch("https://checkkonproject-sub.com/api/Tags_request")
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          label: item.tag_name,
        }));
        setOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

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
        ["link", "video"],
        ["link", "image", "video"],
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
    "image",
    "video",
    "align",
  ];

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("Author", user.id);
      formData.append("title", values.title);
      formData.append("details", editorHtml);
      formData.append("cover_image", values.cover_image[0].originFileObj);
      formData.append("video", values.video);
      formData.append("link", JSON.stringify(values.link));
      formData.append("tag", JSON.stringify(values.tag));
      formData.append("type_new", values.type_new);
      formData.append("med_new", values.med_new);
      formData.append("prov_new", values.prov_new);
      formData.append("key_new", values.key_new);
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Adm_News_upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Data saved successfully");
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

  const onChange_mfi_ty_info_id = () => {
    fetchDataAndSetOptions(
      "TypeInformation_request",
      "type_info",
      setSelectOptions_ty
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
    fetchDataAndSetOptions("Province_request", "prov", setSelectOptions_prov);
  };

  useEffect(() => {
    onChange_mfi_province();
    onChange_dnc_med_id();
    onChange_mfi_ty_info_id();
  }, []);

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>{label} {text}</Typography>
  );

  return (
    <AdminMenu>
      <Card className="cardsection">
        <div className="cardsectionContent">เพิ่มข่าวสาร</div>
      </Card>
      <br />
      <Card
        className="cardContent"
      >
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
          <Form.Item name="title" label={createTypography("หัวข้อ")} rules={[{ required: true }]}>
            <Input placeholder={createTypography("เพิ่มหัวข้อ")} />
          </Form.Item>
          <Form.Item
            name="details"
            label={createTypography("รายละเอียดเพิ่มเติม")}
            rules={[{ required: false }]}
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
            label={createTypography("รูปภาพหน้าปก")}
            name="cover_image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: false,
                message: createTypography("กรุณาแนบภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ"),
              },
            ]}
          >
            <Upload
              name="cover_image"
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
          <Form.Item label={createTypography("ลิงค์เพิ่มเติม")} rules={[{ required: false }]}>
            <Form.List name="link">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 12,
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "first"]}
                        rules={[
                          {
                            required: true,
                            message: createTypography("กรุณาเพิ่มลิงค์!"),
                          },
                        ]}
                      >
                        <Input placeholder="เพิ่มลิงค์เพิ่มเติม" style={{ width: "100%" }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      เพิ่มลิงค์
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item name="tag" label={createTypography("แท็ก")} rules={[{ required: false }]}>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder={createTypography("เพิ่มแท็ก")}
              onSearch={(value) => {
                if (Array.isArray(options)) {
                  handleTagCreation(value);
                }
              }}
              options={options}
            />
          </Form.Item>
          <Form.Item
            name="type_new"
            label={createTypography("ประเภทข่าว")}
            rules={[{ required: false }]}
          >
            <Select
              placeholder={createTypography("เลือกประเภทข่าว")}
              onChange={onChange_mfi_ty_info_id}
              allowClear
            >
              {selectOptions_ty}
            </Select>
          </Form.Item>
          <Form.Item
            name="med_new"
            label={createTypography("ช่องทางสื่อ")}
            rules={[{ required: false }]}
          >
            <Select
              placeholder={createTypography("เลือกช่องทางสื่อ")}
              onChange={onChange_dnc_med_id}
              allowClear
            >
              {selectOptions_med}
            </Select>
          </Form.Item>
          <Form.Item
            name="prov_new"
            label={createTypography("จังหวัด")}
            rules={[{ required: false }]}
          >
            <Select onChange={onChange_mfi_province} allowClear placeholder={createTypography("เลือกจังหวัด")}>
              {selectOptions_prov}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="form-button">
              {createTypography("บันทึก")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AdminMenu>
  );
};

export default Adm_News_Form;
