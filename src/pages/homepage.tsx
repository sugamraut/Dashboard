import { Drawer, IconButton, List, ListItem, Tooltip } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PublicIcon from "@mui/icons-material/Public";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import companyLogo from "../assets/image/company_name.png";

const drawerWidth = 100;
const sidebarIcons = [
  { icon: <HomeIcon />, label: "Dashboard" },
  { icon: <FolderIcon />, label: "online Acoount" },
  { icon: <TextSnippetIcon />, label: "Account Type " },
  { icon: <SummarizeIcon />, label: "Branches" },
  { icon: <CategoryIcon />, label: "Categories" },
  { icon: <PeopleIcon />, label: "Users" },
  { icon: <AdminPanelSettingsIcon />, label: "Roles & Access" },
  { icon: <FolderOpenIcon />, label: "File Manager" },
  { icon: <PublicIcon />, label: "Web Portal" },
  { icon: <SettingsIcon />, label: "Settings" },
  { icon: <LogoutIcon />, label: "Logout" },
];

export default function Sidebar() {
  return (
    
    <Drawer
      variant="permanent"
      sx={{
        width: 55,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 70,
          boxSizing: "border-box",
          background: "linear-gradient(to bottom, #002b5c, #8b0000)",
          color: "white",
          display: "flex",
          alignItems: "center",
          pt: 2,
        },
      }}
    >
      <img src={companyLogo} alt="Logo" width="40" />
      <List sx={{ mt: 2 }} className="mt-5">
        {sidebarIcons.map(({ icon, label }, index) => (
          <Tooltip title={label} placement="right" arrow key={index}>
            <ListItem disablePadding className="mt-5 ">
              <IconButton sx={{ color: "white" }}>{icon}</IconButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}
