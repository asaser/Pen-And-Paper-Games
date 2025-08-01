import { CircularProgress, Button, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import AddEditNoteDialog from "./AddEditNoteDialog";
import Note from "./Note";
import { Note as NoteModel } from "../../models/note";
import * as NotesApi from "../../network/notes_api";
import styles from "./Note.module.css";

const NoteEmptyPage = () => {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteModel | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");
        const notes = await NotesApi.fetchNotes(token);
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
      }
    }
    loadNotes();
  }, []);

  async function deleteNote(note: NoteModel) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      await NotesApi.deleteNote(note.id, token);
      setNotes(notes.filter((existingNote) => existingNote.id !== note.id));

      if (selectedNote?.id === note.id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const notesGrid = (
    <div>
      {notes.map((note) => (
        <Note
          note={note}
          key={note.id}
          onDeleteNoteClick={deleteNote}
          onNoteEditClick={() => setNoteToEdit(note)}
          onNoteClick={() => setSelectedNote(note)}
          isSelected={selectedNote?.id === note.id}
        />
      ))}
    </div>
  );

  return (
    <div className={styles.notesPageContainer}>
      {/* Left Panel - 1/3 width */}
      <div className={styles.leftPanel}>
        <Button
          variant="outlined"
          onClick={() => setAddDialogOpen(true)}
          className={styles.addNoteButton}
        >
          Add Note
        </Button>

        {notesLoading && <CircularProgress />}
        {showNotesLoadingError && <p>Something went wrong</p>}
        {!notesLoading && !showNotesLoadingError && (
          <div className={styles.notesList}>
            {notes.length > 0 ? notesGrid : <p>You do not have any notes</p>}
          </div>
        )}
      </div>

      {/* Right Panel - 2/3 width */}
      <div className={styles.rightPanel}>
        {selectedNote ? (
          <Paper className={styles.noteDetailPanel}>
            <Typography variant="h4" className={styles.noteDetailTitle}>
              {selectedNote.title}
            </Typography>
            <Typography variant="body1" className={styles.noteDetailText}>
              {selectedNote.text}
            </Typography>
          </Paper>
        ) : (
          <div className={styles.noNoteSelected}>
            <Typography variant="h6" color="text.secondary">
              Select a note to view details
            </Typography>
          </div>
        )}
      </div>

      <AddEditNoteDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onNoteSaved={(newNote) => {
          setNotes([...notes, newNote]);
          setAddDialogOpen(false);
        }}
      />
      <AddEditNoteDialog
        noteToEdit={noteToEdit ?? undefined}
        open={!!noteToEdit}
        onClose={() => setNoteToEdit(null)}
        onNoteSaved={(updatedNote) => {
          setNotes(
            notes.map((existingNote) =>
              existingNote.id === updatedNote.id ? updatedNote : existingNote
            )
          );
          setNoteToEdit(null);
          if (selectedNote?.id === updatedNote.id) {
            setSelectedNote(updatedNote);
          }
        }}
      />
    </div>
  );
};

export default NoteEmptyPage;
