import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";

import StorageIcon from "@mui/icons-material/Storage";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CancelIcon from "@mui/icons-material/Cancel";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

import type { RootState } from "../../store/store";
import { useEffect } from "react";
import { fetchdashboarddata } from "../../store/dashboard/DashboardSlice";
import { useAppDispatch, useAppSelector } from "../../store/hook";

const cardItems = [
  {
    title: "TOTAL",
    icon: <StorageIcon />,
    trendColor: "#0d6efd",
  },
  {
    title: "PENDING",
    icon: <VisibilityOffIcon />,
    trendColor: "#6c757d",
  },
  {
    title: "PROCESSING",
    icon: <AccessTimeIcon />,
    trendColor: "#0d6efd",
  },
  {
    title: "APPROVED",
    icon: <HowToRegIcon />,
    trendColor: "#198754",
  },
  {
    title: "REJECTED",
    icon: <CancelIcon />,
    trendColor: "#dc3545",
  },
  {
    title: "SPAM",
    icon: <NotInterestedIcon />,
    trendColor: "#ffc107",
  },
];

const StatusCards = () => {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchdashboarddata());
  }, [dispatch]);

  const apiDataMap = Object.fromEntries(list.map((item) => [item.title, item]));

  return (
    <Box sx={{ display: "flex", paddingLeft: "150px" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{

            justifyContent: "flex-start",
          }}
          className="row gap-5 "
        >
          {cardItems.map((card) => {
            const apiData = apiDataMap[card.title] || {};
            return (
              <Box
                key={card.title}
                // 
                
                sx={{
                  width:{
                    sm:"100%",
                    md:"45%",
                    xl:"25%",
                    
                  }
                }}
              >
                <Card className="card-design">
                  <CardContent>
                    <Avatar
                      sx={{ bgcolor: card.trendColor }}
                      className="avatar-icon-style"
                    >
                      {card.icon}
                    </Avatar>

                    <Chip
                      label={apiData.changeValue ?? "N/A"}
                      size="small"
                      sx={{ backgroundColor: card.trendColor }}
                      className="chip-icon-style"
                    />

                    <Typography
                      className="dashboardCardValue"
                      variant="h4"
                      sx={{ mt: 2 }}
                    >
                      {apiData.count ?? 0}
                    </Typography>

                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center", color: "gray", mt: 1 }}
                    >
                      {card.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default StatusCards;
