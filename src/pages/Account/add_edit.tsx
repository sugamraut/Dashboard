import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import {
  uploadFile,
  createAccountTypeWithUpload,
  updateAccountType,
  type AccountType,
} from "../../store/account/AccountSlice";
import { toast } from "react-toastify";
import Text_editor from "../../components/Text_editor";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 8px;
`;

interface AddEditPageProps {
  initialData?: {
    id?: number;
    title?: string;
    code?: string;
    interest?: string;
    description?: string;
    minimumblance?: string;
    // insurance?: string;
    imageUrl?: string;
  };
  // onSave: () => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const AddEditPage = ({
  initialData,
  onSave,
  onCancel,
  isEdit,
}: AddEditPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const editorRef = useRef<HTMLDivElement>(null);

  const [uploadFileName, setUploadFileName] = useState<string | undefined>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      code: "",
      interest: "",
      minimumblance: "",
      interestPayment: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        code: initialData.code || "",
        interest: initialData.interest || "",
        minimumblance: initialData.minimumblance || "",
        // interestPayment: initialData.insurance || "",
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = initialData.description || "";
      }
      setUploadFileName(initialData.imageUrl);
      setImagePreviewUrl(initialData.imageUrl || null);
    }
  }, [initialData, reset]);

  const handleDeleteFile = () => {
    setSelectedFile(null);
    setUploadFileName("");
    setImagePreviewUrl(null);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      setUploadFileName("");
      setImagePreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    setUploadFileName(file.name);
    setImagePreviewUrl(URL.createObjectURL(file));

    const result = await dispatch(uploadFile(file));

    if (uploadFile.rejected.match(result)) {
      toast.error(result.payload || "Failed to upload file.");
      return;
    }
  };

  const onSubmit = async () => {
    try {
      if (!selectedFile && !initialData?.imageUrl) {
        toast.error("Please upload a file before submitting.");
        return;
      }

      const payload: AccountType & { file?: File } = {
        id: initialData?.id!,
        title: getValues("title") || "",
        code: getValues("code") || "",
        interest: getValues("interest") || "",
        minBalance: getValues("minimumblance") || "",
        file: selectedFile || undefined,
      };

      if (isEdit && initialData?.id) {
        const updateResult = await dispatch(updateAccountType(payload));
        if (updateAccountType.rejected.match(updateResult)) {
          toast.error(updateResult.payload || "Failed to update account type.");
          return;
        }
        toast.success("Account type updated successfully.");
      } else {
        const createResult = await dispatch(
          createAccountTypeWithUpload(payload)
        );
        if (createAccountTypeWithUpload.rejected.match(createResult)) {
          toast.error(createResult.payload || "Failed to create account type.");
          return;
        }
        toast.success("Account type created successfully.");
      }

      onSave();
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <TextField
        label="Title"
        fullWidth
        required
        margin="normal"
        {...register("title", { required: "Title is required" })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <TextField
        label="Code"
        fullWidth
        required
        margin="normal"
        {...register("code", { required: "Code is required" })}
        error={!!errors.code}
        helperText={errors.code?.message}
      />
      <TextField
        label="Interest"
        fullWidth
        required
        margin="normal"
        {...register("interest", { required: "Interest is required" })}
        error={!!errors.interest}
        helperText={errors.interest?.message}
      />

      <Divider sx={{ my: 3 }} />

      <Typography fontWeight={600} gutterBottom>
        Details
      </Typography>

      <Text_editor />

      <TextField
        label="Minimum Balance"
        fullWidth
        required
        margin="normal"
        {...register("minimumblance", {
          required: "Minimum Balance is required",
        })}
        error={!!errors.minimumblance}
        helperText={errors.minimumblance?.message}
      />

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" spacing={2} alignItems="center">
        <label htmlFor="file-upload">
          <VisuallyHiddenInput
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            accept="image/*"
          />
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            upload file
          </Button>
        </label>
        {uploadFileName && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>{uploadFileName}</Typography>
            <IconButton onClick={handleDeleteFile} color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>
      {imagePreviewUrl && (
        <Box mt={2}>
          <img
            src={imagePreviewUrl}
            alt="Preview"
            style={{ maxWidth: "200px", maxHeight: "150px" }}
          />
        </Box>
      )}

      <Box textAlign="right" mt={4} m={2}>
        <Button onClick={onCancel} color="error" className="me-1">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {isEdit ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddEditPage;

//network response
// createdDate
// :
// "2025-08-26T14:35:25.764Z"
// fileKey
// :
// "1756198225757"
// id
// :
// 11
// isDeleted
// :
// 0
// originalName
// :
// "jpeg.jpg"
// updatedDate
// :
// "2025-08-26T14:35:25.764Z"
// Unexpected Application Error!
// Cannot read properties of undefined (reading 'title')
// TypeError: Cannot read properties of undefined (reading 'title')
//     at http://localhost:5173/src/pages/Account/Account.tsx?t=1756199455046:69:15
//     at Array.filter (<anonymous>)
//     at AccountPage (http://localhost:5173/src/pages/Account/Account.tsx?t=1756199455046:68:25)
//     at react-stack-bottom-frame (http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=95470abb:17424:20)
//     at renderWithHooks (http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=95470abb:4206:24)
//     at updateFunctionComponent (http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=95470abb:6619:21)
//     at beginWork (http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=95470abb:7654:20)
//     at runWithFiberInDEV (http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=95470abb:1485:72)
//     at performUnitOfWork (http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=95470abb:10868:98)
//     at workLoopSync (http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=95470abb:10728:43)
// 💿 Hey developer 👋

// You can provide a way better UX than this when your app throws errors by providing your own ErrorBoundary or errorElement prop on your route.
