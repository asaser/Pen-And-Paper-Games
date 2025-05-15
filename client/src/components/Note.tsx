import styles from "../styles/Note.module.css";
import { Card, CardContent, Typography } from "@mui/material";
import { Note as NoteModel } from "../models/note";
import { formatDate } from "../utils/formatDate";

import DeleteIcon from "@mui/icons-material/Delete";
import styleUtils from "../styles/utils.module.css";

interface NoteProps {
  note: NoteModel;
  onNoteClick: (note: NoteModel) => void;
  onDeleteNoteClick: (note: NoteModel) => void;
}

const Note = ({ note, onNoteClick, onDeleteNoteClick }: NoteProps) => {
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
    <Card variant="outlined" onClick={() => onNoteClick(note)}>
      <CardContent className={`${styles.noteCard}`}>
        <Typography
          className={`${styles.cardTypography} ${styleUtils.flexCenter}`}
        >
          {title}
          <DeleteIcon
            onClick={(e) => {
              onDeleteNoteClick(note);
              e.stopPropagation();
            }}
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
