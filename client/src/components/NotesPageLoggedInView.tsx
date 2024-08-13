import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import AddEditNoteDialog from "../components/AddEditNoteDialog";
import Note from "../components/Note";
import { Note as NoteModel } from "../models/note";
import * as NotesApi from "../network/notes_api";

const NotesPageLoggedInView = () => {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await NotesApi.fetchNotes();
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
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
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
          onNoteClick={setNoteToEdit}
          key={note._id}
          onDeleteNoteClick={deleteNote}
        />
      ))}
    </div>
  );

  return (
    <>
      <AddEditNoteDialog
        onNoteSaved={(newNote) => {
          setNotes([...notes, newNote]);
        }}
      />

      {notesLoading && <CircularProgress />}
      {showNotesLoadingError && <p>Something went wrong</p>}
      {!notesLoading && !showNotesLoadingError && (
        <>{notes.length > 0 ? notesGrid : <p>You do not have any notes</p>}</>
      )}
      {noteToEdit && (
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onNoteSaved={(updatedNote) => {
            setNotes(
              notes.map((existingNote) =>
                existingNote._id === updatedNote._id
                  ? updatedNote
                  : existingNote
              )
            );
            setNoteToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default NotesPageLoggedInView;
