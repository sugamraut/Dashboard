// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import Stack from "@mui/material/Stack";
// import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Modal } from "@mui/material";
import React from "react";

export default function Loading() {
  const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    // <Dialog open={true} fullWidth maxWidth="sm">
    //   <DialogContent>
    //     <Box
    //       sx={{
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         height: "300px",
    //       }}
    //     >
    //       <Stack spacing={2}>
    //         <Stack direction="row" spacing={2}>
    //           <CircularProgress />
    //         </Stack>
    //       </Stack>
    //     </Box>
    //   </DialogContent>
    // </Dialog>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <CircularProgress />
    </Modal>
  );
}
