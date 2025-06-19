import styles from "./Note.module.css";
import { Card, CardContent, Typography } from "@mui/material";
import { Note as NoteModel } from "../../models/note";
import { formatDate } from "../../utils/formatDate";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface NoteProps {
  note: NoteModel;
  onDeleteNoteClick: (note: NoteModel) => void;
  onNoteEditClick: (note: NoteModel) => void;
}

const Note = ({ note, onDeleteNoteClick, onNoteEditClick }: NoteProps) => {
  const { title, text, createdAt, updatedAt } = note;

  let createdUpdatedText: string;
  if (updatedAt && createdAt && updatedAt > createdAt) {
    createdUpdatedText = "Updated: " + formatDate(updatedAt!);
  } else if (createdAt) {
    createdUpdatedText = "Created: " + formatDate(createdAt!);
  } else {
    createdUpdatedText = "";
  }

  return (
    <Card variant="outlined">
      <CardContent className={`${styles.noteCard}`}>
        <Typography className={`${styles.cardTypography} ${styles.flexCenter}`}>
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
              onDeleteNoteClick(note);
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
  );
};

export default Note;
