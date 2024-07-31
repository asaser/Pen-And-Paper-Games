import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { Note } from "../models/note";
import { useForm } from "react-hook-form";
import { NoteInput } from "../network/notes_api";

interface AddNoteDialogProps {
    onNoteSaved: (note: Note) => void,
}

const AddNoteDialog = ({onNoteSaved}: AddNoteDialogProps) => {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting}
    } = useForm<NoteInput[]>()


    async function onSubmit(input: NoteInput) {
        try {
            
        } catch (error) {
            console.error(error) 
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
            <Button variant="outlined" onClick={handleClickOpen}>
                Open alert dialog
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Add Note"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} direction="column">
                        <form>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Text"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
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

export default AddNoteDialog;