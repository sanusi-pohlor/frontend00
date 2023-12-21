import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Modal,
  Select,
  message,
  DatePicker
} from "antd";
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
const MC_Information = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectOptions_subp, setSelectOptions_subp] = useState([]); // State for select options
  const [selectOptions_vol, setSelectOptions_vol] = useState([]); // State for select options
  const [selectOptions_moti, setSelectOptions_moti] = useState([]); // State for select options
  const [selectOptions_act, setSelectOptions_act] = useState([]); // State for select options
  const [selectOptions_d_c, setSelectOptions_d_c] = useState([]); // State for select options

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://fakenew-c1eaeda38e26.herokuapp.com/api/Information_request"
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
      formData.append("info_subp_id", values.info_subp_id);
      formData.append("info_vol_mem_id", values.info_vol_mem_id);
      formData.append("info_moti_id", values.info_moti_id);
      formData.append("info_act_id", values.info_act_id);
      formData.append("info_d_c_id", values.info_d_c_id);
      formData.append("info_det_cont", values.info_det_cont);
      formData.append("info_num_rep", values.info_num_rep);
      formData.append("info_date", values.info_date);
      formData.append("info_status", values.info_status);
      formData.append("info_cont_topic", values.info_cont_topic);
      console.log(formData);
      const response = await fetch(
        "https://fakenew-c1eaeda38e26.herokuapp.com/api/Information_upload",
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
      title: "รหัสการแจ้ง",
      dataIndex: "info_id",
      width: "20%",
      editable: true,
    },
    {
      title: "รหัสประเด่นย่อย",
      dataIndex: "info_subp_id",
      width: "60%",
      editable: true,
    },
    {
      title: "รหัสสมาชิก",
      dataIndex: "info_vol_mem_id",
      width: "60%",
      editable: true,
    },
    {
      title: "รหัสแรงจูงใจ",
      dataIndex: "info_moti_id",
      width: "60%",
      editable: true,
    },
    {
      title: "รหัสประเภทการกระทำ",
      dataIndex: "info_act_id",
      width: "60%",
      editable: true,
    },
    {
      title: "รหัสลักษณะข้อมูล",
      dataIndex: "info_d_c_id",
      width: "60%",
      editable: true,
    },
    {
      title: "รายละเอียดเนื้อหา",
      dataIndex: "info_det_cont",
      width: "60%",
      editable: true,
    },
    {
      title: "จำนวนการวนซ้ำ",
      dataIndex: "info_num_rep",
      width: "60%",
      editable: true,
    },
    {
      title: "วันที่แจ้ง",
      dataIndex: "info_date",
      width: "60%",
      editable: true,
    },
    {
      title: "สถานะการตรวจสอบ",
      dataIndex: "info_status",
      width: "60%",
      editable: true,
    },
    {
      title: "หัวข้อเนื้อหา",
      dataIndex: "info_cont_topic",
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

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(`https://fakenew-c1eaeda38e26.herokuapp.com/api/${endpoint}`);
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code[`${fieldName}_id`]} value={code[`${fieldName}_id`]}>
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
        console.error(`Error fetching ${fieldName} codes:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching ${fieldName} codes:`, error);
    }
  };

  const onChange_info_subp_id = () => {
    fetchDataAndSetOptions("Subpoint_request", "subp", setSelectOptions_subp);
  };

  const onChange_info_vol_mem_id = () => {
    fetchDataAndSetOptions("VolunteerMembers_request", "vol_mem", setSelectOptions_vol);
  };

  const onChange_info_moti_id = () => {
    fetchDataAndSetOptions("Motivation_request", "moti", setSelectOptions_moti);
  };

  const onChange_info_act_id = () => {
    fetchDataAndSetOptions("ActionType_request", "act_ty", setSelectOptions_act);
  };

  const onChange_info_d_c_id = () => {
    fetchDataAndSetOptions("DataCharacteristics_request", "data_cha", setSelectOptions_d_c);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>จัดการการแจ้งข้อมูลที่เป็นเท็จ</h1>
        <Button
          type="primary" shape="round" icon={<PlusCircleOutlined />} size="large"
          onClick={() => {
            setModalVisible(true);
            onChange_info_subp_id();
            onChange_info_vol_mem_id();
            onChange_info_moti_id();
            onChange_info_act_id();
            onChange_info_d_c_id();
          }}
          style={{ marginBottom: 16 }}
        >
          เพิ่มการแจ้งข้อมูลที่เป็นเท็จ
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
            name="info_subp_id"
            label="รหัสประเด่นย่อย"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_info_subp_id}
              allowClear
            >
              {selectOptions_subp} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="info_vol_mem_id"
            label="รหัสสมาชิก"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_info_vol_mem_id}
              allowClear
            >
              {selectOptions_vol} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="info_moti_id"
            label="รหัสแรงจูงใจ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_info_moti_id}
              allowClear
            >
              {selectOptions_moti} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="info_act_id"
            label="รหัสประเภทการกระทำ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_info_act_id}
              allowClear
            >
              {selectOptions_act} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="info_d_c_id"
            label="รหัสลักษณะข้อมูล"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_info_d_c_id}
              allowClear
            >
              {selectOptions_d_c} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="info_det_cont"
            label="รายละเอียดเนื้อหา"
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
            name="info_num_rep"
            label="จำนวนการวนซ้ำ"
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
            name="info_date"
            label="วันที่แจ้ง"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
              <DatePicker />
          </Form.Item>
          <Form.Item
            name="info_status"
            label="สถานะการตรวจสอบ"
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
            name="info_cont_topic"
            label="หัวข้อเนื้อหา"
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
export default MC_Information;


