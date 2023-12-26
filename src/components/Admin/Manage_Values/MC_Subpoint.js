import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, Modal, Select, message } from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
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

const MC_Subpoint = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]); // State for select options

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/Subpoint_request"
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
      formData.append("subp_type_id", values.subp_type_id);
      formData.append("subp_name", values.subp_name);
      console.log(formData);
      const response = await fetch(
        "https://fakenews001-392577897f69.herokuapp.com/api/Subpoint_upload",
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
    form.setFieldsValue({ ...record });
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
      console.error("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: 'รหัสประเด็นย่อย',
      dataIndex: 'subp_id',
      width: '15%',
      editable: true,
    },
    {
      title: 'รหัสประเภท',
      dataIndex: 'subp_type_id',
      width: '25%',
      editable: true,
    },
    {
      title: 'ชื่อประเด็นย่อย',
      dataIndex: 'subp_name',
      width: '40%',
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

  const onTypeChange = async () => {
    try {
      const response = await fetch("https://fakenews001-392577897f69.herokuapp.com/api/TypeInformation_request");
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code.type_info_id} value={code.type_info_id}>
            {code.type_info_name}
          </Option>
        ));
        form.setFieldsValue({ type_info_id: undefined });
        form.setFields([{
          name: 'type_info_id',
          value: undefined,
        }]);
        setSelectOptions(options);
      } else {
        console.error("Error fetching type codes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching type codes:", error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>จัดการประเด็นย่อย</h1>
        <Button
          type="primary" shape="round" icon={<PlusCircleOutlined />} size="large"
          onClick={() => {
            setModalVisible(true);
            onTypeChange(); // Call the function when the "Add" button is clicked
          }}
          style={{ marginBottom: 16 }}
        >
          เพิ่มประเด็นย่อย
        </Button>
      </div>
      <Modal
        title="เพิ่มประเด็นย่อย"
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
            name="subp_type_id"
            label="รหัสประเภท"
            rules={[
              {
                required: true,
                message: "Please select a type code!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onTypeChange}
              allowClear
            >
              {selectOptions} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="subp_name"
            label="ชื่อประเด็นย่อย"
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
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </div>
  );
};

export default MC_Subpoint;
