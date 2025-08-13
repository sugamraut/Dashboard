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
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";
import { fetchdashboarddata } from "../../store/dashboard/DashboardSlice";

const cardItems = [
  {
    title: "TOTAL",
    icon: <StorageIcon />,
    trendColor: "#0a58ca",
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
    icon: <CheckCircleIcon />,
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
  const dispatch = useDispatch<AppDispatch>();

  const { list } = useSelector((state: RootState) => state.dashboard);
  useEffect(() => {
    dispatch(
      fetchdashboarddata({
        page: 1,
        rowsPerPage: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      })
    );
  }, [dispatch]);

  const mergedCards = list.map((apiItem) => {
    const matchedCard = cardItems.find((c) => c.title === apiItem.title);
    return {
      ...apiItem,
      icon: matchedCard?.icon || <StorageIcon />,
      trendColor: matchedCard?.trendColor,
    };
  });

  return (
    <Box sx={{ display: "flex", paddingLeft: "50px" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ p: 4 }}>
          <Grid container spacing={5}>
            {mergedCards.map((item) => (
              <Card className="card-design">
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: item.trendColor,
                    }}
                    className="avatar-icon-style "
                  >
                    {item.icon}
                  </Avatar>

                  <Chip
                    label={item.changeValue}
                    size="small"
                    sx={{ backgroundColor: item.trendColor }}
                    className="chip-icon-style"
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