// const onChange_info_subp_id = async () => {
//   try {
//     const response = await fetch(
//       "http://localhost:8000/api/Subpoint_request"
//     );
//     if (response.ok) {
//       const typeCodes = await response.json();
//       const options = typeCodes.map((code) => (
//         <Option key={code.subp_id} value={code.subp_id}>
//           {code.subp_name}
//         </Option>
//       ));
//       form.setFieldsValue({ subp_id: undefined });
//       form.setFields([
//         {
//           name: "subp_id",
//           value: undefined,
//         },
//       ]);
//       setSelectOptions_subp(options);
//     } else {
//       console.error("Error fetching type codes:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error fetching type codes:", error);
//   }
// };
// const onChange_info_vol_mem_id = async () => {
//   try {
//     const response = await fetch(
//       "http://localhost:8000/api/VolunteerMembers_request"
//     );
//     if (response.ok) {
//       const typeCodes = await response.json();
//       const options = typeCodes.map((code) => (
//         <Option key={code.vol_mem_id} value={code.vol_mem_id}>
//           {code.vol_mem_fname}
//         </Option>
//       ));
//       form.setFieldsValue({ vol_mem_id: undefined });
//       form.setFields([
//         {
//           name: "vol_mem_id",
//           value: undefined,
//         },
//       ]);
//       setSelectOptions_vol(options);
//     } else {
//       console.error("Error fetching type codes:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error fetching type codes:", error);
//   }
// };
// const onChange_info_moti_id = async () => {
//   try {
//     const response = await fetch(
//       "http://localhost:8000/api/Motivation_request"
//     );
//     if (response.ok) {
//       const typeCodes = await response.json();
//       const options = typeCodes.map((code) => (
//         <Option key={code.moti_id} value={code.moti_id}>
//           {code.moti_name}
//         </Option>
//       ));
//       form.setFieldsValue({ moti_id: undefined });
//       form.setFields([
//         {
//           name: "moti_id",
//           value: undefined,
//         },
//       ]);
//       setSelectOptions_moti(options);
//     } else {
//       console.error("Error fetching type codes:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error fetching type codes:", error);
//   }
// };
// const onChange_info_act_id = async () => {
//   try {
//     const response = await fetch(
//       "http://localhost:8000/api/ActionType_request"
//     );
//     if (response.ok) {
//       const typeCodes = await response.json();
//       const options = typeCodes.map((code) => (
//         <Option key={code.act_ty_id} value={code.act_ty_id}>
//           {code.act_ty_name}
//         </Option>
//       ));
//       form.setFieldsValue({ act_ty_id: undefined });
//       form.setFields([
//         {
//           name: "act_ty_id",
//           value: undefined,
//         },
//       ]);
//       setSelectOptions_act(options);
//     } else {
//       console.error("Error fetching type codes:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error fetching type codes:", error);
//   }
// };
// const onChange_info_d_c_id = async () => {
//   try {
//     const response = await fetch(
//       "http://localhost:8000/api/DataCharacteristics_request"
//     );
//     if (response.ok) {
//       const typeCodes = await response.json();
//       const options = typeCodes.map((code) => (
//         <Option key={code.data_cha_id} value={code.data_cha_id}>
//           {code.data_cha_name}
//         </Option>
//       ));
//       form.setFieldsValue({ data_cha_id: undefined });
//       form.setFields([
//         {
//           name: "data_cha_id",
//           value: undefined,
//         },
//       ]);
//       setSelectOptions_d_c(options);
//     } else {
//       console.error("Error fetching type codes:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error fetching type codes:", error);
//   }
// };