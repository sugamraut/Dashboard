import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,

        backgroundColor: "#f1f5f8",
      }}
    >
      <CircularProgress className="modal-loading-indicator" />
    </Box>
  );
}
