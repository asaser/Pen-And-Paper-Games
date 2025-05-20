import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import * as NoteApi from "../network/notes_api";

import styleUtils from "../styles/utils.module.css";
import TextInputField from "./form/TextInputField";

interface AddEditNoteDialogProps {
  noteToEdit?: Note;
  onNoteSaved: (note: Note) => void;
}

const AddEditNoteDialog = ({
  noteToEdit,
  onNoteSaved,
}: AddEditNoteDialogProps) => {
  const [open, setOpen] = useState(false);

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
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        className={`${styleUtils.blockCenter}`}
      >
        {noteToEdit ? "Edit Note" : "Add Note"}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {noteToEdit ? "Edit note" : "Add note"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} direction="column">
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInputField
                name="title"
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.title}
              />

              <TextInputField
                name="text"
                label="Text"
                variant="outlined"
                fullWidth
                margin="normal"
                register={register}
              />

              <div>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </form>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddEditNoteDialog;
