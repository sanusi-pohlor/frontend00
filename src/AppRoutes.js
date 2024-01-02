import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuNavbar from "./components/Menu_Navbar";
import Bottom from "./components/Bottom";
import Dashboard from "./components/Dashboard_Components/Dashboard";

import News from "./components/News_Components/News_Menu";
import News_views from "./components/News_Components/News_views";

import Article from "./components/Article_Components/Article_Menu";
import Article_view from "./components/Article_Components/Article_view";

import MediaShare from "./components/MediaShare_Components/MdShare_Menu";
import MediaShare_view from "./components/MediaShare_Components/MdShare_view";

import FakeNewInformation from "./components/Fninfo_Components/Fninfo_Form";

import NotificationHistory from "./components/Fninfo_Components/Fninfo_History";

import ManageInfo from "./components/Admin/Manage_Info/Adm_Info_Menu";
import ManageInfo_view from "./components/Admin/Manage_Info/Adm_Info_View";
import Adm_Info_Check from "./components/Admin/Manage_Info/Adm_Info_Check";

import Manage_Fake_Info_Menu from "./components/Admin/Manage_Fake_Info/Manage_Fake_Info_Menu";
import Manage_Fake_Info_View from "./components/Admin/Manage_Fake_Info/Manage_Fake_Info_View";

import ManageMembers from "./components/Admin/Manage_Members/Adm_Mm_Menu";

import Adm_Dashboard_View from "./components/Admin/ManageContent/Adm_Dashboard/Adm_Dashboard_View";
import Adm_News_View from "./components/Admin/ManageContent/Adm_News/Adm_News_view";
import Adm_Article_View from "./components/Admin/ManageContent/Adm_Article/Adm_Article_View";
import Adm_MdShare_View from "./components/Admin/ManageContent/Adm_MdShare/Adm_MdShare_View";

import Adm_Dashboard_Menu from "./components/Admin/ManageContent/Adm_Dashboard/Adm_Dashboard_Menu";
import Adm_News_Menu from "./components/Admin/ManageContent/Adm_News/Adm_News_Menu";
import Adm_Article_Menu from "./components/Admin/ManageContent/Adm_Article/Adm_Article_Menu";
import Adm_MdShare_Menu from "./components/Admin/ManageContent/Adm_MdShare/Adm_MdShare_Menu";

import Adm_Dashboard_Form from "./components/Admin/ManageContent/Adm_Dashboard/Adm_Dashboard_Form";
import Adm_Article_Form from "./components/Admin/ManageContent/Adm_Article/Adm_Article_Form";
import Adm_MdShare_Form from "./components/Admin/ManageContent/Adm_MdShare/Adm_MdShare_Form";
import Adm_News_Form from "./components/Admin/ManageContent/Adm_News/Adm_News_Form";

import ManageValues from "./components/Admin/Manage_Values/MV_Routes";

import AdvancedSearch from "./components/Admin/Adm_Adv_Search";

import MChecking from "./components/Admin/ManageFakeNews/MChecking";
import MInformation from "./components/Admin/ManageFakeNews/MInformation";
import MMedia from "./components/Admin/ManageFakeNews/MMedia";
import MProblem from "./components/Admin/ManageFakeNews/MProblem";
import MType from "./components/Admin/ManageFakeNews/MType";

import MenuProfile from "./components/User_Comoponents/Profile_Menu";

import Profile from "./components/User_Comoponents/Profile_View";

import Fninfoview from "./components/Fninfo_Components/Fninfo_View";
import Fninfoedit from "./components/Fninfo_Components/Fninfo_Edit";

import M_DB_Adm_Menu from "./components/Admin/Manage_Dashboard_Adm/M_DB_Adm_Menu";

import About_Us_View from "./components/About_Us/About_Us_View";

import { Box } from "@mui/material";

const routes = [
  { path: "/", element: <Dashboard /> },

  { path: "/Article/Article_view/:id", element: <Article_view /> },
  { path: "/Article_Menu", element: <Article /> },

  { path: "/MediaShare_view/:id", element: <MediaShare_view /> },
  { path: "/MediaShare_Menu", element: <MediaShare /> },

  { path: "/News/News_views/:id", element: <News_views /> },
  { path: "/News_Menu", element: <News /> },

  { path: "/FakeNews_Menu", element: <FakeNewInformation /> },
  { path: "/FakeNews/NotificationHistory", element: <NotificationHistory /> },
  { path: "/FakeNews/fninfoview/:id", element: <Fninfoview /> },
  { path: "/FakeNews/edit/:id", element: <Fninfoedit /> },

  { path: "/About_Us_View", element: <About_Us_View /> },

  { path: "/Admin", element: <M_DB_Adm_Menu /> },

  { path: "/Admin/ManageInfo", element: <ManageInfo /> },

  { path: "/Admin/Manage_Fake_Info_Menu", element: <Manage_Fake_Info_Menu /> },
  { path: "/Admin/Manage_Fake_Info_View/:id", element: <Manage_Fake_Info_View /> },
  {
    path: "/Admin/ManageInfo/ManageInfo_view/:id", element: <ManageInfo_view />,
  },
  {
    path: "/Admin/ManageInfo/ManageInfo_view/:id/Adm_Info_Check", element: <Adm_Info_Check />,
  },
  { path: "/Admin/ManageMembers", element: <ManageMembers /> },
  { path: "/Admin/Adm_Dashboard_View", element: <Adm_Dashboard_View /> },
  
  { path: "/Admin/Adm_Dashboard_Menu", element: <Adm_Dashboard_Menu /> },
  { path: "/Admin/Adm_News_Menu", element: <Adm_News_Menu /> },
  { path: "/Admin/Adm_Article_Menu", element: <Adm_Article_Menu /> },
  { path: "/Admin/Adm_MdShare_Menu", element: <Adm_MdShare_Menu /> },

  { path: "/Admin/Adm_News_View/:id", element: <Adm_News_View /> },
  { path: "/Admin/Adm_Article_View", element: <Adm_Article_View /> },
  { path: "/Admin/Adm_MdShare_View", element: <Adm_MdShare_View /> },
  { path: "/Admin/Adm_Dashboard_Form", element: <Adm_Dashboard_Form /> },
  { path: "/Admin/Adm_Article_Form", element: <Adm_Article_Form /> },
  { path: "/Admin/Adm_MdShare_Form", element: <Adm_MdShare_Form /> },
  { path: "/Admin/Adm_News_Form", element: <Adm_News_Form /> },
  { path: "/Admin/ManageValues", element: <ManageValues /> },
  { path: "/Admin/AdvancedSearch", element: <AdvancedSearch /> },
  { path: "/Admin/MChecking", element: <MChecking /> },
  { path: "/Admin/MInformation", element: <MInformation /> },
  { path: "/Admin/MMedia", element: <MMedia /> },
  { path: "/Admin/MProblem", element: <MProblem /> },
  { path: "/Admin/MType", element: <MType /> },

  { path: "/User/MenuProfile", element: <MenuProfile /> },
  { path: "/User/Profile", element: <Profile /> },
];

const AppRoutes = () => {
  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <MenuNavbar />
        <div style={{ flex: 1 }}>
          <Box height="10vh" />
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} {...route} />
            ))}
          </Routes>
        </div>
        <Bottom />
      </div>
    </Router>
  );
};

export default AppRoutes;
