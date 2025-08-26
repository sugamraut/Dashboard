import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import SearchIcon from "@mui/icons-material/Search";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import { useEffect } from "react";
import { fetchOnlineAccount } from "../../store/onlineaccount/OnlineAccountSlice";
import EditIcon from '@mui/icons-material/Edit';
// import dayjs from "dayjs";

const OnlineAccountRequest = () => {
  const dispatch = useAppDispatch();
  const list = useAppSelector(
    (state: RootState) => state.onlineAccount.list ?? []
  );
  console.log("list=====>", list);

  useEffect(() => {
    dispatch(fetchOnlineAccount());
  });
  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
    { label: "12 Angry Men", year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: "Pulp Fiction", year: 1994 },
    {
      label: "The Lord of the Rings: The Return of the King",
      year: 2003,
    },
    { label: "The Good, the Bad and the Ugly", year: 1966 },
    { label: "Fight Club", year: 1999 },
    {
      label: "The Lord of the Rings: The Fellowship of the Ring",
      year: 2001,
    },
    {
      label: "Star Wars: Episode V - The Empire Strikes Back",
      year: 1980,
    },
  ];
  return (
    <Box marginLeft={10} padding={2}>
      <Box
        className="header"
        sx={{
          "& .MuiTypography-root": {
            paddingBottom: 0,
          },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          paddingBottom={2}
          sx={{ color: "#043ba0" }}
        >
          Online Account Request
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl component="fieldset">
            <FormControlLabel
              value="end"
              control={
                <Checkbox sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }} />
              }
              label="Trashed?"
              labelPlacement="end"
            />
          </FormControl>

          <Autocomplete
            sx={{
              "& .MuiOutlinedInput-root": {
                minWidth: 200,
              },
            }}
            disablePortal
            options={top100Films}
            // sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Movie"
                sx={{
                  "&.css-19qnlrw-MuiFormLabel-root-MuiInputLabel-root ": {
                    bottom: "23px",
                  },
                }}
              />
            )}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker"]}
              sx={{
                bottom: "4px",
                "& .MuiPickersTextField-root": {
                  maxWidth: "200px",
                },
              }}
            >
              <DatePicker
                label="Basic date picker"
                sx={{
                  bottom: "4px",
                  // "& .MuiPickersTextField-root":{
                  //     minWidth:"180px"
                  // }
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <TextField
            size="medium"
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingRight: "0px",
                maxWidth: "200px",
              },
              "& .MuiTextField-root": {
                minWidth: 0,
                // minWidth:"0px"
              },
            }}
            label="Search "
            placeholder="Type a district name"
            slotProps={
              {
                // endAdornment: (
                //   <InputAdornment position="start">
                //     <SearchIcon />
                //   </InputAdornment>
                // ),
              }
            }
          />
          <IconButton color="error">
            <FilterAltOffIcon />
          </IconButton>
        </Stack>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormControl component="fieldset">
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
                      />
                    }
                    label=""
                    labelPlacement="end"
                  />
                </FormControl>
              </TableCell>
              <TableCell className="table-header">#</TableCell>
              <TableCell className="table-header">Name</TableCell>
              <TableCell className="table-header"> Status</TableCell>
              <TableCell className="table-header"> created At</TableCell>
              <TableCell className="table-header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.length > 0 ? (
              list.map((onlineAccount, index) => (
                <TableRow key={onlineAccount.id}>
                  <TableCell className="table-data">{index + 1}</TableCell>
                  <TableCell className="table-data">
                    {onlineAccount.name}
                  </TableCell>
                  <TableCell className="table-data">
                    {onlineAccount.status}
                  </TableCell>
                  <TableCell className="table-data">
                    {onlineAccount.createdat}
                  </TableCell>
                  <TableCell className="table-data">
                    <IconButton className="action-icon-btn">
                      <EditIcon/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Online Request Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OnlineAccountRequest;
