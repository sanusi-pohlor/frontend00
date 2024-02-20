import React from "react";
import { Collapse } from "antd";
import MCTypeInformation from "./MC_TypeInformation";
import MCSubpoint from "./MC_Subpoint";
import MCProblemManagement from "./MC_ProblemManagement";
import MCMotivation from "./MC_Motivation";
import MCMediaChannels from "./MC_MediaChannels";
import MCFormatData from "./MC_FormatData";
import MCDetailsNotiChannels from "./MC_DetailsNotiChannels";
import MCDataCharacteristics from "./MC_DataCharacteristics";
import MCCheckingData from "./MC_CheckingData";
import MCActionType from "./MC_ActionType";
import MCAbout from "./MC_About";
import AdminMenu from "../Adm_Menu";
import { Card } from "antd";

const items = [
  {
    key: "1",
    label: "ประเภทเนื้อหาข้อมูลเท็จ",
    children: <MCTypeInformation />,
  },
  {
    key: "2",
    label: "ประเด็นย่อย",
    children: <MCSubpoint />,
  },
  {
    key: "3",
    label: "แรงจูงใจ",
    children: <MCMotivation />,
  },
  {
    key: "4",
    label: "ลักษณะข้อมูล",
    children: <MCDataCharacteristics />,
  },
  {
    key: "5",
    label: "ประเภทการกระทำ",
    children: <MCActionType />,
  },
  {
    key: "6",
    label: "ช่องทางสื่อ",
    children: <MCMediaChannels />,
  },
  {
    key: "7",
    label: "การตรวจสอบ",
    children: <MCCheckingData />,
  },
  {
    key: "8",
    label: "การจัดการปัญหา",
    children: <MCProblemManagement />,
  },
  {
    key: "9",
    label: "รูปแบบของข้อมูล",
    children: <MCFormatData />,
  },
  {
    key: "10",
    label: "ขอบเขตการเผยแพร่",
    children: <MCDetailsNotiChannels />,
  },
  {
    key: "11",
    label: "เกี่บวกับ",
    children: <MCAbout />,
  },
];
const ManageValues = () => (
  <AdminMenu>
    {" "}
    <Card className="cardsection">
      <div className="cardsectionContent">จัดการค่า</div>
    </Card>
    <br />
    <Card>
      <Collapse accordion items={items} />
    </Card>
  </AdminMenu>
);

export default ManageValues;
