import React from 'react';
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import image from "../assets/image/company_name.png";
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PublicIcon from '@mui/icons-material/Public';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpIcon from '@mui/icons-material/Help';

export default function PersistentLeftDrawer() {
  const anchor: 'left' = 'left';

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon /> },
    { text: 'Applications', icon: <FolderIcon /> },
    { text: 'Forms', icon: <TextSnippetIcon /> },
    { text: 'Reports', icon: <SummarizeIcon /> },
    { text: 'Categories', icon: <CategoryIcon /> },
    { text: 'Users', icon: <PeopleIcon /> },
    { text: 'Roles & Access', icon: <AdminPanelSettingsIcon /> },
    { text: 'File Manager', icon: <FolderOpenIcon /> },
    { text: 'Web Portal', icon: <PublicIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> },
  ];

  const bottomItems = [
    { text: 'Logout', icon: <LogoutIcon /> },
    { text: 'Help', icon: <HelpIcon /> },
  ];

  const list = (
    <Box
      sx={{
        width: 250,
        height: '100%',
        background: 'linear-gradient(to bottom, #003366, #8b0000)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Box sx={{ textAlign: 'center', p: 3, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <img src={image} alt="Sunlife Logo" width="120" />
        </Box>

        <List>
          {menuItems.map(({ text, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <List>
          {bottomItems.map(({ text, icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer anchor={anchor} open={true} variant="persistent">
      {list}
    </Drawer>
  );
}
