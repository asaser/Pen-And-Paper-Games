import { useEffect, useState } from "react";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar";
import SignUpModal from "./components/SignUpModal";
import { User } from "./models/user";
import * as NotesApi from "./network/notes_api";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import UniversumPage from "./pages/UniversumPage";
import CharacterPage from "./pages/CharacterPage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await NotesApi.getLoggedInUser(token);
          setLoggedInUser(user);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onLogInClicked={() => setShowLoginModal(true)}
          onSignUpClicked={() => setShowSignUpModal(true)}
          onLogoutSuccessful={() => {
            setLoggedInUser(null);
            localStorage.removeItem("token");
          }}
        />
        <div>
          <Routes>
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route
              path="/notes"
              element={<NotesPage loggedInUser={loggedInUser} />}
            />
            <Route path="/universum" element={<UniversumPage />} />
            <Route path="/character" element={<CharacterPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </div>
        {showSignUpModal && (
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onSignUpSuccesful={(user, token) => {
              setLoggedInUser(user);
              localStorage.setItem("token", token);
              setShowSignUpModal(false);
            }}
          />
        )}
        {showLoginModal && (
          <LoginModal
            onDismiss={() => setShowLoginModal(false)}
            onLoginSuccessful={(user, token) => {
              setLoggedInUser(user);
              localStorage.setItem("token", token);
              setShowLoginModal(false);
            }}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
