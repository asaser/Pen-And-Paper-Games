import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useState } from "react";

const AddNoteDialog = () => {
    const [open, setOpen] = useState(false);
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
                        <Grid item>
                            <TextField
                            required
                            id="outlined-required"
                            label="Title"
                            placeholder="Title"
                            fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                            id="outlined-required"
                            label="Text"
                            placeholder="Text"
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
      </>
    );
}

export default AddNoteDialog;