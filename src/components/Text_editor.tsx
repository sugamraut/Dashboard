import {
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatStrikethrough,
  FormatUnderlined,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import React, { useRef, useState } from "react";

function Text_editor() {
  const [alignment, setAlignment] = useState("left");
  const editorRef = useRef<HTMLDivElement>(null);

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
  return (
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
        sx={{ minHeight: "150px", padding: 2, fontSize: 16, outline: "none" }}
        aria-label="Details editor"
        role="textbox"
        tabIndex={0}
      />
    </Box>
  );
}

export default Text_editor;
