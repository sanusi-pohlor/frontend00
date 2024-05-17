import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Image,
  Modal,
  Form,
  Divider,
  Upload,
  message,
} from "antd";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import AdminMenu from "../Adm_Menu";
import { Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/th";
import { PlusOutlined } from "@ant-design/icons";
const thaiLocale = "th";
moment.locale(thaiLocale);
const M_DB_Adm_Menu = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataimage, setDataimage] = useState([]);
  const [province, setProvince] = useState(null);
  const [datamanage, setDatamanage] = useState([]);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [user, setUser] = useState(null);
  const [modalVisible0, setModalVisible0] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [modalVisible4, setModalVisible4] = useState(false);
  const navigate = useNavigate();
  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#6A5ACD",
    "#B22222",
    "#7FFFD4",
    "#3CB371",
    "#FFD700",
    "#FF4500",
    "#4169E1",
    "#32CD32",
    "#FFD700",
    "#808080",
    "#800080",
    "#FF1493",
    "#8A2BE2",
    "#00FA9A",
    "#AF19FF",
    "#20B2AA",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
    "#FF00FF",
    "#000000",
    "#808000",
    "#800000",
  ];

  const getDbimage = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/Dbimage_request"
      );
      if (response.ok) {
        const data = await response.json();
        setDataimage(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const handleAdd = async () => {
    const formData = new FormData();
    const image0 = form.getFieldValue("image0");
    if (image0 && image0.length > 0) {
      formData.append("image0", image0[0].originFileObj);
    }
    const image1 = form.getFieldValue("image1");
    if (image1 && image1.length > 0) {
      formData.append("image1", image1[0].originFileObj);
    }
    const image2 = form.getFieldValue("image2");
    if (image2 && image2.length > 0) {
      formData.append("image2", image2[0].originFileObj);
    }
    const image3 = form.getFieldValue("image3");
    if (image3 && image3.length > 0) {
      formData.append("image3", image3[0].originFileObj);
    }
    const image4 = form.getFieldValue("image4");
    if (image4 && image4.length > 0) {
      formData.append("image4", image4[0].originFileObj);
    }
    const response = await fetch(
      "https://checkkonproject-sub.com/api/Dbimage_update",
      {
        method: "POST",
        body: formData,
      }
    );
    if (response.ok) {
      message.success("ยืนยันสมาชิกเรียบร้อย");
      getDbimage();
      setIsModalOpen2(false);
    } else {
      message.error("Error updating item");
    }
  };

  const delImg = async (img) => {
    try {
      const formData = new FormData();
      formData.append("img", 0);
      const response = await fetch(`https://checkkonproject-sub.com/api/delImg/${img}`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        message.success("Image deleted successfully");
        getDbimage();
      } else {
        message.error("Error deleting image");
      }
      setModalVisible0(false);
      setModalVisible1(false);
      setModalVisible2(false);
      setModalVisible3(false);
      setModalVisible4(false);
    } catch (error) {
      console.error("An error occurred:", error);
      message.error("An error occurred while deleting the image");
      setModalVisible0(false);
      setModalVisible1(false);
      setModalVisible2(false);
      setModalVisible3(false);
      setModalVisible4(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("https://checkkonproject-sub.com/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("User data retrieval failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const fetchDataInfo = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/fiadmin_request"
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
  const fetchData_Manage = async () => {
    try {
      const response = await fetch(
        "https://checkkonproject-sub.com/api/mfi_Search_request"
      );
      if (response.ok) {
        const data = await response.json();
        setDatamanage(data);
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchDataInfo();
    fetchData_Manage();
    fetchProvince();
    getDbimage();
  }, []);

  const fetchProvince = async () => {
    try {
      const response = await fetch(
        `https://checkkonproject-sub.com/api/Pvname_request/${user.province}`
      );
      if (response.ok) {
        const pv = await response.json();
        setProvince(pv);
      } else {
        console.error("Error fetching province data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching province data:", error);
    }
  };
  useEffect(() => {
    fetchProvince();
  }, [user]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    localStorage.removeItem("access_token");
    navigate(`/`);
    window.location.reload();
    console.log("Logged out successfully");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  const countByStatus = (status) => {
    return data.filter((item) => item.fn_info_status === status).length;
  };
  const countByresults = (result) => {
    return datamanage.filter((item) => item.mfi_results === result).length;
  };

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>
      {label} {text}
    </Typography>
  );

  const items = [
    {
      key: "1",
      label: createTypography("จำนวนข้อมูลที่แจ้ง"),
      children: createTypography(data.length),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "2",
      label: createTypography("จำนวนข้อมูลที่ยังไม่ตรวจสอบ"),
      children: createTypography(countByStatus(0)),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "3",
      label: createTypography("จำนวนข้อมูลทีกำลังตรวจสอบ"),
      children: createTypography(countByStatus(1)),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "4",
      label: createTypography("จำนวนข้อมูลทีตรวจสอบเรียบร้อย"),
      children: createTypography(countByStatus(2)),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "5",
      label: createTypography("จำนวนข้อมูลทีเป็นข่าวจริง"),
      children: createTypography(countByresults(1)),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
    {
      key: "6",
      label: createTypography("จำนวนข้อมูลทีเป็นข่าวเท็จ"),
      children: createTypography(countByresults(0)),
      labelStyle: { background: "#7BBD8F", color: "white" },
    },
  ];

  const items2 = [
    {
      key: "10",
      label: "",
      children: user && (
        <img
          src={
            "https://www.jollyboxdesign.com/wp-content/uploads/2021/08/Administrator.png"
          }
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
      ),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "20",
      label: createTypography("ชื่อ-สกุล"),
      children: user && createTypography(user.username, user.lastname),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "30",
      label: createTypography("เบอร์ติดต่อ"),
      children: user && createTypography(user.phone_number),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "40",
      label: createTypography("ไอดีไลน์"),
      children: user && createTypography(user.Id_line),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "50",
      label: createTypography("อีเมล"),
      children: user && createTypography(user.email),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "60",
      label: createTypography("จังหวัด"),
      children: province && createTypography(province.prov_name),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
    {
      key: "70",
      label: createTypography("เกี่ยวกับผู้เขียน"),
      children:
        user &&
        createTypography(user.about),
      labelStyle: { background: "#7BBD8F", color: "#FFFFFF" },
    },
  ];

  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [chartData3, setChartData3] = useState([]);

  const [options] = useState([
    {
      title: "ประเภทสื่อ",
      value: "MediaChannels_request",
      name: "med_c_name",
      dataIndex: "mfi_med_c",
    },
    {
      title: "รูปแบบข่าว",
      value: "FormatData_request",
      name: "fm_d_name",
      dataIndex: "mfi_fm_d",
    },
    {
      title: "จังหวัด",
      value: "Province_request",
      name: "prov_name",
      dataIndex: "mfi_province",
    },
  ]);

  useEffect(() => {
    const fetchData = async (endpoint, name, dataIndex) => {
      try {
        const Manage_Fake_Info = await fetch(
          "https://checkkonproject-sub.com/api/mfi_d_request"
        );
        const MediaChannels = await fetch(
          `https://checkkonproject-sub.com/api/${endpoint}`
        );

        if (Manage_Fake_Info.ok && MediaChannels.ok) {
          const Manage_Fake_Infodata = await Manage_Fake_Info.json();
          const MediaChannelsData = await MediaChannels.json();

          const countByMedCId = MediaChannelsData.map((channel) => {
            const count = Manage_Fake_Infodata.filter(
              (fakeInfo) => fakeInfo[dataIndex] === channel.id
            ).length;

            return {
              name: channel[name],
              value: count,
            };
          });

          return countByMedCId;
        } else {
          console.error("Failed to fetch data");
          return [];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return [];
      }
    };

    Promise.all(
      options.map((option) =>
        fetchData(option.value, option.name, option.dataIndex)
      )
    ).then((data) => {
      setChartData1(data[0]);
      setChartData2(data[1]);
      setChartData3(data[2]);
    });
  }, [options]);

  const validData = data.filter(
    (item) => item.created_at && Date.parse(item.created_at)
  );
  const dateObjects = validData.map((item) => new Date(item.created_at));

  if (dateObjects.length === 0) {
    console.error("No valid date data found.");
    return null;
  }
  const newestDate = dateObjects.reduce(
    (maxDate, currentDate) => (currentDate > maxDate ? currentDate : maxDate),
    dateObjects[0]
  );
  const oldestMonthYear = moment().format("Do MMMM YYYY");
  const newestMonthYear = moment(newestDate).format("LLLL yyyy");

  return (
    <AdminMenu>
      <Card className="cardsection">
        <div className="cardsectionContent">หน้าหลักแอดมิน</div>
      </Card>
      <Divider />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card hoverable className="dataCard">
            <div className="pieChartTitle">{"ประเภทสื่อ"}</div>
            <Divider />
            <ResponsiveContainer width="100%" height={400}>
              <PieChart className="PieChartContainer">
                <Tooltip />
                <Pie
                  data={chartData1}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={`${Math.min(80, 80) - 1}%`}
                  label
                >
                  {chartData1.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card hoverable className="dataCard">
            <div className="pieChartTitle">{"รูปแบบข่าว"}</div>
            <Divider />
            <ResponsiveContainer width="100%" height={400}>
              <PieChart className="PieChartContainer">
                <Tooltip />
                <Pie
                  data={chartData2}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={`${Math.min(80, 80) - 1}%`}
                  label
                >
                  {chartData2.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card hoverable className="dataCard">
            <div className="pieChartTitle">{"จังหวัด"}</div>
            <Divider />
            <ResponsiveContainer width="100%" height={400}>
              <PieChart className="PieChartContainer">
                <Tooltip />
                <Pie
                  data={chartData3}
                  cx="50%"
                  cy="50%"
                  outerRadius={`${Math.min(80, 80) - 1}%`}
                  label
                >
                  {chartData3.map((entry, index) => (
                    <Cell fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
      <Divider />
      <Card>
        <Typography variant="h4" gutterBottom>
          ข้อมูลที่แจ้งตั้งแต่ {oldestMonthYear} ถึง {newestMonthYear}{" "}
          (ปัจจุบัน)
        </Typography>
        <br />
        <Descriptions
          bordered
          items={items}
          layout="vertical"
          style={{
            maxWidth: "80%",
            margin: "auto",
          }}
        />
        <br />
        <Divider />
        <div
          className="setcardContent"
          style={{
            maxWidth: "80%",
            margin: "auto",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            style={{
              maxWidth: "80%",
              margin: "auto",
            }}
          >
            แก้ไขรูปหน้าปก
          </Typography>
          <Button
            type="primary"
            className="buttonprofile"
            onClick={() => showModal2()}
          >
            แก้ไข
          </Button>
          <Modal
            title={createTypography("แก้ไขรูปหน้าปก")}
            open={isModalOpen2}
            onCancel={handleCancel2}
            footer={null}
            style={{ fontSize: "25px" }}
          >
            <Form
              form={form}
              layout="vertical"
              name="member_form"
              onFinish={handleAdd}
            >
              <Form.Item
                name="image0"
                label={createTypography("รูปหน้าปก 1")}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: createTypography("กรุณาเพิ่มรูปหน้าปก 1"),
                  },
                ]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                }}
              >
                <Upload
                  name="image0"
                  maxCount={1}
                  listType="picture-card"
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>ขนาดรูป 2 ต่อ 1</div>
                  </div>
                </Upload>
              </Form.Item>
              <>
                {dataimage && dataimage.image0 ? (
                  <Image width={200} src={dataimage.image0} alt="รูปภาพข่าวปลอม" />
                ) : (
                  <div>ไม่มีรูป</div>
                )}
                <Button type="primary" className="form-button" onClick={() => setModalVisible0(true)}>
                  ลบรูป
                </Button>
                <Modal
                  title="Confirm Deletion"
                  visible={modalVisible0}
                  onOk={() => delImg("image0")}
                  onCancel={() => setModalVisible0(false)}
                >
                  <p>ยืนยันการลบรูป</p>
                </Modal>
              </>
              <Divider />
              <Form.Item
                name="image1"
                label={createTypography("รูปหน้าปก 2")}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: createTypography("กรุณาเพิ่มรูปหน้าปก 2"),
                  },
                ]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                }}
              >
                <Upload
                  name="image1"
                  maxCount={1}
                  listType="picture-card"
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>ขนาดรูป 2 ต่อ 1</div>
                  </div>
                </Upload>
              </Form.Item>
              <>
                {dataimage && dataimage.image1 ? (
                  <Image width={200} src={dataimage.image1} alt="รูปภาพข่าวปลอม" />
                ) : (
                  <div>ไม่มีรูป</div>
                )}
                <Button type="primary" className="form-button" onClick={() => setModalVisible1(true)}>
                  ลบรูป
                </Button>
                <Modal
                  title="Confirm Deletion"
                  visible={modalVisible1}
                  onOk={() => delImg("image1")}
                  onCancel={() => setModalVisible1(false)}
                >
                  <p>ยืนยันการลบรูป</p>
                </Modal>
              </>
              <Divider />
              <Form.Item
                name="image2"
                label={createTypography("รูปหน้าปก 3")}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: createTypography("กรุณาเพิ่มรูปหน้าปก 3"),
                  },
                ]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                }}
              >
                <Upload
                  name="image2"
                  maxCount={1}
                  listType="picture-card"
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>ขนาดรูป 2 ต่อ 1</div>
                  </div>
                </Upload>
              </Form.Item>
              <>
                {dataimage && dataimage.image2 ? (
                  <Image width={200} src={dataimage.image2} alt="รูปภาพข่าวปลอม" />
                ) : (
                  <div>ไม่มีรูป</div>
                )}
                <Button type="primary" className="form-button" onClick={() => setModalVisible2(true)}>
                  ลบรูป
                </Button>
                <Modal
                  title="Confirm Deletion"
                  visible={modalVisible2}
                  onOk={() => delImg("image2")}
                  onCancel={() => setModalVisible2(false)}
                >
                  <p>ยืนยันการลบรูป</p>
                </Modal>
              </>
              <Divider />
              <Form.Item
                name="image3"
                label={createTypography("รูปหน้าปก 4")}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: createTypography("กรุณาเพิ่มรูปหน้าปก 4"),
                  },
                ]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                }}
              >
                <Upload
                  name="image3"
                  maxCount={1}
                  listType="picture-card"
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>ขนาดรูป 2 ต่อ 1</div>
                  </div>
                </Upload>
              </Form.Item>
              <>
                {dataimage && dataimage.image3 ? (
                  <Image width={200} src={dataimage.image3} alt="รูปภาพข่าวปลอม" />
                ) : (
                  <div>ไม่มีรูป</div>
                )}
                <Button type="primary" className="form-button" onClick={() => setModalVisible3(true)}>
                  ลบรูป
                </Button>
                <Modal
                  title="Confirm Deletion"
                  visible={modalVisible3}
                  onOk={() => delImg("image3")}
                  onCancel={() => setModalVisible3(false)}
                >
                  <p>ยืนยันการลบรูป</p>
                </Modal>
              </>
              <Divider />
              <Form.Item
                name="image4"
                label={createTypography("รูปหน้าปก 5")}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: createTypography("กรุณาเพิ่มรูปหน้าปก 5"),
                  },
                ]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                }}
              >
                <Upload
                  name="image4"
                  maxCount={1}
                  listType="picture-card"
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>ขนาดรูป 2 ต่อ 1</div>
                  </div>
                </Upload>
              </Form.Item>
              <>
                {dataimage && dataimage.image4 ? (
                  <Image width={200} src={dataimage.image4} alt="รูปภาพข่าวปลอม" />
                ) : (
                  <div>ไม่มีรูป</div>
                )}
                <Button type="primary" className="form-button" onClick={() => setModalVisible4(true)}>
                  ลบรูป
                </Button>
                <Modal
                  title="Confirm Deletion"
                  visible={modalVisible4}
                  onOk={() => delImg("image4")}
                  onCancel={() => setModalVisible4(false)}
                >
                  <p>ยืนยันการลบรูป</p>
                </Modal>
              </>
              <br />
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="form-button"
                >
                  เพิ่ม
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <br />
        <div style={{ textAlign: 'center' }}>
          {dataimage && dataimage.image0 ? (
            <Image width={200} src={dataimage.image0} alt="รูปภาพข่าวปลอม" />
          ) : (
            <div></div>
          )}{" "}
          {dataimage && dataimage.image1 ? (
            <Image width={200} src={dataimage.image1} alt="รูปภาพข่าวปลอม" />
          ) : (
            <div></div>
          )}{" "}
          {dataimage && dataimage.image2 ? (
            <Image width={200} src={dataimage.image2} alt="รูปภาพข่าวปลอม" />
          ) : (
            <div></div>
          )}{" "}
          {dataimage && dataimage.image3 ? (
            <Image width={200} src={dataimage.image3} alt="รูปภาพข่าวปลอม" />
          ) : (
            <div></div>
          )}{" "}
          {dataimage && dataimage.image4 ? (
            <Image width={200} src={dataimage.image4} alt="รูปภาพข่าวปลอม" />
          ) : (
            <div></div>
          )}
        </div>
        <br />
        <Divider />
        <div
          className="setcardContent"
          style={{
            maxWidth: "80%",
            margin: "auto",
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            style={{
              maxWidth: "80%",
              margin: "auto",
            }}
          >
            ข้อมูล Admin
          </Typography>
          {user && user.id && (
            <Link to={`/M_DB_Adm_Edit/${user.id}`}>
              <Button type="primary" className="buttonprofile">
                แก้ไข
              </Button>
            </Link>
          )}
        </div>
        <Divider />
        <Descriptions
          style={{
            maxWidth: "80%",
            margin: "auto",
          }}
          bordered
          layout="vertical"
          items={items2}
        />
        <Divider />
        <Button
          style={{
            maxWidth: "80%",
            margin: "auto",
          }}
          type="primary"
          onClick={showModal}
          className="form-button"
        >
          {createTypography("ออกจากระบบ")}
        </Button>
        <Modal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="ยืนยัน"
          cancelText="ยกเลิก"
        >
          <div>{createTypography("ต้องการออกจากระบบ")}</div>
        </Modal>
      </Card>
    </AdminMenu>
  );
};

export default M_DB_Adm_Menu;
