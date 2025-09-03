import {
  Drawer,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Tooltip,
  Button,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  Folder as FolderIcon,
  TextSnippet as TextSnippetIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Logout as LogoutIcon,
  Apartment as ApartmentIcon,
  AccountTree as AccountTreeIcon,
  Article as ArticleIcon,
  FolderShared as FolderSharedIcon,
  QrCodeScanner as QrCodeScannerIcon,
  AccountCircle as AccountCircleIcon,
  Autorenew as AutorenewIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { resetAuth } from "../store/auth/LoginSlice";
import { toast } from "react-toastify";

import companyLogo from "../assets/image/company_name.png";
import React from "react";
import { useAppDispatch } from "../store/hook";

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
  { icon: <ApartmentIcon />, label: "Cities", path: "/admin/cities" },
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
    label: "Activity Log",
    path: "/admin/activitylog",
  },
  {
    icon: <QrCodeScannerIcon />,
    label: "Scanned Log",
    path: "/admin/scannedlog",
  },
  { icon: <SettingsIcon />, label: "Setting", path: "/admin/setting" },
  { icon: <AccountCircleIcon />, label: "Profile", path: "/admin/profile" },
  { icon: <LogoutIcon />, label: "Logout" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt");
    dispatch(resetAuth());
    toast.success("Successfully logged out");
    navigate("/admin", { replace: true });
  };

  return (
    <Drawer variant="permanent" className="sidebar-drawer">
      <Button
        id="profile-menu-button"
        aria-controls={open ? "profile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img src={companyLogo} alt="Logo" width="58" className="rounded-1" />
      </Button>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "profile-menu-button",
          },
        }}
      >
        <Link to={"/admin/profile"} className="nav-link">
          <MenuItem onClick={handleClose}>Profile</MenuItem>
        </Link>
        <MenuItem
          onClick={() => {
            handleClose();
            handleLogout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>

      <List sx={{ mt: 1 }}>
        {sidebarIcons
          .filter(({ label }) => typeof label === "string")
          .map(({ icon, label, path }, index) => {
            const isActive = location.pathname === path;

            return (
              <Tooltip title={label} placement="right" arrow key={index}>
                <ListItem disablePadding sx={{ mt: 1 }}>
                  <Link
                    to={path as string}
                    onClick={label === "Logout" ? handleLogout : undefined}
                  >
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
