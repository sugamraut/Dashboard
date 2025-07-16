import { useState } from "react";
import Sidebar from "./homepage";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BranchFilterBar from "../components/Tablefield"; 

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

  const handleClearFilters = () => {
    setState("");
    setDistrict("");
    setSearch("");
  };

  const handleAdd = () => {
    alert("Add Branch clicked");
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
            onAdd={handleAdd}
          />
        </Box>

        <TableContainer component={Paper}>
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
                      <IconButton color="primary">
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
        </TableContainer>
      </Box>
    </Box>
  );
}
