import { CircularProgress, Button } from "@mui/material";
import { useEffect, useState } from "react";
import AddEditNoteDialog from "./AddEditNoteDialog";
import Note from "./Note";
import { Note as NoteModel } from "../../models/note";
import * as NotesApi from "../../network/notes_api";

const NoteEmptyPage = () => {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

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
        />
      ))}
    </div>
  );

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setAddDialogOpen(true)}
        style={{ display: "block", margin: "16px auto" }}
      >
        Add Note
      </Button>
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
        }}
      />
      {notesLoading && <CircularProgress />}
      {showNotesLoadingError && <p>Something went wrong</p>}
      {!notesLoading && !showNotesLoadingError && (
        <>{notes.length > 0 ? notesGrid : <p>You do not have any notes</p>}</>
      )}
    </>
  );
};

export default NoteEmptyPage;
