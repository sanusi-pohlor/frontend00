import React, { useEffect, useState } from 'react';
import { Table, Form, Input, InputNumber, Button, Popconfirm, Select, Modal, message, Card } from 'antd';
import AdminMenu from "../Adm_Menu";

const ManageMembers = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/AmUser"
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
    {
      title: 'จังหวัด',
      dataIndex: 'province',
      width: '10%',
      editable: true,
    },
    {
      title: 'โทรศัพท์',
      dataIndex: 'vol_mem_ph_num',
      width: '10%',
      editable: true,
    },
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
      render: (record) => (
        <Space size="middle">
          <Link to={`/Adm_Mm_Menu/Adm_Mm_View/${record.id}`}>
            <EyeOutlined style={{ fontSize: '16px', color: 'blue' }} />
          </Link>
        </Space>
      ),
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
      <Card className="cardsection">
        <div className="cardsectionContent">จัดการสมาชิก</div>
      </Card>
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