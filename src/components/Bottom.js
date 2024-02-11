import React from "react";
import { Layout, Space } from "antd";
import CASLogo from "./Images/CAS.png";
import WMOLogo from "./Images/WMO.png";
import { Grid } from "@mui/material";
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";
const { Footer } = Layout;

const Bottom = () => {
  return (
    <Footer className="footer">
      <br/>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <img
            src="https://www.commsci.psu.ac.th/wp-content/uploads/2023/09/logo-web-V2.0.svg"
            alt="WMO Logo"
            className="commsci-image"
          />
          <div className="text">
            สร้างสรรค์โดย โครงการวิจัย เรื่อง
            การศึกษาและสร้างสรรค์สื่อเพื่อเฝ้าระวังข้อมูลผิดพลาดสำหรับเครือข่ายผู้บริโภคภาคใต้
          </div>
          <div className="text">
            (The Study and Media Creation to Misinformation Surveillance for
            Southern Consumer Network)
          </div>
          <div className="text">
            ภายใต้การสนับสนุนของกองทุนวิจัย คณะวิทยาการสื่อสาร
            มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตปัตตานี
          </div>
          <div>
            <Space align="center">
              <span>
                <img src={WMOLogo} alt="WMO Logo" className="partner-image" />
                <div
                  className="text"
                  style={{ textAlign: "left", marginTop: "auto" }}
                >
                  <strong
                    style={{
                      color: "#208b99",
                    }}
                  >
                    เครือข่ายเฝ้าระวังสื่อออนไลน์ภาคใต้{' '}
                  </strong>
                </div>
              </span>
              <span>
                <img src={CASLogo} alt="CAS Logo" className="partner-image" />
                <div
                  className="text"
                  style={{ textAlign: "left", marginTop: "auto" }}
                >
                  <strong
                    style={{
                      color: "#208b99",
                    }}
                  >
                    สมาคมผู้บริโภคสงขลา
                  </strong>
                </div>
              </span>
            </Space>
          </div>
        </Grid>
        <Grid item xs={12} md={3}>
          <div
            className="text"
            style={{ textAlign: "left", marginTop: "auto" }}
          >
            <br />
            <strong
              style={{
                color: "#208b99",
              }}
            >
              ติดต่อโครงการวิจัย
            </strong>{" "}
            <br />
            คณะวิทยาการสื่อสาร มหาวิทยาลัยสงขลานครินทร์ <br />
            วิทยาเขตปัตตานี อำเภอเมือง จังหวัดปัตตานี 94000 <br />
            <PhoneOutlined /> โทร. 073 349 692 <br />
            <MailOutlined /> Email: checkkonproject@gmail.com
          </div>
        </Grid>
      </Grid>
    </Footer>
  );
};

export default Bottom;
