import {
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArticleIcon from "@mui/icons-material/Article";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SettingsIcon from "@mui/icons-material/Settings";

import companyLogo from "../assets/image/company_name.png";
import React from "react";

const sidebarIcons = [
  { icon: <HomeIcon />, label: "Dashboard", path: "/admin/dashboard" },
  {
    icon: <FolderIcon />,
    label: "Online Account",
    path: "/admin/onlineaccount",
  },
  { icon: <TextSnippetIcon />, label: "Account Type", path: "/admin/Account" },
  { icon: <AccountTreeIcon />, label: "Branches", path: "/admin/branch" },
  { icon: <ArticleIcon />, label: "District", path: "/admin/district" },
  { icon: <ApartmentIcon />, label: "Citites", path: "/admin/cities" },
  { icon: <PeopleIcon />, label: "Users", path: "/admin/User" },
  {
    icon: <AdminPanelSettingsIcon />,
    label: "Roles & Access",
    path: "/admin/role",
  },
  {
    icon: <FolderSharedIcon />,
    label: "Permissions",
    path: "/admin/permission",
  },
  {
    icon: <AutorenewIcon />,
    label: "Activity log",
    path: "/admin/activitylog",
  },
  {
    icon: <QrCodeScannerIcon />,
    label: "Scanned Log",
    path: "/admin/scannedlog",
  },
  { icon: <SettingsIcon />, label: "Setting", path: "/admin/setting" },
  { icon: <AccountCircleIcon />, label: "Profile", path: "/admin/profile" },
  { icon: <LogoutIcon />, label: "Logout", path: "/admin/logout" },
];

export default function Sidebar() {
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Drawer variant="permanent" className="sidebar-drawer">
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img src={companyLogo} alt="Logo" width="58" className="rounded-1" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <Link to={"/admin/profile"} className="nav-link">
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link>
        <Link to={"/admin/logout"} className="nav-link">
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Link>
      </Menu>

      <List sx={{ mt: 1 }}>
        {sidebarIcons.map(({ icon, label, path }, index) => {
          const isActive = location.pathname === path;
          return (
            <Tooltip title={label} placement="right" arrow key={index}>
              <ListItem disablePadding sx={{ mt: 1 }}>
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
