import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Divider,
  Stack,
  Button
} from "@mui/material";
// import Button from "@mui/joy/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatListBulleted,
  FormatListNumbered,
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';
// import { styled } from "@mui/joy";
// import SvgIcon from "@mui/joy/SvgIcon";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  fetchAccountTypeFiles,
  PostAccountType,
  updateAccountType,
} from "../../store/account/AccountSlice";

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
    details?: string;
    minimumblance?: string;
    insurance?: string;
    imageUrl?: string;
  };
  onSave: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const AddEditPage = ({ initialData, onSave, onCancel, isEdit }: AddEditPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const editorRef = useRef<HTMLDivElement>(null);
  const [alignment, setAlignment] = useState("left");
  const [uploadFileName, setUploadFileName] = useState<string | undefined>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      code: "",
      interest: "",
      minimumblance: "",
      interestPayment: "",
      upload: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        code: initialData.code || "",
        interest: initialData.interest || "",
        minimumblance: initialData.minimumblance || "",
        interestPayment: initialData.insurance || "",
        upload: initialData.imageUrl || "",
      });
      if (editorRef.current) {
        editorRef.current.innerHTML = initialData.details || "";
      }
      setUploadFileName(initialData.imageUrl);
    }
  }, [initialData, reset]);


  const applyStyle = (tag: keyof HTMLElementTagNameMap) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const wrapper = document.createElement(tag);
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    range.setStartAfter(wrapper);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const insertList = (type: "ul" | "ol") => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const contents = range.extractContents();
    const list = document.createElement(type);
    const li = document.createElement("li");
    li.appendChild(contents);
    list.appendChild(li);
    range.insertNode(list);
  };

  const handleAlignment = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment) {
      setAlignment(newAlignment);
      if (editorRef.current) {
        editorRef.current.style.textAlign = newAlignment.toLowerCase();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("upload", file.name);
      setUploadFileName(file.name);
    }
  };

  const handleDeleteFile = () => {
    setUploadFileName("");
    setValue("upload", "");
  };

  const onSubmit = async (formData: any) => {
    try {
      const fetchResult = await dispatch(fetchAccountTypeFiles());

      if (fetchAccountTypeFiles.rejected.match(fetchResult) || !fetchResult.payload?.length) {
        alert("Please upload at least one file before submitting.");
        return;
      }

      const payload = {
        title: formData.title,
        code: formData.code,
        interest: formData.interest,
        description: editorRef.current?.innerHTML || "",
        minBalance: formData.minimumblance,
        insurance: formData.interestPayment,
        imageUrl: uploadFileName||undefined,
      };

      if (isEdit && initialData?.id) {
        const updateResult = await dispatch(updateAccountType({ ...payload, id: initialData.id }));
        if (updateAccountType.rejected.match(updateResult)) {
          alert(updateResult.payload || "Failed to update account type.");
          return;
        }
        alert("Account type updated successfully.");
      } else {
        const createResult = await dispatch(PostAccountType(payload));
        if (PostAccountType.rejected.match(createResult)) {
          alert(createResult.payload || "Failed to create account type.");
          return;
        }
        alert("Account type created successfully.");
      }

      onSave();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" mb={3}>
        {isEdit ? "Edit Entry" : "Add New Entry"}
      </Typography>

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

      <Box sx={{ border: "1px solid #ccc", borderRadius: 1, mb: 2 }}>
        <Box
          sx={{
            borderBottom: "1px solid #ccc",
            p: 1,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            size="small"
          >
            <ToggleButton value="left"><FormatAlignLeft /></ToggleButton>
            <ToggleButton value="center"><FormatAlignCenter /></ToggleButton>
            <ToggleButton value="right"><FormatAlignRight /></ToggleButton>
            <ToggleButton value="justify"><FormatAlignJustify /></ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title="Bold"><IconButton onClick={() => applyStyle("b")}><FormatBold /></IconButton></Tooltip>
          <Tooltip title="Italic"><IconButton onClick={() => applyStyle("i")}><FormatItalic /></IconButton></Tooltip>
          <Tooltip title="Underline"><IconButton onClick={() => applyStyle("u")}><FormatUnderlined /></IconButton></Tooltip>
          <Tooltip title="Strikethrough"><IconButton onClick={() => applyStyle("s")}><FormatStrikethrough /></IconButton></Tooltip>
          <Tooltip title="Bullet List"><IconButton onClick={() => insertList("ul")}><FormatListBulleted /></IconButton></Tooltip>
          <Tooltip title="Numbered List"><IconButton onClick={() => insertList("ol")}><FormatListNumbered /></IconButton></Tooltip>
        </Box>

        <Box
          ref={editorRef}
          contentEditable
          sx={{
            minHeight: "150px",
            padding: 2,
            fontSize: 16,
            outline: "none",
          }}
          aria-label="Details editor"
          role="textbox"
          tabIndex={0}
        />
      </Box>

      <TextField
        label="Minimum Balance"
        fullWidth
        required
        margin="normal"
        {...register("minimumblance", { required: "Minimum Balance is required" })}
        error={!!errors.minimumblance}
        helperText={errors.minimumblance?.message}
      />

      <TextField
        label="Insurance"
        fullWidth
        required
        margin="normal"
        {...register("interestPayment", { required: "Insurance is required" })}
        error={!!errors.interestPayment}
        helperText={errors.interestPayment?.message}
      />

      <Box mt={3}>
        <Button component="label"  startIcon={<CloudUploadIcon />} variant="contained" >
          Upload File
          <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
        </Button>

        {uploadFileName && (
          <Stack direction="row" alignItems="center" spacing={1} mt={1}>
            <Typography fontSize={14}>{uploadFileName}</Typography>
            <IconButton size="small" onClick={handleDeleteFile}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
      </Box>

      <Box mt={4} display="flex" gap={2}>
        <Button type="submit" color="primary" >
          {isEdit ? "Update" : "Add"}
        </Button>
        <Button  onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddEditPage;

