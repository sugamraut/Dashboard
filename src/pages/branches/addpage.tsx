import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import BranchFilterBar from "../../components/Table_header_field";
import EditBranchForm from "../../components/Form_Component";
import SaveIcon from "@mui/icons-material/Save";

const BranchManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  const handleAdd = () => {
    console.log("Add clicked ✅");
    setIsDialogOpen(true);
  };

  const handleCloseForm = () => {
    setIsDialogOpen(false);
  };
    const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedBranch(null);
  };

  return (
    <div>
      <BranchFilterBar
              onAdd={handleAdd} state={""} district={""}      />

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Branch</DialogTitle>
        <DialogContent>
          <EditBranchForm onClose={handleCloseForm} />
        </DialogContent>
         <DialogActions
            style={{
              justifyContent: "flex-start",
            }} className="editfiled-button-postion"
          >
            <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
              Submit
            </Button>
          </DialogActions>
          <DialogActions
          
          >
            <Button onClick={handleDialogClose} color="error">
              Cancel
            </Button>
          </DialogActions>
      </Dialog>
    </div>
  );
};

export default BranchManagement;
