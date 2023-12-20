import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  Select,
  Modal,
  message,
  Space,
  Breadcrumb,
  Row,
  Col,
} from "antd";
import AdminMenu from "../Adm_Menu";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

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
const Manage_Fake_Info_Menu = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectOptions_vol, setSelectOptions_vol] = useState([]); // State for select options
  const [selectOptions_med, setSelectOptions_med] = useState([]); // State for select options
  const [selectOptions_c_info, setSelectOptions_c_info] = useState([]); // State for select options
  const [selectOptions_fm, setSelectOptions_fm] = useState([]); // State for select options
  const [selectOptions_dis, setSelectOptions_dis] = useState([]); // State for select options
  const [selectOptions_ty, setSelectOptions_ty] = useState([]); // State for select options
  const [selectOptions_con, setSelectOptions_con] = useState([]); // State for select options
  const [selectOptions_moti, setSelectOptions_moti] = useState([]); // State for select options
  const [selectOptions_data, setSelectOptions_data] = useState([]); // State for select optionsons
  const [selectOptions_prov, setSelectOptions_prov] = useState([]); // State for select optionsons
  const getFields = () => {
    const fields = form.getFieldsValue();
    return fields;
  };
  function getThaiMonth(month) {
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    return thaiMonths[month];
  }
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://fakenew-c1eaeda38e26.herokuapp.com/api/Manage_Fake_Info_request"
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
      const response = await fetch(
        "https://fakenew-c1eaeda38e26.herokuapp.com/api/Manage_Fake_Info_upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ระบุ Content-Type เป็น JSON
          },
          body: JSON.stringify(values), // แปลงข้อมูลให้เป็น JSON string
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
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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

  const handleDelete = (id) => {
    console.log(`ลบรายการ: ${id}`);
    fetch(
      `https://fakenew-c1eaeda38e26.herokuapp.com/api/Manage_Fake_Info_delete/${id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Fake News deleted successfully") {
          console.log("รายการถูกลบสำเร็จ");
          fetchData();
        } else {
          console.error("เกิดข้อผิดพลาดในการลบรายการ:", data);
        }
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการลบรายการ:", error);
      });
  };
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "รอตรวจสอบ";
      case 1:
        return "กำลังตรวจสอบ";
      case 2:
        return "ตรวจสอบเสร็จสิ้น";
    }
  };
  const columns = [
    {
      title: "ลำดับ",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "ประทับเวลา",
      dataIndex: "mfi_time",
      width: "15%",
      editable: true,
    },
    {
      title: "จังหวัดของท่าน",
      dataIndex: "mfi_province",
      width: "10%",
      editable: true,
    },
    {
      title: "ผู้ส่งรายงาน",
      dataIndex: "mfi_mem",
      width: "10%",
      editable: true,
    },
    {
      title: "แหล่งที่มาของข่าวปลอม",
      dataIndex: "mfi_med_c",
      width: "15%",
      editable: true,
    },
    {
      title: "เพิ่มเมื่อ",
      dataIndex: "created_at",
      width: "15%",
      editable: true,
      render: (created_at) => {
        const date = new Date(created_at);
        const formattedDate = `${date.getDate()} ${getThaiMonth(
          date.getMonth()
        )} ${date.getFullYear() + 543}`;
        return formattedDate;
      },
    },
    {
      title: "สถานะ",
      dataIndex: "mfi_status",
      width: "15%",
      render: (status) => getStatusText(status),
    },
    {
      title: "จัดการ",
      width: "15%",
      editable: true,
      render: (text, record) => (
        <Space size="middle">
          <Link
            to={`/Admin/Manage_Fake_Info/Manage_Fake_Info_View/${record.id}`}
          >
            <EyeOutlined style={{ fontSize: "16px", color: "blue" }} />
          </Link>
          {record.status === 0 && (
            <>
              <Link to={`/Admin/Manage_Fake_Info/edit/${record.id}`}>
                <EditOutlined style={{ fontSize: "16px", color: "green" }} />
              </Link>
              <Popconfirm
                title="คุณแน่ใจหรือไม่ที่จะลบรายการนี้?"
                onConfirm={() => handleDelete(record.id)}
                okText="ใช่"
                cancelText="ไม่"
              >
                <Button type="link">
                  <DeleteOutlined style={{ fontSize: "16px", color: "red" }} />
                </Button>
              </Popconfirm>
            </>
          )}
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
        inputType: col.dataIndex === "vol_mem_id" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(
        `https://fakenew-c1eaeda38e26.herokuapp.com/api/${endpoint}`
      );
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
        console.error(
          `Error fetching ${fieldName} codes:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error fetching ${fieldName} codes:`, error);
    }
  };

  const onChange_mfi_province = () => {
    fetchDataAndSetOptions("Province_request", "prov", setSelectOptions_prov);
  };

  const onChange_mfi_mem_id = () => {
    fetchDataAndSetOptions(
      "VolunteerMembers_request",
      "vol_mem",
      setSelectOptions_vol
    );
  };

  const onChange_mfi_med_c_id = () => {
    fetchDataAndSetOptions(
      "MediaChannels_request",
      "med_c",
      setSelectOptions_med
    );
  };

  const onChange_mfi_c_info_id = () => {
    fetchDataAndSetOptions(
      "Motivation_request",
      "c_info",
      setSelectOptions_c_info
    );
  };

  const onChange_mfi_fm_d_id = () => {
    fetchDataAndSetOptions("FormatData_request", "fm_d", setSelectOptions_fm);
  };

  const onChange_mfi_dis_c_id = () => {
    fetchDataAndSetOptions(
      "DetailsNotiChannels_request",
      "dis_c",
      setSelectOptions_dis
    );
  };
  const onChange_mfi_ty_info_id = () => {
    fetchDataAndSetOptions(
      "TypeInformation_request",
      "type_info",
      setSelectOptions_ty
    );
  };

  const onChange_mfi_con_about_id = () => {
    fetchDataAndSetOptions(
      "VolunteerMembers_request",
      "con_about",
      setSelectOptions_con
    );
  };

  const onChange_mfi_moti_id = () => {
    fetchDataAndSetOptions("Motivation_request", "moti", setSelectOptions_moti);
  };

  const onChange_mfi_data_cha_id = () => {
    fetchDataAndSetOptions(
      "DataCharacteristics_request",
      "data_cha",
      setSelectOptions_data
    );
  };

  return (
    <AdminMenu>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>จัดการข้อมูลรับแจ้ง</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        name="member_form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="mfi_time"
              label="ประทับเวลา"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mfi_province"
              label="จังหวัดของท่าน"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_province}
                allowClear
              >
                {selectOptions_prov}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="mfi_mem"
              label="ผู้ส่งรายงาน"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_mem_id}
                allowClear
              >
                {selectOptions_vol}
              </Select>
            </Form.Item>
            <Form.Item
              name="mfi_med_c"
              label="แหล่งที่มาของข่าวปลอม"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_med_c_id}
                allowClear
              >
                {selectOptions_med}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="mfi_img"
              label="ส่งภาพบันทึกหน้าจอหรือภาพถ่ายที่พบข้อมูลเท็จ"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mfi_link"
              label="ระบุลิ้งค์ข้อมูล (ถ้ามี)"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mfi_c_info"
              label="แหล่งที่มาของข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_c_info_id}
                allowClear
              >
                {selectOptions_c_info}
              </Select>
            </Form.Item>
            <Form.Item
              name="mfi_num_mem"
              label="จำนวนสมาชิกที่อยู่ในกลุ่มที่อาจเผยแพร่ข้อมูลเท็จ"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mfi_agency"
              label="หน่วยงานที่เก็บข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mfi_d_topic"
              label="หัวข้อข้อมูลผิดพลาด"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="mfi_fm_d"
              label="รูปแบบของข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_fm_d_id}
                allowClear
              >
                {selectOptions_fm}
              </Select>
            </Form.Item>
            <Form.Item
              name="mfi_dis_c"
              label="ช่องทางการเผยแพร่"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_dis_c_id}
                allowClear
              >
                {selectOptions_dis}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="mfi_publ"
              label="ผู้เผยแพร่ข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mfi_ty_info"
              label="ประเภทของข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_ty_info_id}
                allowClear
              >
                {selectOptions_ty}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="mfi_only_cv"
              label="เฉพาะโควิด-15"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mfi_con_about"
              label="มีเนื้อหาเกี่ยวกับ"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_con_about_id}
                allowClear
              >
                {selectOptions_con}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mfi_moti"
              label="แรงจูงใจการเผยแพร่"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_moti_id}
                allowClear
              >
                {selectOptions_moti}
              </Select>
            </Form.Item>
            <Form.Item
              name="mfi_iteration"
              label="จำนวนการวนซ้ำ"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mfi_che_d"
              label="การตรวจสอบข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="mfi_data_cha"
              label="ลักษณะข้อมูล"
              rules={[
                {
                  required: false,
                  message: "Please input the title of collection!",
                },
              ]}
            >
              <Select
                placeholder="Select a option and change input text above"
                onChange={onChange_mfi_data_cha_id}
                allowClear
              >
                {selectOptions_data}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            เพิ่ม
          </Button>
        </Form.Item>
      </Form>
    </AdminMenu>
  );
};

export default Manage_Fake_Info_Menu;
