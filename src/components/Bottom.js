import React from "react";
import { Layout , Space } from "antd";
import CASLogo from "./Images/CAS.png";
import WMOLogo from "./Images/WMO.png";
import "./Bottom.css";
const { Footer } = Layout;

const Bottom = () => {
  const footerClass = "footer";
  const textClass = "text";
  const imageClass = "image";
  const image1Class = "image-1";

  return (
    <Footer className={footerClass}>
      <img
        src="https://www.commsci.psu.ac.th/wp-content/uploads/2023/09/logo-web-V2.0.svg"
        alt="WMO Logo"
        className={image1Class}
      />
      <div className={textClass}>
        สร้างสรรค์โดย โครงการวิจัย เรื่อง
        การศึกษาและสร้างสรรค์สื่อเพื่อเฝ้าระวังข้อมูลผิดพลาดสำหรับเครือข่ายผู้บริโภคภาคใต้
      </div>
      <div className={textClass}>
        (The Study and Media Creation to Misinformation Surveillance for
        Southern Consumer Network)
      </div>
      <div className={textClass}>
        ภายใต้การสนับสนุนของกองทุนวิจัย คณะวิทยาการสื่อสาร
        มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตปัตตานี
      </div>
      <div>
        <Space align="center">
          <span>
            <img src={WMOLogo} alt="WMO Logo" className={imageClass}/>
            <div className={textClass}>
              เครือข่ายเฝ้าระวังสื่อออนไลน์ภาคใต้
            </div>
          </span>
          <span>
            <img src={CASLogo} alt="CAS Logo" className={imageClass}/>
            <div className={textClass}>สมาคมผู้บริโภคสงขลา</div>
          </span>
        </Space>
      </div>
    </Footer>
  );
};

export default Bottom;
