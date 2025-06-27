import React, { useState } from "react";
import styles from "./Note.module.css";
import { Card, CardContent, Typography } from "@mui/material";
import { Note as NoteModel } from "../../models/note";
import { formatDate } from "../../utils/formatDate";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteNoteDialog from "./DeleteNoteDialog";

interface NoteProps {
  note: NoteModel;
  onDeleteNoteClick: (note: NoteModel) => void;
  onNoteEditClick: (note: NoteModel) => void;
  onNoteClick?: (note: NoteModel) => void;
  isSelected?: boolean;
}

const Note = ({
  note,
  onDeleteNoteClick,
  onNoteEditClick,
  onNoteClick,
  isSelected,
}: NoteProps) => {
  const { title, text, createdAt, updatedAt } = note;

  let createdUpdatedText: string;
  if (updatedAt && createdAt && updatedAt > createdAt) {
    createdUpdatedText = "Updated: " + formatDate(updatedAt!);
  } else if (createdAt) {
    createdUpdatedText = "Created: " + formatDate(createdAt!);
  } else {
    createdUpdatedText = "";
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <Card
        variant="outlined"
        className={
          isSelected ? styles.selectedNoteCard : styles.defaultNoteCard
        }
        onClick={() => onNoteClick?.(note)}
      >
        <CardContent className={`${styles.noteCard}`}>
          <Typography
            className={`${styles.cardTypography} ${styles.flexCenter}`}
          >
            {title}
            <EditIcon
              onClick={(e) => {
                onNoteEditClick(note);
                e.stopPropagation();
              }}
              style={{ marginLeft: "auto", cursor: "pointer" }}
            />
            <DeleteIcon
              onClick={(e) => {
                setDeleteDialogOpen(true);
                e.stopPropagation();
              }}
              style={{ marginLeft: 8, cursor: "pointer" }}
            />
          </Typography>
          <Typography className={styles.cardTypography}>{text}</Typography>
          <Typography className={styles.cardTypography}>
            {createdUpdatedText}
          </Typography>
        </CardContent>
      </Card>
      <DeleteNoteDialog
        open={deleteDialogOpen}
        noteTitle={title}
        onCancel={() => setDeleteDialogOpen(false)}
        onDelete={() => {
          onDeleteNoteClick(note);
          setDeleteDialogOpen(false);
        }}
      />
    </>
  );
};

export default Note;
