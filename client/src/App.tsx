import { useEffect, useState } from "react";
import LoginPage from "./components/Auth/LoginPage";
import NavBar from "./components/Navbar/NavBar";
import SignUpPage from "./components/Auth/SignUpPage";
import { User } from "./models/user";
import * as NotesApi from "./network/notes_api";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import UniversumPage from "./pages/UniversumPage";
import CharacterPage from "./pages/CharacterPage";
import DicesPage from "./pages/DicesPage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await NotesApi.getLoggedInUser(token);
          setLoggedInUser(user);
        }
      } catch (error) {
        setLoggedInUser(null);
        console.error(error);
      } finally {
        setIsAuthLoading(false);
      }
    }
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    if (
      !isAuthLoading &&
      !loggedInUser &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      navigate("/login", { replace: true });
    }
  }, [loggedInUser, location.pathname, navigate, isAuthLoading]);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!isAuthPage && (
        <NavBar
          loggedInUser={loggedInUser}
          onLogoutSuccessful={() => {
            setLoggedInUser(null);
            localStorage.removeItem("token");
            navigate("/login");
          }}
        />
      )}
      <div
        style={
          !isAuthPage
            ? {
                marginLeft: 240,
                minHeight: "100vh",
                background: "#fff",
              }
            : undefined
        }
      >
        <Routes>
          <Route
            path="/login"
            element={
              loggedInUser ? (
                <Navigate to="/notes" replace />
              ) : (
                <LoginPage
                  onLoginSuccessful={(user: User, token: string) => {
                    setLoggedInUser(user);
                    localStorage.setItem("token", token);
                    navigate("/notes");
                  }}
                  onSignUpClicked={() => navigate("/register")}
                />
              )
            }
          />
          <Route
            path="/register"
            element={
              loggedInUser ? (
                <Navigate to="/notes" replace />
              ) : (
                <SignUpPage
                  onSignUpSuccesful={(user: User, token: string) => {
                    setLoggedInUser(user);
                    localStorage.setItem("token", token);
                    navigate("/notes");
                  }}
                  onDismiss={() => navigate("/login")}
                />
              )
            }
          />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route
            path="/notes"
            element={<NotesPage loggedInUser={loggedInUser} />}
          />
          <Route path="/universum" element={<UniversumPage />} />
          <Route path="/character" element={<CharacterPage />} />
          <Route path="/dices" element={<DicesPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
