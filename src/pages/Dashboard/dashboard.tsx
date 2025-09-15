import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";

// import StorageIcon from "@mui/icons-material/Storage";
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
import useDocumentTitle from "../../globals/useBrowserTitle";
import ShowChartIcon from "@mui/icons-material/ShowChart";

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
  useDocumentTitle("Dashboard - SNLI");

  const { list } = useAppSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    if (!list.length) {
      dispatch(fetchdashboarddata());
    }
  }, [dispatch, list.length]);

  console.log("list", list);

  const apiDataMap = Object.fromEntries(
    Array.isArray(list) ? list.map((item) => [item.title, item]) : []
  );

  console.log("apiDataMap", apiDataMap);

  return (
    <Box sx={{ display: "flex", paddingLeft: "90px" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            justifyContent: "flex-start",
          }}
          className="row  "
        >
          {cardItems.map((card) => {
            const apiData = apiDataMap[card.title] || {};
            return (
              <Box
                key={card.title}
                className="m-3 col "
                sx={{
                  width: {
                    sm: "100%",
                    md: "45%",
                    xl: "30%",
                  },
                }}
              >
                <Card className="card-design">
                  <CardContent>
                    <Avatar
                      sx={{
                        bgcolor: "transparent",
                        color: card.trendColor,
                        "& .MuiSvgIcon-root": {
                          fontSize: "2.8rem",
                        },
                      }}
                      className="avatar-icon-style"
                    >
                      {card.icon}
                    </Avatar>

                    <Chip
                      label={apiData.changeValue ?? "N/A"}
                      size="small"
                      icon={<ShowChartIcon sx={{ fill: "#ffffffff" }} />}
                      sx={{
                        backgroundColor: card.trendColor,
                        color: "white",
                        padding: "9px",
                        fontSize: "1.1rem",
                      }}
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
                      sx={{ textAlign: "center", color: "#807f7fff", mt: 1 }}
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
