import {
  Box,
  IconButton,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import Button from "@mui/joy/Button";
import { useForm, Controller } from "react-hook-form";
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
  Undo,
  Redo,
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
    interestPayment?: string;
    upload?: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

const AddEditPage = ({ initialData, onSave, onCancel }: AddEditPageProps) => {
  // const editorRef = useRef<HTMLDivElement>(null);
  const [alignment, setAlignment] = useState("left");
  const [uploadFileName, setUploadFileName] = useState<string | undefined>("");

  const {
    register,
    handleSubmit,
    control,
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
        interestPayment: initialData.interestPayment || "",
        upload: initialData.upload || "",
      });
      // if (editorRef.current) {
      //   editorRef.current.innerHTML = initialData.details || "";
      // }
      setUploadFileName(initialData.upload);
    }
  }, [initialData, reset]);

  const execCommand = (command: string, value: any = null) => {
    document.execCommand(command, false, value);
  };

  const handleAlignment = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      document.execCommand(`justify${newAlignment}`, false);
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
      // details: editorRef.current?.innerHTML || "",
    });
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
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

      
      <Box sx={{ width: "100%", margin: "20px 0", fontFamily: "Arial" }}>
        <Box
          sx={{
            borderBottom: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            gap: 1,
            padding: 1,
            flexWrap: "wrap",
          }}
        >
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            size="small"
          >
            <ToggleButton value="Left"><FormatAlignLeft /></ToggleButton>
            <ToggleButton value="Center"><FormatAlignCenter /></ToggleButton>
            <ToggleButton value="Right"><FormatAlignRight /></ToggleButton>
            <ToggleButton value="Full"><FormatAlignJustify /></ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title="Bold"><IconButton size="small" onClick={() => execCommand("bold")}><FormatBold /></IconButton></Tooltip>
          <Tooltip title="Italic"><IconButton size="small" onClick={() => execCommand("italic")}><FormatItalic /></IconButton></Tooltip>
          <Tooltip title="Underline"><IconButton size="small" onClick={() => execCommand("underline")}><FormatUnderlined /></IconButton></Tooltip>
          <Tooltip title="Strikethrough"><IconButton size="small" onClick={() => execCommand("strikeThrough")}><FormatStrikethrough /></IconButton></Tooltip>
          <Tooltip title="Bullet List"><IconButton size="small" onClick={() => execCommand("insertUnorderedList")}><FormatListBulleted /></IconButton></Tooltip>
          <Tooltip title="Numbered List"><IconButton size="small" onClick={() => execCommand("insertOrderedList")}><FormatListNumbered /></IconButton></Tooltip>
          <Tooltip title="Undo"><IconButton size="small" onClick={() => execCommand("undo")}><Undo /></IconButton></Tooltip>
          <Tooltip title="Redo"><IconButton size="small" onClick={() => execCommand("redo")}><Redo /></IconButton></Tooltip>
        </Box>


        <Box
          // ref={editorRef}
          contentEditable
          sx={{
            minHeight: "150px",
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: 1,
            marginTop: 1,
            overflowY: "auto",
            fontSize: 14,
          }}
          spellCheck
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
        label="Interest Payment"
        fullWidth
        required
        margin="normal"
        {...register("interestPayment", { required: "Interest Payment is required" })}
        error={!!errors.interestPayment}
        helperText={errors.interestPayment?.message}
      />


      <Button
        component="label"
        fullWidth
        variant="outlined"
        color="neutral"
        startDecorator={
          <SvgIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
      {uploadFileName && <Box mt={1}>Selected file: {uploadFileName}</Box>}

  
      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button variant="outlined" color="neutral" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="solid" color="primary">
          {initialData?.title ? "Update" : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddEditPage;
