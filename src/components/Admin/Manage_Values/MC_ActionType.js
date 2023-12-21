import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Popconfirm,
  message,
  Modal,
  InputNumber,
  Breadcrumb,
} from "antd";
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
const MC_ActionType = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://fakenew-c1eaeda38e26.herokuapp.com/api/ActionType_request"
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
      formData.append("act_ty_name", values.act_ty_name);
      console.log(formData);
      const response = await fetch(
        "https://fakenew-c1eaeda38e26.herokuapp.com/api/ActionType_upload",
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
      title: "รหัสประเภทการกระทำ",
      dataIndex: "act_ty_id",
      width: "20%",
      editable: true,
    },
    {
      title: "ชื่อประเภทการกระทำ",
      dataIndex: "act_ty_name",
      width: "60%",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "operation",
      width: "20%",
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
          <a disabled={editingKey !== ""} onClick={() => edit(record)}>
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
        inputType: col.dataIndex === "act_ty_id" ? "act_ty_name" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div>
      <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>จัดการประเภทการกระทำ</h1>
        <Button
          type="primary" shape="round" icon={<PlusCircleOutlined />} size="large"
          onClick={() => {
            setModalVisible(true);
          }}
          style={{ marginBottom: 16 }}
        >
          เพิ่มประเภทการกระทำ
        </Button>
      </div>
      <Modal
        title="เพิ่มประเภทการกระทำ"
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
            name="act_ty_name"
            label="ชื่อประเภทการกระทำ"
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
    </div>
  );
};
export default MC_ActionType;


// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Form,
//   Input,
//   Button,
//   Popconfirm,
//   message,
//   Modal,
//   InputNumber,
// } from "antd";

// // EditableCell component for rendering editable cells in the table
// const EditableCell = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   ...restProps
// }) => {
//   const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           name={dataIndex}
//           style={{
//             margin: 0,
//           }}
//           rules={[
//             {
//               required: true,
//               message: `Please Input ${title}!`,
//             },
//           ]}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   );
// };

// const MC_ActionType = () => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState([]); // Data for the table
//   const [editingKey, setEditingKey] = useState(""); // Currently editing row key
//   const [modalVisible, setModalVisible] = useState(false); // Modal visibility

//   // Function to fetch data
//   const fetchData = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:8000/api/ActionType_request"
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setData(data);
//       } else {
//         console.error("Error fetching data:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Handle form submission for adding a new item
//   const onFinish = async (values) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("act_ty_name", values.act_ty_name);
//       const response = await fetch(
//         "http://localhost:8000/api/ActionType_upload",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (response.ok) {
//         message.success("Form data sent successfully");
//       } else {
//         message.error("Error sending form data");
//       }
//     } catch (error) {
//       console.error("Error sending form data:", error);
//       message.error("Error sending form data");
//     } finally {
//       setLoading(false);
//       setModalVisible(false); // Close the modal after submission
//     }
//   };

//   // Check if a row is currently being edited
//   const isEditing = (record) => record.key === editingKey;

//   // Start editing a row
//   const edit = (record) => {
//     form.setFieldsValue({ ...record });
//     setEditingKey(record.key);
//   };

//   // Cancel editing
//   const cancel = () => {
//     setEditingKey("");
//   };

//   // Save changes to a row
//   const save = async (key) => {
//     try {
//       const row = await form.validateFields();
//       const newData = [...data];
//       const index = newData.findIndex((item) => key === item.key);

//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, {
//           ...item,
//           ...row,
//         });
//         setData(newData);
//         setEditingKey("");
//       } else {
//         newData.push(row);
//         setData(newData);
//         setEditingKey("");
//       }
//     } catch (errInfo) {
//       console.error("Validate Failed:", errInfo);
//     }
//   };

//   // Define table columns
//   const columns = [
//     {
//       title: "รหัสประเภทการกระทำ",
//       dataIndex: "act_ty_id",
//       width: "20%",
//       editable: true,
//     },
//     {
//       title: "ชื่อประเภทการกระทำ",
//       dataIndex: "act_ty_name",
//       width: "60%",
//       editable: true,
//     },
//     {
//       title: "Action",
//       dataIndex: "operation",
//       width: "20%",
//       render: (_, record) => {
//         const editable = isEditing(record);
//         return editable ? (
//           <span>
//             <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
//               Save
//             </a>
//             <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//               <a>Cancel</a>
//             </Popconfirm>
//           </span>
//         ) : (
//           <a disabled={editingKey !== ""} onClick={() => edit(record)}>
//             Edit
//           </a>
//         );
//       },
//     },
//   ];

//   // Map columns to editable cells
//   const mergedColumns = columns.map((col) => {
//     if (!col.editable) {
//       return col;
//     }
//     return {
//       ...col,
//       onCell: (record) => ({
//         record,
//         inputType: col.dataIndex === "act_ty_id" ? "act_ty_name" : "text",
//         dataIndex: col.dataIndex,
//         title: col.title,
//         editing: isEditing(record),
//       }),
//     };
//   });

//   return (
//     <div>
//       <Button
//         type="primary"
//         onClick={() => {
//           setModalVisible(true);
//         }}
//         style={{ marginBottom: 16 }}
//       >
//         เพิ่มประเภทการกระทำ
//       </Button>
//       <Modal
//         title="เพิ่มประเภทการกระทำ"
//         visible={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         footer={null}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           name="member_form"
//           onFinish={onFinish}
//         >
//           {/* Add form fields for creating a new item */}
//           <Form.Item
//             name="act_ty_name"
//             label="ชื่อประเภทการกระทำ"
//             rules={[
//               {
//                 required: true,
//                 message: "Please input the title of collection!",
//               },
//             ]}
//           >
//             <Input />
//           </Form.Item>
//           {/* Add more form fields here */}
//           <Form.Item>
//             <Button type="primary" htmlType="submit">
//               เพิ่ม
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//       <Table
//         components={{
//           body: {
//             cell: EditableCell,
//           },
//         }}
//         bordered
//         dataSource={data}
//         columns={mergedColumns}
//         rowClassName="editable-row"
//         pagination={{
//           onChange: cancel,
//         }}
//       />
//     </div>
//   );
// };

// export default MC_ActionType;


// import axios from 'axios';

// const save = async (key) => {
//   try {
//     const row = await form.validateFields();
//     const response = await axios.put(`/api/action-types/${key}`, row);
//     if (response.status === 200) {
//       message.success('Record updated successfully');
//     } else {
//       message.error('Error updating record');
//     }
//   } catch (errInfo) {
//     console.error('Validate Failed:', errInfo);
//   }
// };

//---------------------laravel----------------------
// public function update(Request $request, $id)
// {
//     // Validate and sanitize input data
//     $validatedData = $request->validate([
//         'act_ty_name' => 'required|string|max:255',
//     ]);

//     // Find the record to update
//     $actionType = ActionType::findOrFail($id);

//     // Update the record with the new data
//     $actionType->update($validatedData);

//     return response()->json(['message' => 'Record updated successfully'], 200);
// }

