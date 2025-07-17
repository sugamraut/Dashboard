
// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Button,
//   Container,
// } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";

// import BranchFilterBar from "../components/Tableheader";
// import EditBranchForm from "../components/Editcomponent";

// const BranchPage: React.FC = () => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [formData, setFormData] = useState(null);

//   const handleAddClick = () => {
//     setFormData(null); 
//     setIsDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//   };

//   return (
//     <Container>
//       <BranchFilterBar
//         state=""
//         district=""
//         onStateChange={() => {}}
//         onDistrictChange={() => {}}
//         onSearchChange={() => {}}
//         onClearFilters={() => {}}
//         onAdd={handleAddClick}
//       />

//       <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
//         <DialogContent>
//           <EditBranchForm initialData={formData || {}} onClose={handleDialogClose} />
//         </DialogContent>
//         <DialogActions sx={{ justifyContent: "flex-start" }}>
//           <Button form="form-id" type="submit" variant="contained" startIcon={<SaveIcon />}>
//             Submit
//           </Button>
//         </DialogActions>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="error">
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default BranchPage;

