import styles from "../styles/Note.module.css"
import { Card, CardContent, Typography } from "@mui/material";
import { Note as NoteModel } from "../models/note";
import { formatDate } from "../utils/formatDate";

interface NoteProps {
    note: NoteModel,
}

const Note = ({ note }: NoteProps) => {
    const {
        title,
        text,
        createdAt,
        updatedAt
    } = note;

    let createdUpdatedText: string;
    if(updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt)
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt)
    }

    return (
        <Card variant="outlined">
            <CardContent className={`${styles.noteCard}`}>
                <Typography className={styles.cardTypography}>
                    {title}
                </Typography>
                <Typography className={styles.cardTypography}>
                    {text}
                </Typography>
                <Typography className={styles.cardTypography}>
                    {createdUpdatedText}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Note;