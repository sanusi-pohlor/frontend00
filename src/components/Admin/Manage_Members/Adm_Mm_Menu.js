import React, { useEffect, useState } from 'react';
import { Table, Form, Input, InputNumber, Button, Popconfirm, Select, Modal, message, Breadcrumb } from 'antd';
import AdminMenu from "../Adm_Menu";
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
const ManageMembers = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/AmUser"
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
      formData.append("vol_mem_fname", values.vol_mem_fname);
      formData.append("vol_mem_lname", values.vol_mem_lname);
      formData.append("vol_mem_address", values.vol_mem_address);
      formData.append("vol_mem_province", values.vol_mem_province);
      formData.append("vol_mem_ph_num", values.vol_mem_ph_num);
      formData.append("vol_mem_email", values.vol_mem_email);
      formData.append("vol_mem_get_news", values.vol_mem_get_news);
      console.log(formData);
      const response = await fetch(
        "http://localhost:8000/api/VolunteerMembers_upload",
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
      title: 'ชื่อ',
      dataIndex: 'username',
      width: '10%',
      editable: true,
    },
    {
      title: 'นามสกุล',
      dataIndex: 'lastName',
      width: '10%',
      editable: true,
    },
    // {
    //   title: 'ที่อยู่',
    //   dataIndex: 'vol_mem_address',
    //   width: '15%',
    //   editable: true,
    // },
    {
      title: 'จังหวัด',
      dataIndex: 'province',
      width: '10%',
      editable: true,
    },
    // {
    //   title: 'โทรศัพท์',
    //   dataIndex: 'vol_mem_ph_num',
    //   width: '10%',
    //   editable: true,
    // },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '15%',
      editable: true,
    },
    {
      title: 'ยินดีรับข้่าวสาร',
      dataIndex: 'receive_ct_email',
      width: '10%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      width: '10%',
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
        inputType: col.dataIndex === 'vol_mem_id' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <AdminMenu>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>จัดการสมาชิก</h1>
        <Button
          type="primary" shape="round" icon={<PlusCircleOutlined />} size="large"
          onClick={() => {
            setModalVisible(true);
          }}
          style={{ marginBottom: 16 }}
        >
          เพิ่มสมาชิกใหม่
        </Button>
      </div>
      <Modal
        title="เพิ่มสมาชิกใหม่"
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
            name="vol_mem_fname"
            label="ชื่อ"
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
            name="vol_mem_lname"
            label="นามสกุล"
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
            name="vol_mem_address"
            label="ที่อยู่"
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
            name="vol_mem_province"
            label="จังหวัด"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              //onChange={onGenderChange}
              allowClear
            >
              <Option value="Krabi">กระบี่</Option>
              <Option value="Chumphon">ชุมพร</Option>
              <Option value="Trang">ตรัง</Option>
              <Option value="NakhonSiThammarat">นครศรีธรรมราช</Option>
              <Option value="Trang">นราธิวาส</Option>
              <Option value="Pattani">ปัตตานี</Option>
              <Option value="PhangNga">พังงา</Option>
              <Option value="Phattalung">พัทลุง</Option>
              <Option value="Phuket">ภูเก็ต</Option>
              <Option value="Yala">ยะลา</Option>
              <Option value="Ranong">ระนอง</Option>
              <Option value="Songkhla">สงขลา</Option>
              <Option value="Satun">สตูล</Option>
              <Option value="SuratThani">สุราษฎร์ธานี</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="vol_mem_ph_num"
            label="โทรศัพท์"
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
            name="vol_mem_email"
            label="Email"
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
            name="vol_mem_get_news"
            label="ยินดีรับข้่าวสาร"
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
            //cell: EditableCell,
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
    </AdminMenu>
  );
};

export default ManageMembers;