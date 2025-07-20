// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Alert,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   type SelectChangeEvent,
// } from "@mui/material";
// import Textfield from "./Text_field";


// interface FormDataState {
//   branchName: string;
//   code: string;
//   telephone: string;
//   email: string;
//   fax: string;
//   state: string;
//   district: string;
//   city: string;
//   streetAddress: string;
//   wardNo: string;
//   title: string;
//   subtitle: string;
// }

// interface EditBranchFormProps {
//   initialData?: Partial<FormDataState>;
//   onClose?: () => void;
//   onSubmit?: (data: FormDataState) => void; 
// }
// const defaultFormData: FormDataState = {
//   branchName: "",
//   code: "",
//   telephone: "",
//   email: "",
//   fax: "",
//   state: "",
//   district: "",
//   city: "",
//   streetAddress: "",
//   wardNo: "",
//   title: "",
//   subtitle: "",
// };

// const EditBranchForm: React.FC<EditBranchFormProps> = ({
//   initialData = {},
//   onClose,
// }) => {
//   const [formData, setFormData] = useState<FormDataState>(defaultFormData);
//   const [error, setError] = useState<string | null>(null);
//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       ...initialData,
//     }));
//   }, [initialData]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>|SelectChangeEvent
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name as string]: value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.branchName || !formData.code) {
//       setError("Branch Name and Code are required.");
//       return;
//     }

//     setError(null);
//     alert("Form submitted with: " + JSON.stringify(formData, null, 2));
//     if (onClose) onClose();
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 1000,
//         mx: "auto",
//         p: 3,
//         borderRadius: 2,
//       }}
//     >
//       <Box mb={2}>
//         <Box>
//           <Typography variant="h6" fontWeight="bold" color="primary">
//             {formData.title}
//           </Typography>
//         </Box>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit}>
//         <Textfield
//           lable="Branch Name"
//           name="branchName"
//           value={formData.branchName}
//           onChange={handleChange}
//         />

//         <Textfield lable="Code" name="code" value={formData.branchName} />
//         <Textfield
//           lable="Telephone"
//           name="telephone"
//           value={formData.telephone}
//         />
//         <Textfield
//           lable="Telephone"
//           name="telephone"
//           value={formData.telephone}
//           onChange={handleChange}
//         />
//         <Textfield
//           lable="Email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//         />
//         <Textfield
//           lable="Fax"
//           name="fax"
//           value={formData.fax}
//           onChange={handleChange}
//         />

//         <Typography variant="subtitle1" fontWeight="bold">
//           {formData.subtitle}
//         </Typography>

//         <FormControl fullWidth required margin="normal">
//           <InputLabel>State</InputLabel>
//           <Select
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             label="State"
//           >
//             <MenuItem value="">
//               <em>None</em>
//             </MenuItem>
//             <MenuItem value="State 1">State 1</MenuItem>
//             <MenuItem value="State 2">State 2</MenuItem>
//           </Select>
//         </FormControl>

//         <FormControl fullWidth disabled required margin="normal">
//           <InputLabel>District</InputLabel>
//           <Select
//             name="district"
//             value={formData.district}
//             onChange={handleChange}
//             label="District"
//           >
//             <MenuItem value="Good District">Good District</MenuItem>
//           </Select>
//         </FormControl>
//         <Textfield
//           name="city"
//           lable="City"
//           value={formData.city}
//           onChange={handleChange}
//         />
//         <Textfield
//           name="streetAddress"
//           lable="Street Address"
//           value={formData.city}
//           onChange={handleChange}
//         />
//         <Textfield
//           name="wardNo"
//           lable="Ward No."
//           value={formData.city}
//           onChange={handleChange}
//         />
//       </form>
//     </Box>
//   );
// };

// export default EditBranchForm;
