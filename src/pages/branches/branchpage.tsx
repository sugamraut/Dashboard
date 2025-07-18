import { useState } from "react";
import Sidebar from "../sliderpage";
import SaveIcon from "@mui/icons-material/Save";
import "./edit_field";
import {
  Box,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import BranchFilterBar from "../../components/Table_header_field";
import EditBranchForm from "./edit_field";
import { useNavigate } from "react-router-dom";
import BranchTable from "../../components/Table_field";

const headers = ["Branch Name", "District", "Location", "Contact Details"];

const branches = [
  { id: 1, name: "KHUSIBU BRANCH", code: "59" },
  { id: 2, name: "GOLBAZAR BRANCH", code: "55" },
  { id: 3, name: "CHABAHIL BRANCH", code: "37" },
  { id: 4, name: "JANAKPUR BRANCH", code: "44" },
  { id: 5, name: "MID- BANESHWOR BRANCH", code: "29" },
  { id: 6, name: "THAMEL BRANCH", code: "09" },
  { id: 7, name: "DADELDHURA BRANCH", code: "19" },
  { id: 8, name: "GWARKO BRANCH", code: "88" },
  { id: 9, name: "SINAMANGAL BRANCH", code: "84" },
  { id: 10, name: "CHAINPUR BRANCH", code: "69" },
  { id: 11, name: "DHARAN BRANCH", code: "68" },
];

export default function BranchesPage() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [search, setSearch] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const navigate = useNavigate();
  const handleClearFilters = () => {
    setState("");
    setDistrict("");
    setSearch("");
  };
  const handleEditClick = (branch: {
    id: number;
    name: string;
    code: string;
  }) => {
    setSelectedBranch(branch);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedBranch(null);
  };

  const handleAdd = () => {
    alert("Add Branch clicked");
    navigate("admin/addform");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "#f9fbfd" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <h2>Branches</h2>
          <BranchFilterBar
            state={state}
            district={district}
            onStateChange={(e) => setState(e.target.value as string)}
            onDistrictChange={(e) => setDistrict(e.target.value as string)}
            onSearchChange={(e) => setSearch(e.target.value)}
            onClearFilters={handleClearFilters}
          />
        </Box>

        {/* <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Branch Name</TableCell>
                <TableCell>District</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact Details</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches
                .filter((b) =>
                  b.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((branch, index) => (
                  <TableRow key={branch.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {branch.name} ({branch.code})
                    </TableCell>
                    <TableCell>Good District</TableCell>
                    <TableCell>
                      Phungling Municipality, {branch.name} -
                    </TableCell>
                    <TableCell>--</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(branch)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer> */}
        <BranchTable
          branches={branches}
          headers={headers}
          search={search}
          onEdit={handleEditClick}
          onDelete={handleDialogClose}
        />
        <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="md">
          <DialogContent>
            <EditBranchForm
              initialData={selectedBranch}
              onClose={handleDialogClose}
            />
          </DialogContent>
          <DialogActions
            style={{
              justifyContent: "flex-start",
            }}
            className="editfiled-button-postion"
          >
            <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
              Submit
            </Button>
          </DialogActions>
          <DialogActions>
            <Button onClick={handleDialogClose} color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* </Modal> */}
    </Box>
  );
}
