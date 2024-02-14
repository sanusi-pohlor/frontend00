import React, { useState } from 'react';
import AdminMenu from "../AdminMenu";
import { Form, Input, InputNumber, Popconfirm, Table, Button, Modal, Radio } from 'antd';
import { Collapse } from 'antd';
import { Typography } from "@mui/material";


const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item name="modifier" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const originData = [];
for (let i = 0; i < 20; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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

const ManageValues = () => {

  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setOpen(false);
  };
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;

  const createMergedColumns = (columns) => {
    return columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });
  };

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...originData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        // ใช้ setData(newData) แทน setData([...data])
        // setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        // ใช้ setData(newData) แทน setData([...data])
        // setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const columns1 = [
    {
      title: 'รหัสประเภท',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'ชื่อประเภท',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns2 = [
    {
      title: 'รหัสประเด็นย่อย',
      dataIndex: 'age',
      width: '15%',
      editable: true,
    },
    {
      title: 'รหัสประเภท',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'ชื่อประเด็นย่อย',
      dataIndex: 'address',
      width: '40%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns3 = [
    {
      title: 'รหัสแรงจูงใจ',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'ชื่อแรงจูงใจ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns4 = [
    {
      title: 'รหัสลักษณะข้อมูล',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'ชื่อลักษณะข้อมูล',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns5 = [
    {
      title: 'รหัสประเภทการกระทำ',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'ชื่อประเภทการกระทำ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns6 = [
    {
      title: 'รหัสช่องทางสื่อ',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'ชื่อช่องทางสื่อ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns7 = [
    {
      title: 'รหัสตรวจสอบ',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'รูปแบบการตรวจสอบ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns8 = [
    {
      title: 'รหัสการจัดการ',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'วิธีการจัดการ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns9 = [
    {
      title: 'รหัสรูปแบบข้อมูล',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'ชื่อรูปแบบข้อมูล',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns10 = [
    {
      title: 'รหัสผู้เผยแพร่',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'ชื่อผู้เผยแพร',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns11 = [
    {
      title: 'รหัสรายละเอียดการตรวจสอบ',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'รหัสการตรวจสอบ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสการแจ้ง',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'วันที่ตรวจสอบ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'ข้อมูลเพิ่มเติม',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns12 = [
    {
      title: 'รหัสรายละเอียดช่องทางการแจ้ง',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'รหัสช่องทางสื่อ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสการแจ้ง',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสผู้เผยแพร',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสรูปแบบข้อมูล',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสการจัดการ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'ขอบเขตการเผยแพร',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'จำนวนสมาชิกในกลุ่มที่อยู่ในสื่อ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'วันที่ในสื่อ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'ภาพ capture',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'Link URL',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const columns13 = [
    {
      title: 'รหัสการแจ้ง',
      dataIndex: 'age',
      width: '20%',
      editable: true,
    },
    {
      title: 'รหัสประเด็นย่อย',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสสมาชิก',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสแรงจูงใจ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสประเภทการกระทำ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'รหัสลักษณะข้อมูล',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'รายละเอียดในเนื้อหา',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'จำนวนการวนซ้ำ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'วันที่แจ้ง',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'สถานะการตรวจสอบ',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'หัวข้อเนื้อหา',
      dataIndex: 'name',
      width: '60%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
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
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );

      },
    },
  ];
  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label} {text}
    </Typography>
  );
  const columnSets = [columns1, columns2, columns3, columns4, columns5, columns6, columns7, columns8, columns9, columns10, columns11, columns12, columns13];
  const items = columnSets.map((columns, index) => ({
    key: (index + 1).toString(),
    label: [
      'ประเภทเนื้อหาข้อมูลเท็จ',
      'ประเด็นย่อย',
      'แรงจูงใจ',
      'ลักษณะข้อมูล',
      'ประเภทการกระทำ',
      'ช่องทางสื่อ',
      'การตรวจสอบ',
      'การจัดการปัญหา',
      'รูปแบบของข้อมูล',
      'ผู้เผยแพร่',
      'รายละเอียดช่องทางการแจ้ง',
      'การแจ้งข้อมูลที่เป็นเท็จ',
      'สมาชิกอาสา',
    ][index],
    children: (
      <div>
        <Card className="cardsection">
          <div className="cardsectionContent">จัดการค่า</div>
        </Card>
        <br />
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={originData}
          columns={createMergedColumns(columns)}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          New Collection
        </Button>
        <CollectionCreateForm
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </div>
    ),
  }));

  return (
    <AdminMenu>
      <Collapse accordion items={items} />
    </AdminMenu>
  );
};

export default ManageValues;
