import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";

import StorageIcon from "@mui/icons-material/Storage";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import Sidebar from "../sliderpage";

const cardItems = [
  {
    title: "TOTAL",
    count: 7,
    trend: 1,
    icon: <StorageIcon />,
    iconBg: "#0a58ca",
    trendColor: "#0a58ca",
  },
  {
    title: "PENDING",
    count: 7,
    trend: 1,
    icon: <VisibilityOffIcon />,
    iconBg: "#6c757d",
    trendColor: "#6c757d",
  },
  {
    title: "PROCESSING",
    count: 0,
    trend: 0,
    icon: <AccessTimeIcon />,
    iconBg: "#0d6efd",
    trendColor: "#0d6efd",
  },
  {
    title: "APPROVED",
    count: 0,
    trend: 0,
    icon: <CheckCircleIcon />,
    iconBg: "#198754",
    trendColor: "#198754",
  },
  {
    title: "REJECTED",
    count: 0,
    trend: 0,
    icon: <CancelIcon />,
    iconBg: "#dc3545",
    trendColor: "#dc3545",
  },
  {
    title: "SPAM",
    count: 0,
    trend: 0,
    icon: <BlockIcon />,
    iconBg: "#ffc107",
    trendColor: "#ffc107",
  },
];

const StatusCards = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f9fbfd" }}
      >
        {" "}
        <Box sx={{ p: 4 }}>
          <Grid container spacing={5}>
            {cardItems.map((item, index) => (
              <Card
                sx={{
                  position: "relative",
                  minHeight: 120,
                  minWidth: 420,
                  boxShadow: 6,
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: item.iconBg,
                      position: "absolute",
                      top: 16,
                      left: 16,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  <Chip
                    label={item.trend}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      backgroundColor: item.trendColor,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />

                  <Typography
                    variant="h4"
                    sx={{ mt: 4, textAlign: "center", fontWeight: "bold" }}
                  >
                    {item.count}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{ textAlign: "center", color: "gray" }}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default StatusCards;
