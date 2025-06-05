import { Button } from "@mui/material";
import { User } from "../models/user";
import * as NotesApi from "../network/notes_api";
import LogoutIcon from "@mui/icons-material/Logout";

interface NavBarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({
  user,
  onLogoutSuccessful,
}: NavBarLoggedInViewProps) => {
  async function logout() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await NotesApi.logout(token);
        localStorage.removeItem("token");
        onLogoutSuccessful();
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  return (
    <>
      <Button
        onClick={logout}
        variant="contained"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <LogoutIcon />
        <span>Log out</span>
      </Button>
    </>
  );
};

export default NavBarLoggedInView;
