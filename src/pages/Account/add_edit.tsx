import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Box,
  IconButton,
  Typography,
  Divider,
  Stack,
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Controller, useForm } from "react-hook-form";

import {
  uploadFile,
  createAccountTypeWithUpload,
  updateAccountType,
} from "../../store/account/AccountSlice";
import { toast } from "react-toastify";
import Text_editor from "../../components/Text_editor";
import InputField from "../../components/Input_field";
import { useAppDispatch } from "../../store/hook";
import { AccountSchema } from "../../globals/ZodValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AccountType } from "../../globals/typeDeclaration";

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
    imageUrl?: string;
    originalName?: string;
  };

  onCancel: () => void;
  isEdit?: boolean;
}

const AddEditPage = ({
  initialData,

  onCancel,
  isEdit,
}: AddEditPageProps) => {
  const dispatch = useAppDispatch();
  const editorRef = useRef<HTMLDivElement>(null);

  const [uploadFileName, setUploadFileName] = useState<string | undefined>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [editorContent, setEditorContent] = useState(
    initialData?.description || ""
  );

  const {
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      title: "",
      code: "",
      interest: "",
      minBalance: "",
      imageUrl: "",
      originalName: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        code: initialData.code || "",
        interest: initialData.interest || "",
        minBalance: initialData.minimumblance || "",
        originalName: initialData.originalName || "",
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
        id: initialData?.id || 0,
        title: getValues("title"),
        code: getValues("code"),
        interest: getValues("interest"),
        minBalance: getValues("minBalance"),
        originalName: getValues("originalName"),
        description: editorRef.current?.innerHTML || "",
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
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData?.id ? "Edit Account" : "Add District"}
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputField
                {...field}
                fullWidth
                label="Title"
                margin="normal"
                error={!!errors.title}
                helperText={errors?.title?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <InputField
                fullWidth
                label="Code"
                margin="normal"
                {...field}
                error={!!errors.code}
                helperText={errors?.code?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="interest"
            render={({ field }) => (
              <InputField
                fullWidth
                margin="normal"
                {...field}
                label="Interest"
                error={!!errors.interest}
                helperText={errors?.interest?.message}
              />
            )}
          />

          <Divider sx={{ my: 3 }} />

          <Typography fontWeight={600} gutterBottom>
            Details
          </Typography>

          <Text_editor
            value={editorContent}
            onChange={(html) => setEditorContent(html)}
          />

          <Controller
            control={control}
            name="minBalance"
            render={({ field }) => (
              <InputField
                label="minimumbalance"
                fullWidth
                margin="normal"
                {...field}
                error={!!errors.minBalance}
                helperText={errors.minBalance?.message}
              />
            )}
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

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onCancel} color="error">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {initialData?.id ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditPage;
