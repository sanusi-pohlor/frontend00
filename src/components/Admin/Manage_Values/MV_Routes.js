import React from 'react';
import { Collapse } from 'antd';
import MC_VolunteeMembers from './MC_VolunteeMembers';
import MC_Users from './MC_Users';
import MC_TypeInformation from './MC_TypeInformation';
import MC_Subpoint from './MC_Subpoint';
import MC_Publisher from './MC_Publisher';
import MC_ProblemManagement from './MC_ProblemManagement';
import MC_News from './MC_News';
import MC_Motivation from './MC_Motivation';
import MC_MediaChannels from './MC_MediaChannels';
import MC_InspectionDetails from './MC_InspectionDetails';
import MC_Information from './MC_Information';
import MC_FormatData from './MC_FormatData';
import MC_DetailsNotiChannels from './MC_DetailsNotiChannels';
import MC_DataCharacteristics from './MC_DataCharacteristics';
import MC_CheckingData from './MC_CheckingData';
import MC_ActionType from './MC_ActionType';
import AdminMenu from "../Adm_Menu";

const items = [
  {
    key: '1',
    label: 'ประเภทเนื้อหาข้อมูลเท็จ',
    children: <MC_TypeInformation/>,
  },
  {
    key: '2',
    label: 'ประเด็นย่อย',
    children: <MC_Subpoint/>,
  },
  {
    key: '3',
    label: 'แรงจูงใจ',
    children: <MC_Motivation/>,
  },
  {
    key: '4',
    label: 'ลักษณะข้อมูล',
    children: <MC_DataCharacteristics/>,
  },
  {
    key: '5',
    label: 'ประเภทการกระทำ',
    children: <MC_ActionType/>,
  },
  {
    key: '6',
    label: 'ช่องทางสื่อ',
    children: <MC_MediaChannels/>,
  },
  {
    key: '7',
    label: 'การตรวจสอบ',
    children: <MC_CheckingData/>,
  },
  {
    key: '8',
    label: 'การจัดการปัญหา',
    children: <MC_ProblemManagement/>,
  },
  {
    key: '9',
    label: 'รูปแบบของข้อมูล',
    children: <MC_FormatData/>,
  },
  {
    key: '10',
    label: 'ผู้เผยแพร่',
    children: <MC_Publisher/>,
  },
  {
    key: '11',
    label: 'รายละเอียดช่องทางการแจ้ง',
    children: <MC_DetailsNotiChannels/>,
  },
  {
    key: '12',
    label: 'การแจ้งข้อมูลที่เป็นเท็จ',
    children: <MC_Information/>,
  },
  {
    key: '13',
    label: 'สมาชิกอาสา',
    children: <MC_VolunteeMembers/>,
  },
];
const ManageValues = () =><AdminMenu><Collapse accordion items={items} /></AdminMenu>;

export default ManageValues;
