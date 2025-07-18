import React from "react";
import {
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

export type Branch = {
  id: number;
  [key: string]: any;
};

interface BranchTableProps {
  branches: Branch[];
  headers: string[];
  onEdit: (branch: Branch) => void;
  onDelete?: (branch: Branch) => void;
}

const BranchTable: React.FC<BranchTableProps> = ({
  branches,
  headers,
  search,
  onEdit,
  onDelete,
}) => {
  const filteredBranches = branches.filter((branch) =>
    branch.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBranches.map((branch, index) => (
            <TableRow key={branch.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{branch.name}</TableCell>
              <TableCell>{branch.code}</TableCell>
              <TableCell>{branch.district}</TableCell>
              <TableCell>{branch.location}</TableCell>
              <TableCell>{branch.contact}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onEdit(branch)}>
                  <EditIcon />
                </IconButton>
                {onDelete && (
                  <IconButton color="error" onClick={() => onDelete(branch)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BranchTable;
