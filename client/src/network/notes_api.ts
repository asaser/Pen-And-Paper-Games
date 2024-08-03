import { Note } from "../models/note";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const repsponse = await fetch(input, init);
  if (repsponse.ok) {
    return repsponse;
  } else {
    const errorBody = await repsponse.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData("/api/notes/", { method: "GET" });
  return response.json();
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(note: NoteInput): Promise<Note> {
  const response = await fetchData("api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

  return response.json();
}
