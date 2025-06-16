import NoteEmptyPage from "../components/NotesPage/NoteEmptyPage";
import { User } from "../models/user";
import NotFoundPage from "./NotFoundPage";

interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  return <>{loggedInUser ? <NoteEmptyPage /> : <NotFoundPage />}</>;
};

export default NotesPage;
