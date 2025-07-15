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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import image from "../assets/image/company_name.png"
import HomeIcon from '@mui/icons-material/Home';

export default function PersistentLeftDrawer() {
  const anchor: 'left' = 'left';

  const list = (
    <>
    <Box
      sx={{ height: "100%", background: "linear-gradient(to bottom, #003366, #8b0000)" }}
      role="presentation"
    >
      <img src={image} alt=""  width="150" style={{padding:"30px"}} />
      <List>
        {[ 'Home','Application','Forms','Report','Categories','Users','Roles & Access','File Manager','Web Portal','Settings','Logout'].map((text, index) => (
          <ListItem key={text} disablePadding style={{color:"white"}}>
            <ListItemButton>
              <ListItemIcon style={{color:"white"}}>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                <HomeIcon/>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding style={{color:"white"}}>
            <ListItemButton>
              <ListItemIcon style={{color:"white"}}>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box></>
  );

  return (
    <Drawer anchor={anchor} open={true} variant="persistent">
      {list}
    </Drawer>
  );
}
