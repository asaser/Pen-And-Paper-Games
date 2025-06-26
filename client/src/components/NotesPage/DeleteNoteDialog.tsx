import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface DeleteNoteDialogProps {
  open: boolean;
  noteTitle: string;
  onCancel: () => void;
  onDelete: () => void;
}

const DeleteNoteDialog: React.FC<DeleteNoteDialogProps> = ({
  open,
  noteTitle,
  onCancel,
  onDelete,
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Delete Note</DialogTitle>
      <DialogContent>
        <Typography>
          Do you want delete this <b>{noteTitle}</b> note?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={onDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteNoteDialog;
