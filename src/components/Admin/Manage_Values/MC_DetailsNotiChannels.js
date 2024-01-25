import React, { useEffect, useState } from 'react';
import { DatePicker, Table, Form, Input, Button, Popconfirm, Select, Modal, InputNumber, message, Card } from 'antd';
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

const MC_DetailsNotiChannels = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectOptions_med, setSelectOptions_med] = useState([]); // State for select options
  const [selectOptions_info, setSelectOptions_info] = useState([]); // State for select options
  const [selectOptions_pub, setSelectOptions_pub] = useState([]); // State for select options
  const [selectOptions_fm_d, setSelectOptions_fm_d] = useState([]); // State for select options
  const [selectOptions_prob, setSelectOptions_prob] = useState([]); // State for select options

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/DetailsNotiChannels_request"
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
      formData.append("dnc_med_id", values.dnc_med_id);
      formData.append("dnc_info_id", values.dnc_info_id);
      formData.append("dnc_pub_id", values.dnc_pub_id);
      formData.append("dnc_fm_d_id", values.dnc_fm_d_id);
      formData.append("dnc_prob_id", values.dnc_prob_id);
      formData.append("dnc_scop_pub", values.dnc_scop_pub);
      formData.append("dnc_num_mem_med", values.dnc_num_mem_med);
      formData.append("dnc_date_med", values.dnc_date_med);
      formData.append("dnc_capt", values.dnc_capt);
      formData.append("dnc_link", values.dnc_link);
      console.log(formData);
      const response = await fetch(
        "https://checkkonproject-sub.com/api/DetailsNotiChannels_upload",
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
    setEditingKey('');
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
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
    }
  };
  const columns = [
    {
      title: 'รหัสรายละเอียดช่องทางการแจ้ง',
      dataIndex: 'dnc_id',
      width: '20%',
      editable: true,
    },
    {
      title: 'รหัสช่องทางสื่อ',
      dataIndex: 'dnc_med_id',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสการแจ้ง',
      dataIndex: 'dnc_info_id',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสผู้เผยแพร',
      dataIndex: 'dnc_pub_id',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสรูปแบบข้อมูล',
      dataIndex: 'dnc_fm_d_id',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสการจัดการ',
      dataIndex: 'dnc_prob_id',
      width: '60%',
      editable: true,
    },
    {
      title: 'ขอบเขตการเผยแพร',
      dataIndex: 'dnc_scop_pub',
      width: '60%',
      editable: true,
    },
    {
      title: 'จำนวนสมาชิกในกลุ่มที่อยู่ในสื่อ',
      dataIndex: 'dnc_num_mem_med',
      width: '60%',
      editable: true,
    },
    {
      title: 'วันที่ในสื่อ',
      dataIndex: 'dnc_date_med',
      width: '60%',
      editable: true,
    },
    {
      title: 'ภาพ capture',
      dataIndex: 'dnc_capt',
      width: '60%',
      editable: true,
    },
    {
      title: 'Link URL',
      dataIndex: 'dnc_link',
      width: '60%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      width: '20%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <a disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </a>
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
      const response = await fetch(`https://checkkonproject-sub.com/api/${endpoint}`);
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

  const onChange_dnc_med_id = () => {
    fetchDataAndSetOptions("MediaChannels_request", "med_c", setSelectOptions_med);
  };

  const onChange_dnc_info_id = () => {
    fetchDataAndSetOptions("Information_request", "info", setSelectOptions_info);
  };

  const onChange_dnc_pub_id = () => {
    fetchDataAndSetOptions("Publisher_request", "pub", setSelectOptions_pub);
  };

  const onChange_dnc_fm_d_id = () => {
    fetchDataAndSetOptions("FormatData_request", "fm_d", setSelectOptions_fm_d);
  };

  const onChange_dnc_prob_id = () => {
    fetchDataAndSetOptions("ProblemManagement_request", "prob_m", setSelectOptions_prob);
  };

  return (
    <div>
      <Card
        style={{
          borderRadius: "20px",
          backgroundColor: "#7BBD8F",
        }}
      >
        <div
          style={{
            fontSize: "70px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Th Sarabun New', sans-serif",
            color: "white",
          }}
        >
          จัดการช่องทางสื่อ
          <Button
            type="primary" shape="round" icon={<PlusCircleOutlined />} size="large"
            onClick={() => {
              setModalVisible(true);
              onChange_dnc_med_id();
              onChange_dnc_info_id();
              onChange_dnc_pub_id();
              onChange_dnc_fm_d_id();
              onChange_dnc_prob_id();
            }}
            style={{ marginBottom: 16 }}
          >
            เพิ่มช่องทางสื่อ
          </Button>
        </div>
      </Card>
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
            name="dnc_med_id"
            label="ช่องทางสื่อ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_med_id}
              allowClear
            >
              {selectOptions_med} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_info_id"
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
              onChange={onChange_dnc_info_id}
              allowClear
            >
              {selectOptions_info} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_pub_id"
            label="รหัสผู้เผยแพร"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_pub_id}
              allowClear
            >
              {selectOptions_pub} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_fm_d_id"
            label="รหัสรูปแบบข้อมูล"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_fm_d_id}
              allowClear
            >
              {selectOptions_fm_d} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_prob_id"
            label="รหัสการจัดการ"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={onChange_dnc_prob_id}
              allowClear
            >
              {selectOptions_prob} {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item
            name="dnc_scop_pub"
            label="ขอบเขตการเผยแพร"
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
            name="dnc_num_mem_med"
            label="จำนวนสมาชิกในกลุ่มที่อยู่ในสื่อ"
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
            name="dnc_date_med"
            label="วันที่ในสื่อ"
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
            name="dnc_capt"
            label="ภาพ capture"
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
            name="dnc_link"
            label="Link URL"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
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
        //loading={loading}
        pagination={{
          onChange: cancel,
        }}
      />
    </div>
  );
};
export default MC_DetailsNotiChannels;