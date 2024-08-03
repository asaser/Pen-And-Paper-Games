import React, { useEffect, useState } from 'react';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import * as NotesApi from "./network/notes_api";
import AddNoteDialog from './components/AddNoteDialog';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  // const [show, setShow] = useState(true)

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

  return (
    <div>
      {notes.map(note => (
        <Note note={note} key={note._id} />
      ))}
      {/* { show && */}
        <AddNoteDialog onNoteSaved={(newNote) => {
          setNotes([...notes, newNote])
        }} />
      {/* } */}
    </div>
  );
}

export default App;
