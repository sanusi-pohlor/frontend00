import React, { useEffect, useState } from "react";
import {
  Modal, Button, Form,
  Input,
  Select,
  DatePicker,
} from "antd";
const { Option } = Select;

const FilterDialog = ({ open, onClose, handleSubmit, FilterFinish }) => {
  const [form] = Form.useForm();
  const [selectOptions_prov, setSelectOptions_prov] = useState([]);
  const [selectOptions_ty, setSelectOptions_ty] = useState([]);
  const [selectOptions_med, setSelectOptions_med] = useState([]);
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

  const handleApplyFilters = async () => {
    try {
      const response = await fetch(
        `https://fakenews001-392577897f69.herokuapp.com/api/Adm_News_request`
      );
      if (response.ok) {
        const newsData = await response.json();
        // Filter data based on form input
        const filteredData = newsData.filter((data) => {
          return data.subp_type_id === form.getFieldValue("subp_type_id");
          // Add more conditions based on other form fields as needed
        });

        // Send the filtered data to FilterFinish function
        FilterFinish(filteredData);
        onClose();
      } else {
        console.error("Failed to fetch news data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching news data:", error);
    }
  };
  
  const fetchDataAndSetOptions = async (endpoint, fieldName, stateSetter) => {
    try {
      const response = await fetch(
        `https://fakenews001-392577897f69.herokuapp.com/api/${endpoint}`
      );
      if (response.ok) {
        const typeCodes = await response.json();
        const options = typeCodes.map((code) => (
          <Option key={code[`id`]} value={code[`id`]}>
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
  const onChange_mfi_ty_info_id = () => {
    fetchDataAndSetOptions(
      "TypeInformation_request",
      "type_info",
      setSelectOptions_ty
    );
  };
  const onChange_dnc_med_id = () => {
    fetchDataAndSetOptions(
      "MediaChannels_request",
      "med_c",
      setSelectOptions_med
    );
  };
  useEffect(() => {
    onChange_mfi_province();
    onChange_dnc_med_id();
    onChange_mfi_ty_info_id();
  }, []);
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
                required: false,
                message: "Please select a type code!",
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
          <Form.Item
            name="dnc_med_id"
            label="ช่องทางสื่อ"
            rules={[
              {
                required: false,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select
              placeholder="เลือกช่องทางสื่อ"
              onChange={onChange_dnc_med_id}
              allowClear
            >
              {selectOptions_med}
            </Select>
          </Form.Item>
          <Form.Item label="วัน/เดือน/ปี" style={{ marginBottom: "10px" }}>
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="province"
            label="จังหวัด"
            style={{ marginBottom: "10px" }}
            rules={[
              {
                required: false,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Select onChange={onChange_mfi_province} allowClear>
              {selectOptions_prov}
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
              onClick={handleApplyFilters}
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
