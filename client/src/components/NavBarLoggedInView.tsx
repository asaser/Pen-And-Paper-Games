import { Button } from "@mui/material";
import { User } from "../models/user";
import * as NotesApi from "../network/notes_api";

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({user, onLogoutSuccessful}: NavBarLoggedInViewProps) => {
    
    async function logout() {
        try {
            await NotesApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }
    return (
        <>
            <input style={{color: "#FFF"}}>
                Signed in as: {user.username}
            </input>
            <Button onClick={logout} sx={{ my: 2, color: 'white', display: 'block' }}>
                Log out
            </Button>
        </>
    );
}
 
export default NavBarLoggedInView;