import { Link, useLocation } from "react-router-dom";

import { User } from "../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import styles from "../styles/NavBarVertical.module.css";
import logo from "../logo.svg";

interface NavBarProps {
  loggedInUser?: User | null;
  onSignUpClicked: () => void;
  onLogInClicked: () => void;
  onLogoutSuccessful: () => void;
}

const pages = [
  { name: "Privacy", path: "/privacy" },
  { name: "Notes", path: "/notes" },
  { name: "Universum", path: "/universum" },
  { name: "Character", path: "/character" },
];

const NavBar = ({
  loggedInUser,
  onSignUpClicked,
  onLogInClicked,
  onLogoutSuccessful,
}: NavBarProps) => {
  const location = useLocation();
  return (
    <nav className={styles.navbarContainer}>
      <div>
        <div className={styles.logoSection}>
          <img src={logo} alt="Logo" className={styles.logoImage} />
          <div className={styles.logoText}>Pen and Paper</div>
        </div>
        <div className={styles.navLinks}>
          {pages.map((page) => (
            <Link
              key={page.name}
              to={page.path}
              className={
                location.pathname === page.path
                  ? `${styles.navLink} ${styles.navLinkActive}`
                  : styles.navLink
              }
            >
              {page.name}
            </Link>
          ))}
        </div>
        <div className={styles.divider} />
      </div>
      {loggedInUser ? (
        <div style={{ width: "100%" }}>
          <div className={styles.logoutSection}>
            <NavBarLoggedInView
              user={loggedInUser}
              onLogoutSuccessful={onLogoutSuccessful}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.signedInSection}>
            Signed in as: {loggedInUser.username}
          </div>
        </div>
      ) : (
        <div className={styles.logoutSection}>
          <NavBarLoggedOutView
            onLoginClicked={onLogInClicked}
            onSignUpClicked={onSignUpClicked}
          />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
