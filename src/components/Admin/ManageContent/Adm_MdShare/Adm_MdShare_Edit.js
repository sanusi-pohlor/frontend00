import React, { useEffect, useState } from "react";
import AdminMenu from "../../Adm_Menu";
import "react-quill/dist/quill.snow.css";
import { Form, Input, Button, message, Upload, Select } from "antd";
import ReactQuill from "react-quill";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";

const Adm_MdShare_Edit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editorHtml, setEditorHtml] = useState("");
  const [user, setUser] = useState(null);
  const options = [];
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  for (let i = 10; i < 36; i++) {
    options.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i,
    });
  }
  const handleChangetag = (value) => {
    console.log(`selected ${value}`);
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

  const modules = {
    toolbar: {
      handlers: {
        //image: imageHandler,
      },
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
  ];

  const handleChange = (html) => {
    setEditorHtml(html);
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://fakenews001-392577897f69.herokuapp.com/api/Adm_MdShare_Edit/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setImg(data);
        form.setFieldsValue({
          title: data.title,
          details: data.details,
          link: data.link,
          tag: data.tag,
        });
      } else {
        console.error("Invalid date received from the server");
        form.setFieldsValue({
          fn_info_dmy: moment(),
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const onFinish = async (values) => {
    console.log("values :", values);
    console.log("values :", editorHtml);
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("Author", user.id);
      formData.append("title", values.title);
      formData.append("details", editorHtml);
      formData.append("cover_image", values.cover_image[0].originFileObj);
      formData.append("video", values.video);
      formData.append("link", values.link);
      formData.append("tag", values.tag);
      const response = await fetch(
        `https://fakenews001-392577897f69.herokuapp.com/api/Adm_MdShare_update/${id}`,
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
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <AdminMenu>
      <Form
        form={form}
        layout="vertical"
        name="dynamic_form_complex"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="ผู้เขียน"
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
            placeholder={user ? user.username : "Username"}
            disabled
          />
        </Form.Item>
        <Form.Item name="title" label="หัวข้อ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="details"
          label="รายละเอียด"
          rules={[{ required: false }]}
        >
          <div style={{ height: "300px" }}>
            <ReactQuill
              onChange={handleChange}
              placeholder="Write something..."
              formats={formats}
              modules={modules}
              style={{ height: "250px" }}
            />
          </div>
        </Form.Item>
        <Form.Item
          label="รูปภาพหน้าปก"
          name="cover_image"
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
        {/* <Form.Item
          label="วิดีโอ"
          name="video"
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
            name="video"
            maxCount={3}
            listType="picture-card"
            beforeUpload={() => false}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item> */}
        <Form.Item name="link" label="Link" rules={[{ required: false }]}>
          <Input />
        </Form.Item>
        <Form.Item name="tag" label="Tag" rules={[{ required: false }]}>
          <Select
            mode="tags"
            style={{
              width: "100%",
            }}
            onChange={handleChangetag}
            tokenSeparators={[","]}
            options={options}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </AdminMenu>
  );
};

export default Adm_MdShare_Edit;
