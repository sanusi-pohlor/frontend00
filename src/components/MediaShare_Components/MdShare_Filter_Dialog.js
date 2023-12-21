import React, { useState } from "react";
import {
  Modal, Button, Form,
  Input,
  Select,
  DatePicker,
} from "antd";
const { Option } = Select;

const FilterDialog = ({ open, onClose, handleSubmit, FilterFinish }) => {
  const [form] = Form.useForm();
  const [filterOptions, setFilterOptions] = useState({
    option1: false,
    option2: false,
  });

  const handleOptionChange = (option) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const handleApplyFilters = () => {
    // You can use the selected filter options here
    // For example, pass them to a filtering function
    FilterFinish(filterOptions);
    onClose();
  };
  const fetchDataAndSetOptions = async (endpoint, fieldName) => {
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

  const onTypeChange = () => {
    fetchDataAndSetOptions("TypeInformation_request", "type_info");
  };
  const onChange_dnc_med_id = () => {
    fetchDataAndSetOptions("MediaChannels_request", "med_c");
  };
  return (
    <Modal
      title="ตัวกรอง"
      visible={open}
      onCancel={onClose}
      footer={null}
    >
      <div>
        <Form
          form={form}
          layout="vertical"
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          style={{
            maxWidth: "100%",
          }}
        >
          <Form.Item
            name="subp_type_id"
            label="ประเภทข่าว"
            rules={[
              {
                required: true,
                message: "Please select a type code!",
              },
            ]}
          >
            <Select
              placeholder="เลือกประเภท"
              onChange={onTypeChange}
              allowClear
            >
              {/* Populate the options */}
            </Select>
          </Form.Item>
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
              placeholder="เลือกช่องทางสื่อ"
              onChange={onChange_dnc_med_id}
              allowClear
            >
              {/* Populate the options */}
            </Select>
          </Form.Item>
          <Form.Item label="วัน/เดือน/ปี" style={{ marginBottom: "10px" }}>
            <DatePicker />
          </Form.Item>
          <Form.Item
            name=""
            label="จังหวัด"
            style={{ marginBottom: "10px" }}
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="เลือกจังหวัด"
              allowClear
            >
              <Select.Option value="Krabi">กระบี่</Select.Option>
              <Select.Option value="Chumphon">ชุมพร</Select.Option>
              <Select.Option value="Trang">ตรัง</Select.Option>
              <Select.Option value="NakhonSiThammarat">
                นครศรีธรรมราช
              </Select.Option>
              <Select.Option value="Narathiwat">นราธิวาส</Select.Option>
              <Select.Option value="Pattani">ปัตตานี</Select.Option>
              <Select.Option value="PhangNga">พังงา</Select.Option>
              <Select.Option value="Phattalung">พัทลุง</Select.Option>
              <Select.Option value="Phuket">ภูเก็ต</Select.Option>
              <Select.Option value="Yala">ยะลา</Select.Option>
              <Select.Option value="Ranong">ระนอง</Select.Option>
              <Select.Option value="Songkhla">สงขลา</Select.Option>
              <Select.Option value="Satun">สตูล</Select.Option>
              <Select.Option value="SuratThani">สุราษฎร์ธานี</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="คำสำคัญ" style={{ marginBottom: "10px" }}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              placeholder="เลือกจังหวัด"
              className="login-form-button"
              size="large"
            >
              ค้นหา
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default FilterDialog;
