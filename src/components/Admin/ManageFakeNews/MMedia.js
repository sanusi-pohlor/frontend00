import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, Modal, message } from "antd";
import AdminMenu from "../Adm_Menu";
import { PlusCircleOutlined } from '@ant-design/icons';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const MMedia = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://fakenew-c1eaeda38e26.herokuapp.com/api/MediaChannels_request"
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

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("med_c_name", values.med_c_name);
      console.log(formData);
      const response = await fetch(
        "https://fakenew-c1eaeda38e26.herokuapp.com/api/MediaChannels_upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        message.success("Form data sent successfully");
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

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: 'รหัสช่องทางสื่อ',
      dataIndex: 'med_c_id',
      width: '20%',
      editable: true,
    },
    {
      title: 'ชื่อช่องทางสื่อ',
      dataIndex: 'med_c_name',
      width: '60%',
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <AdminMenu>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>จัดการช่องทางสื่อ</h1>
        <Button
          type="primary" shape="round" icon={<PlusCircleOutlined />} size="large"
          onClick={() => {
            setModalVisible(true);
          }}
          style={{ marginBottom: 16 }}
        >
          เพิ่มช่องทางสื่อ
        </Button>
      </div>
      <Modal
        title="เพิ่มช่องทางสื่อ"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          name="member_form"
          onFinish={onFinish}
        >
          {/* Add form fields for creating a new member */}
          <Form.Item
            name="med_c_name"
            label="ช่องทางสื่อ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/* Add more form fields here */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              เพิ่ม
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        //loading={loading}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </AdminMenu>
  );
};

export default MMedia;
