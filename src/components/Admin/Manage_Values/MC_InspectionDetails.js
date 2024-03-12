import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Button,
  Modal,
  Select,
  message,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Typography } from "@mui/material";

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
const MC_InspectionDetails = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Subpoint_request"
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
    try {
      const formData = new FormData();
      formData.append("subp_type_id", values.subp_type_id);
      formData.append("subp_name", values.subp_name);
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Subpoint_upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        message.success("Form data sent successfully");
        fetchData();
      } else {
        message.error("Error sending form data");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      message.error("Error sending form data");
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
      title: "รหัสรายละเอียดการตรวจสอบ",
      dataIndex: "ins_dt_id",
      width: "20%",
      editable: true,
    },
    {
      title: "รหัสการตรวจสอบ",
      dataIndex: "ins_dt_che_id",
      width: "60%",
      editable: true,
    },
    {
      title: "รหัสการแจ้ง",
      dataIndex: "ins_dt_info_id",
      width: "60%",
      editable: true,
    },
    {
      title: "วันที่ตรวจสอบ",
      dataIndex: "ins_dt_date",
      width: "60%",
      editable: true,
    },
    {
      title: "ข้อมูลเพิ่มเติม",
      dataIndex: "ins_dt_more",
      width: "60%",
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
  const onGenderChange_ins_dt_che_id = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/TypeInformation_request"
      );
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code.data_cha_id} value={code.data_cha_id}>
            {code.data_cha_name}
          </Option>
        ));
        form.setFieldsValue({ data_cha_id: undefined });
        form.setFields([
          {
            name: "data_cha_id",
            value: undefined,
          },
        ]);
        setSelectOptions(options);
      } else {
        console.error("Error fetching type codes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching type codes:", error);
    }
  };
  const onGenderChange_ins_dt_info_id = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/TypeInformation_request"
      );
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code.info_id} value={code.info_id}>
            {code.info_det_cont}
          </Option>
        ));
        form.setFieldsValue({ info_id: undefined });
        form.setFields([
          {
            name: "info_id",
            value: undefined,
          },
        ]);
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>จัดการประเด็นย่อย</h1>
        <Button
          type="primary"
          shape="round"
          icon={<PlusCircleOutlined />}
          size="large"
          onClick={() => {
            setModalVisible(true);
            //onGenderChange(); // Call the function when the "Add" button is clicked
          }}
          style={{ marginBottom: 16 }}
        >
          เพิ่มประเด็นย่อย
        </Button>
      </div>
      <Modal
        title="เพิ่มประเด็นย่อย"
        open={modalVisible}
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
            name="ins_dt_che_id"
            label="รหัสการตรวจสอบ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onGenderChange_ins_dt_che_id}
              allowClear
            >
              {selectOptions} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="ins_dt_info_id"
            label="รหัสการแจ้ง"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onGenderChange_ins_dt_info_id}
              allowClear
            >
              {selectOptions} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="ins_dt_date"
            label="วันที่ตรวจสอบ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ins_dt_more"
            label="ข้อมูลเพิ่มเติม"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
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
export default MC_InspectionDetails;
