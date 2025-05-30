import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
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
  const [showLoginPage, setShowLoginPage] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const user = await NotesApi.getLoggedInUser(token);
          setLoggedInUser(user);
        } else {
          setShowLoginPage(true);
        }
      } catch (error) {
        setShowLoginPage(true);
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        {showLoginPage && !loggedInUser ? (
          <LoginPage
            onLoginSuccessful={(user: User, token: string) => {
              setLoggedInUser(user);
              localStorage.setItem("token", token);
              setShowLoginPage(false);
            }}
            onSignUpClicked={() => setShowSignUpModal(true)}
          />
        ) : (
          <>
            <NavBar
              loggedInUser={loggedInUser}
              onLogInClicked={() => setShowLoginPage(true)}
              onSignUpClicked={() => setShowSignUpModal(true)}
              onLogoutSuccessful={() => {
                setLoggedInUser(null);
                localStorage.removeItem("token");
                setShowLoginPage(true);
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
          </>
        )}
        {showSignUpModal && (
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onSignUpSuccesful={(user: User, token: string) => {
              setLoggedInUser(user);
              localStorage.setItem("token", token);
              setShowSignUpModal(false);
              setShowLoginPage(false);
            }}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
