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
} from "@mui/material";
import Button from "@mui/joy/Button";

import DeleteIcon from "@mui/icons-material/Delete";

import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
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
import { styled } from "@mui/joy";
import SvgIcon from "@mui/joy/SvgIcon";

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
    title?: string;
    code?: string;
    interest?: string;
    details?: string;
    minimumblance?: string;
    insurance?: string;
    imageUrl?: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

const AddEditPage = ({ initialData, onSave, onCancel }: AddEditPageProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [alignment, setAlignment] = useState("left");
  const [uploadFileName, setUploadFileName] = useState<string | undefined>("");
  // const [uploadFileName, setUploadFileName] = useState(null);

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
        interestPayment: initialData.insurance|| "",
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

  const onSubmit = (data: any) => {
    onSave({
      ...data,
      details: editorRef.current?.innerHTML || "",
    });
  };
   const handleDeleteFile = () => {
    setUploadFileName("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" mb={3}>
        {initialData?.title ? "Edit Entry" : "Add New Entry"}
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
            <ToggleButton value="left">
              <FormatAlignLeft />
            </ToggleButton>
            <ToggleButton value="center">
              <FormatAlignCenter />
            </ToggleButton>
            <ToggleButton value="right">
              <FormatAlignRight />
            </ToggleButton>
            <ToggleButton value="justify">
              <FormatAlignJustify />
            </ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title="Bold">
            <IconButton onClick={() => applyStyle("b")}>
              <FormatBold />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton onClick={() => applyStyle("i")}>
              <FormatItalic />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton onClick={() => applyStyle("u")}>
              <FormatUnderlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Strikethrough">
            <IconButton onClick={() => applyStyle("s")}>
              <FormatStrikethrough />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bullet List">
            <IconButton onClick={() => insertList("ul")}>
              <FormatListBulleted />
            </IconButton>
          </Tooltip>
          <Tooltip title="Numbered List">
            <IconButton onClick={() => insertList("ol")}>
              <FormatListNumbered />
            </IconButton>
          </Tooltip>
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
        />
      </Box>

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

      <TextField
        label="Interest Payment"
        fullWidth
        required
        margin="normal"
        {...register("interestPayment", {
          required: "Interest Payment is required",
        })}
        error={!!errors.interestPayment}
        helperText={errors.interestPayment?.message}
      />

      <Box mt={2}>
        <Button
          component="label"
          fullWidth
          variant="outlined"
          color="neutral"
          startDecorator={
            <SvgIcon>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3
                    M6.75 19.5a4.5 4.5 0 01-1.41-8.775
                    5.25 5.25 0 0110.233-2.33
                    3 3 0 013.758 3.848
                    A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
            </SvgIcon>
          }
        >
          Upload a file
          <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
        </Button>
        {uploadFileName && (
          <Typography mt={1} display="flex" className="justify-content-between">
            Selected file: {uploadFileName}{" "}
            <IconButton color="error" onClick={handleDeleteFile}>
              <DeleteIcon />
            </IconButton>
          </Typography>
        )}
      </Box>

      <Box
        display="flex"
        justifyContent="flex-end"
        gap={2}
        mt={4}
        color="error"
      >
        <Button color="danger" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="solid" color="primary">
          {initialData?.title ? "Submit" : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddEditPage;
