import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";
import * as NoteApi from "../network/notes_api";

import styleUtils from "../styles/utils.module.css";


interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onNoteSaved: (note: Note) => void,
}

const AddEditNoteDialog = ({noteToEdit, onNoteSaved}: AddEditNoteDialogProps) => {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting}
    } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || "",
        }
    })


    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: Note;
            if (noteToEdit) {
                noteResponse = await NoteApi.updateNote(noteToEdit._id, input);
            } else {
                noteResponse = await NoteApi.createNote(input);
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
                Add Note
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
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                error={!!errors.title}
                                {...register("title", { required: "Required" })}
                            />
                            <p>
                                {errors.title?.message}
                            </p>
                            <TextField
                                label="Text"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                {...register("text")}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Save
                            </Button>
                        </form>
                    </Grid>
                </DialogContent>
            </Dialog>
    </>
    );
}

export default AddEditNoteDialog;