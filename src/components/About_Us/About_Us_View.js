import React from "react";
import { Paper, Typography } from "@mui/material";
import { Card } from "antd";

const About_Us_View = () => {

  const createTypography = (label, text, fontSize = "25px") => (
    <Typography variant="body1" sx={{ fontSize }}>{label}: {text}</Typography>
  );
  return (
    <div className="backgroundColor">
      <Paper
        elevation={0}
        className="paperContainer"
        style={{ backgroundColor: "#e4e4e4" }}
      >
        <Card className="cardsection">
          <div
            className="cardsectionContent"
          >
            เกี่ยวกับเรา
          </div>
        </Card>
        <br />
        <Card
          className="cardContent"
        >
          {createTypography("เว็บไซต์ Checkkonproject.com เป็นส่วนหนึ่งของโครงการวิจัย เรื่อง การศึกษาและสร้างสรรค์สื่อเพื่อเฝ้าระวังข้อมูลผิดพลาดสำหรับเครือข่ายผู้บริโภคภาคใต้ โดยมีวัตถุประสงค์เพื่อเป็นส่วนหนึ่งของการเฝ้าระวังและให้ความรู้เกี่ยวกับข้อมูลเท็จในจังหวัดภาคใต้ เป็นความร่วมมือระหว่างนักวิชาการสาขานิเทศศาสตร์และสาขาวิชาคอมพิวเตอร์และวิทยาการสารสนเทศเพื่อการจัดการ คณะวิทยาการสื่อสาร โครงการวิจัยนี้ได้รับการสนับสนุนงบประมาณจากกองทุนวิจัย คณะวิทยาการสื่อสาร มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตปัตตานี Checkkonproject.com is the website for the Study and Media Creation to Misinformation Surveillance for Southern Consumer Network, which was established to educate and monitor misinformation in southern Thailand. This project is a collaboration between Communication Arts and Computer and Informatics for Management researchers at the Faculty of Communication Sciences. The Research Fund of the Faculty of Communication Sciences at Prince of Songkla University is supporting this study.")}
        </Card>
      </Paper>
    </div>
  );
};

export default About_Us_View;
