import { Autocomplete, Box, Button, TextField } from "@mui/material";

const ADDEDIT = () => {
  const top100Films = [
    { title :"The Shawshank Redemption", year: 1994 },
    {title: "The Godfather", year: 1972 },
    {title: "The Godfather: Part II", year: 1974 },
    {title: "The Dark Knight", year: 2008 },
    {title: "12 Angry Men", year: 1957 },
    {title: "Schindler's List", year: 1993 },
    { title: "Pulp Fiction", year: 1994 },
    {
    title: "The Lord of the Rings: The Return of the King",
      year: 2003,
    },
    {title: "The Good, the Bad and the Ugly", year: 1966 },
    {title: "Fight Club", year: 1999 },
    {
    title: "The Lord of the Rings: The Fellowship of the Ring",
      year: 2001,
    },
    {
    title: "Star Wars: Episode V - The Empire Strikes Back",
      year: 1980,
    },
    {title: "Forrest Gump", year: 1994 },
    {title: "Inception", year: 2010 },
    {
    title: "The Lord of the Rings: The Two Towers",
      year: 2002,
    },
  ];
  return (
    <Box component="form" noValidate>
      <TextField
        label="District Name"
        name="name"
        // value={formData.name}
        // onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="District in Nepali"
        name="District in nepali"
        required
        fullWidth
      />
       <Autocomplete
      disablePortal
      options={top100Films }
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />

      <Autocomplete
        multiple
        limitTags={2}
        id="multiple-limit-tags"
        options={top100Films}
       getOptionLabel={(option) => option.title}
        // defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}
        renderInput={(params) => <TextField {...params} label="limitTags" />}
        sx={{ width: "500px" }}
      />
      <Box mt={3} textAlign="right" gap={2}>
        <Button color="error" sx={{mr:2}}>
            Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit">
            Submit

        </Button>

      </Box>
    </Box>
  );
};

export default ADDEDIT;
