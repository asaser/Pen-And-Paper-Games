import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const token = localStorage.getItem("token"); // Pobierz token JWT z localStorage

  // Dodaj nagłówek Authorization jeśli token istnieje
  const headers = {
    ...init?.headers,
    Authorization: token ? `Bearer ${token}` : "",
  };

  // Wykonanie żądania do API
  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.ok) {
    return response;
  } else {
    let errorMessage = "Request failed";

    try {
      const errorBody = await response.json();
      errorMessage = errorBody.error || errorMessage;
    } catch (err) {
      console.error("Failed to parse error response:", err);
    }

    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw Error(
        "Request failed: " + response.status + " message: " + errorMessage
      );
    }
  }
}

export async function getLoggedInUser(token: string): Promise<User> {
  const response = await fetchData("/api/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(
  credentials: SignUpCredentials
): Promise<{ user: User; token: string }> {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  localStorage.setItem("token", data.token); // Zapisz token JWT po udanej rejestracji
  return data.user;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<{ user: User; token: string }> {
  const response = await fetchData("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  localStorage.setItem("token", data.token); // Zapisz token JWT po udanym logowaniu
  return data.user;
}

export async function logout(token: string) {
  await fetchData("/api/users/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function fetchNotes(token: string): Promise<Note[]> {
  const response = await fetchData("/api/notes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(
  note: NoteInput,
  token: string
): Promise<Note> {
  const response = await fetchData("/api/notes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  return response.json();
}

export async function deleteNote(noteId: string, token: string) {
  await fetchData("/api/notes/" + noteId, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function updateNote(
  noteId: string,
  note: NoteInput,
  token: string
): Promise<Note> {
  const response = await fetchData("/api/notes/" + noteId, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  return response.json();
}
