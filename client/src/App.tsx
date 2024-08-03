import React, { useEffect, useState } from 'react';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import * as NotesApi from "./network/notes_api";
import AddEditNoteDialog from './components/AddEditNoteDialog';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    loadNotes()
  }, []);

  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter(existingNote => existingNote._id !== note._id))
    } catch (error) {
      console.error(error);
      alert(error)
    }
  }

  return (
    <div>
      {notes.map(note => (
        <Note 
          note={note} 
          onNoteClick={setNoteToEdit}
          key={note._id} 
          onDeleteNoteClick={deleteNote}  
        />
      ))}
        <AddEditNoteDialog 
          onNoteSaved={(newNote) => {
            setNotes([...notes, newNote])
          }} 
        />

        {noteToEdit && <AddEditNoteDialog noteToEdit={noteToEdit} onNoteSaved={(updatedNote) => {
          setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote))
          setNoteToEdit(null);
        }} />}
    </div>
  );
}

export default App;
