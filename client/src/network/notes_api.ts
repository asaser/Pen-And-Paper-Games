import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

const GRAPHQL_ENDPOINT = "/graphql";

async function fetchGraphQL(
  query: string,
  variables: any = {},
  token?: string
) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json();
  if (body.errors && body.errors.length > 0) {
    const errorMessage = body.errors[0].message;
    if (errorMessage.toLowerCase().includes("unauth")) {
      throw new UnauthorizedError(errorMessage);
    } else if (errorMessage.toLowerCase().includes("taken")) {
      throw new ConflictError(errorMessage);
    } else {
      throw Error("GraphQL error: " + errorMessage);
    }
  }
  return body.data;
}

export async function getLoggedInUser(token: string): Promise<User> {
  const query = `query { currentUser { id username email } }`;
  const data = await fetchGraphQL(query, {}, token);
  return data.currentUser;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(
  credentials: SignUpCredentials
): Promise<{ user: User; token: string }> {
  const mutation = `mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) { id username email }
    login(email: $email, password: $password)
  }`;
  const data = await fetchGraphQL(mutation, credentials);
  return { user: data.signUp, token: data.login };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<{ user: User; token: string }> {
  const mutation = `mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }`;
  const data = await fetchGraphQL(mutation, credentials);
  // After login, fetch user info using 'currentUser'
  const userQuery = `query { currentUser { id username email } }`;
  const userData = await fetchGraphQL(userQuery, {}, data.login);
  return { user: userData.currentUser, token: data.login };
}

export async function logout(token: string) {
  // No-op for GraphQL JWT, just remove token on client
}

export async function fetchNotes(token: string): Promise<Note[]> {
  const query = `query { notes { id title text userId } }`;
  const data = await fetchGraphQL(query, {}, token);
  return data.notes;
}

export interface NoteInput {
  title: string;
  text?: string;
}

export async function createNote(
  note: NoteInput,
  token: string
): Promise<Note> {
  const mutation = `mutation CreateNote($title: String!, $text: String) {
    createNote(title: $title, text: $text) { id title text userId }
  }`;
  const data = await fetchGraphQL(mutation, note, token);
  return data.createNote;
}

export async function deleteNote(noteId: string, token: string) {
  const mutation = `mutation DeleteNote($id: ID!) {
    deleteNote(id: $id)
  }`;
  await fetchGraphQL(mutation, { id: noteId }, token);
}

export async function updateNote(
  noteId: string,
  note: NoteInput,
  token: string
): Promise<Note> {
  const mutation = `mutation UpdateNote($id: ID!, $title: String, $text: String) {
    updateNote(id: $id, title: $title, text: $text) { id title text userId }
  }`;
  // Only include defined fields in variables
  const variables: Record<string, any> = { id: noteId };
  if (typeof note.title !== "undefined") variables.title = note.title;
  if (typeof note.text !== "undefined") variables.text = note.text;
  const data = await fetchGraphQL(mutation, variables, token);
  return data.updateNote;
}
