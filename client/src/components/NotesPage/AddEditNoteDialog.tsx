import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Box,
} from "@mui/material";
import { useEffect } from "react";
import { Note } from "../../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../../network/notes_api";
import * as NoteApi from "../../network/notes_api";

import TextInputField from "../Form/TextInputField";

interface AddEditNoteDialogProps {
  noteToEdit?: Note;
  onNoteSaved: (note: Note) => void;
  open: boolean;
  onClose: () => void;
}

const AddEditNoteDialog = ({
  noteToEdit,
  onNoteSaved,
  open,
  onClose,
}: AddEditNoteDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NoteInput>({
    defaultValues: {
      title: noteToEdit?.title || "",
      text: noteToEdit?.text || "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: noteToEdit?.title || "",
        text: noteToEdit?.text || "",
      });
    }
  }, [open, reset, noteToEdit]);

  async function onSubmit(input: NoteInput) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      let noteResponse: Note;
      if (noteToEdit) {
        noteResponse = await NoteApi.updateNote(noteToEdit.id, input, token);
      } else {
        noteResponse = await NoteApi.createNote(input, token);
      }

      onNoteSaved(noteResponse);
      onClose();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minWidth: "500px",
          minHeight: "400px",
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          padding: "24px 24px 16px 24px",
        }}
      >
        {noteToEdit ? "Edit note" : "Add note"}
      </DialogTitle>
      <DialogContent sx={{ padding: "16px 24px" }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextInputField
            name="title"
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.title}
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                minHeight: "56px",
                fontSize: "1.1rem",
              },
            }}
          />

          <TextInputField
            name="text"
            label="Text"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            minRows={6}
            maxRows={12}
            register={register}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px 24px 24px", gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          sx={{ minWidth: "100px" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          sx={{ minWidth: "100px" }}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditNoteDialog;
