import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
import { User } from "../models/user";
import NotFoundPage from "./NotFoundPage";

interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  return <>{loggedInUser ? <NotesPageLoggedInView /> : <NotFoundPage />}</>;
};

export default NotesPage;
