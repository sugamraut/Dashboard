// import { Box, Button, Stack } from "@mui/material";

// export default function LoadingButtonss() {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//         width: "100vw",
//       }}
//     >
//       <Stack spacing={2}>
//         <Stack direction="row" spacing={2}>
//           <Button
//             loading
//             variant="outlined"
//             style={{ width: "100px", height: "100px" }}
//           >
//             Submit
//           </Button>
//         </Stack>
//       </Stack>
//     </Box>
//   );
// }

// LoadingButtonsDialog.js
// LoadingButtonsDialog.js
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingButtons() {
  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth="sm"
    //   PaperProps={{
    //     style: {
    //       backgroundColor: 'white', 
    //       boxShadow: 'none',               
    //     //   overflow: 'visible'             
    //     },
    //   }}
    >
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <LoadingButton
                variant="outlined"
                loading
                sx={{
                  height: 340,
                  width: 600,
                }}
                loadingIndicator={
                  <CircularProgress
                    size={60}
                    sx={{ color: 'primary.main' }}
                  />
                }
              >
                Submit
              </LoadingButton>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}   