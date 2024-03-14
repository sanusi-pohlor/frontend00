import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuNavbar from "./components/Menu_Navbar";
import Bottom from "./components/Bottom";
import Dashboard from "./components/Dashboard_Components/Dashboard";

import FakenewsSearch from "./components/FakenewsSearch_Components/FakenewsSearch_Menu";
import FakenewsSearchview from "./components/FakenewsSearch_Components/FakenewsSearch_View";

import News from "./components/News_Components/News_Menu";
import Newsview from "./components/News_Components/News_view";

import Article from "./components/Article_Components/Article_Menu";
import Articleview from "./components/Article_Components/Article_view";

import MediaShare from "./components/MediaShare_Components/MdShare_Menu";
import MediaShareview from "./components/MediaShare_Components/MdShare_view";

import FakeNewInformation from "./components/Fninfo_Components/Fninfo_Form";

import NotificationHistory from "./components/Fninfo_Components/Fninfo_History";

import ManageInfo from "./components/Admin/Manage_Info/Adm_Info_Menu";
import ManageInfoview from "./components/Admin/Manage_Info/Adm_Info_View";
import AdmInfoCheck from "./components/Admin/Manage_Info/Adm_Info_Check";

import ManageFakeInfoMenu from "./components/Admin/Manage_Fake_Info/Manage_Fake_Info_Menu";
import ManageFakeInfoView from "./components/Admin/Manage_Fake_Info/Manage_Fake_Info_View";
import ManageFakeInfoEdit from "./components/Admin/Manage_Fake_Info/Manage_Fake_Info_Edit";

import ManageMembers from "./components/Admin/Manage_Members/Adm_Mm_Menu";
import ManageMembersView from "./components/Admin/Manage_Members/Adm_Mm_View";

import AdmNewsView from "./components/Admin/ManageContent/Adm_News/Adm_News_view";
import AdmArticleView from "./components/Admin/ManageContent/Adm_Article/Adm_Article_View";
import AdmMdShareView from "./components/Admin/ManageContent/Adm_MdShare/Adm_MdShare_View";

import AdmNewsMenu from "./components/Admin/ManageContent/Adm_News/Adm_News_Menu";
import AdmArticleMenu from "./components/Admin/ManageContent/Adm_Article/Adm_Article_Menu";
import AdmMdShareMenu from "./components/Admin/ManageContent/Adm_MdShare/Adm_MdShare_Menu";

import AdmNewsedit from "./components/Admin/ManageContent/Adm_News/Adm_News_Edit";
import AdmArticleedit from "./components/Admin/ManageContent/Adm_Article/Adm_Article_Edit";
import AdmMdShareedit from "./components/Admin/ManageContent/Adm_MdShare/Adm_MdShare_Edit";

import AdmArticleForm from "./components/Admin/ManageContent/Adm_Article/Adm_Article_Form";
import AdmMdShareForm from "./components/Admin/ManageContent/Adm_MdShare/Adm_MdShare_Form";
import AdmNewsForm from "./components/Admin/ManageContent/Adm_News/Adm_News_Form";

import ManageValues from "./components/Admin/Manage_Values/MV_Routes";

import MenuProfile from "./components/User_Comoponents/Profile_Menu";

import Profile from "./components/User_Comoponents/Profile_View";
import ProfileEdit from "./components/User_Comoponents/Profile_Edit";

import Fninfoview from "./components/Fninfo_Components/Fninfo_View";
import Fninfoedit from "./components/Fninfo_Components/Fninfo_Edit";
import Warn from "./components/Fninfo_Components/Warn";

import MDBAdmMenu from "./components/Admin/Manage_Dashboard_Adm/M_DB_Adm_Menu";
import MDBAdmEdit from "./components/Admin/Manage_Dashboard_Adm/M_DB_Adm_Edit";

import AboutUsView from "./components/About_Us/About_Us_View";

import { Box } from "@mui/material";

const routes = [
  { path: "/", element: <Dashboard /> },

  {
    path: "/FakenewsSearch/FakenewsSearch_view/:id",
    element: <FakenewsSearchview />,
  },
  { path: "/FakenewsSearch", element: <FakenewsSearch /> },

  { path: "/Article_Menu/Article_view/:id", element: <Articleview /> },
  { path: "/Article_Menu", element: <Article /> },

  {
    path: "/MediaShare_Menu/MediaShare_view/:id",
    element: <MediaShareview />,
  },
  { path: "/MediaShare_Menu", element: <MediaShare /> },

  { path: "/News_Menu/News_view/:id", element: <Newsview /> },
  { path: "/News_Menu", element: <News /> },

  { path: "/FakeNews_Menu", element: <FakeNewInformation /> },
  { path: "/FakeNews/NotificationHistory", element: <NotificationHistory /> },
  { path: "/FakeNews/fninfoview/:id", element: <Fninfoview /> },
  { path: "/FakeNews/edit/:id", element: <Fninfoedit /> },
  { path: "/Warn", element: <Warn /> },

  { path: "/About_Us_View", element: <AboutUsView /> },

  { path: "/Admin", element: <MDBAdmMenu /> },
  { path: "/M_DB_Adm_Edit/:id", element: <MDBAdmEdit /> },

  { path: "/Admin/ManageInfo", element: <ManageInfo /> },

  { path: "/Admin/Manage_Fake_Info_Menu", element: <ManageFakeInfoMenu /> },
  {
    path: "/Admin/Manage_Fake_Info_View/:id",
    element: <ManageFakeInfoView />,
  },
  {
    path: "/Admin/Manage_Fake_Info_Edit/:id",
    element: <ManageFakeInfoEdit />,
  },

  {
    path: "/Admin/ManageInfo/ManageInfo_view/:id",
    element: <ManageInfoview />,
  },
  {
    path: "/Admin/ManageInfo/ManageInfo_view/:id/Adm_Info_Check",
    element: <AdmInfoCheck />,
  },
  { path: "/Admin/ManageMembers", element: <ManageMembers /> },
  {
    path: "/Admin/ManageMembers/ManageMembers_View/:id",
    element: <ManageMembersView />,
  },


  { path: "/Admin/Adm_News_Menu", element: <AdmNewsMenu /> },
  { path: "/Admin/Adm_Article_Menu", element: <AdmArticleMenu /> },
  { path: "/Admin/Adm_MdShare_Menu", element: <AdmMdShareMenu /> },

  { path: "/Admin/Adm_News_edit/:id", element: <AdmNewsedit /> },
  { path: "/Admin/Adm_Article_edit/:id", element: <AdmArticleedit /> },
  { path: "/Admin/Adm_MdShare_edit/:id", element: <AdmMdShareedit /> },

  { path: "/Admin/Adm_News_View/:id", element: <AdmNewsView /> },
  { path: "/Admin/Adm_Article_View/:id", element: <AdmArticleView /> },
  { path: "/Admin/Adm_MdShare_View/:id", element: <AdmMdShareView /> },
  { path: "/Admin/Adm_Article_Form", element: <AdmArticleForm /> },
  { path: "/Admin/Adm_MdShare_Form", element: <AdmMdShareForm /> },
  { path: "/Admin/Adm_News_Form", element: <AdmNewsForm /> },
  { path: "/Admin/ManageValues", element: <ManageValues /> },

  { path: "/User/MenuProfile", element: <MenuProfile /> },
  { path: "/User/Profile", element: <Profile /> },
  { path: "/User/Profile/Edit/:id", element: <ProfileEdit /> },
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
