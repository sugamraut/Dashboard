import { Drawer, IconButton, List, ListItem, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PublicIcon from "@mui/icons-material/Public";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArticleIcon from "@mui/icons-material/Article";

import companyLogo from "../assets/image/company_name.png";

const sidebarIcons = [
  { icon: <HomeIcon />, label: "Dashboard", path: "/admin/dashboard" },
  { icon: <FolderIcon />, label: "Online Account", path: "/online-account" },
  { icon: <TextSnippetIcon />, label: "Account Type", path: "/account-type" },
  { icon: <AccountTreeIcon />, label: "Branches", path: "/admin/branch" },
  { icon: <ArticleIcon />, label: "District", path: "/admin/district" },
  { icon: <ApartmentIcon />, label: "Citites", path: "/admin/cities" },
  { icon: <PeopleIcon />, label: "Users", path: "/users" },
  {
    icon: <AdminPanelSettingsIcon />,
    label: "Roles & Access",
    path: "/roles-access",
  },
  { icon: <FolderOpenIcon />, label: "File Manager", path: "/file-manager" },
  { icon: <PublicIcon />, label: "Web Portal", path: "/web-portal" },
  { icon: <SettingsIcon />, label: "Settings", path: "/settings" },
  { icon: <LogoutIcon />, label: "Logout", path: "/admin/logout" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 70,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 80,
          boxSizing: "border-box",
          background: "linear-gradient(to bottom, #002b5c, #8b0000)",
          color: "white",
          display: "flex",
          alignItems: "center",
          pt: 2,
        },
      }}
    >
      <img src={companyLogo} alt="Logo" width="50" />
      <List sx={{ mt: 2 }}>
        {sidebarIcons.map(({ icon, label, path }, index) => {
          const isActive = location.pathname === path;
          return (
            <Tooltip title={label} placement="right" arrow key={index}>
              <ListItem
                disablePadding
                sx={{ mt: 1 }}
              >
                <Link to={path}>
                  <IconButton
                    sx={{
                      color: isActive ? "#877d43ff" : "white",
                      backgroundColor: isActive
                        ? "rgba(255, 255, 255, 0.15)"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    {icon}
                  </IconButton>
                </Link>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>
    </Drawer>
  );
}
