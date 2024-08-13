import { Button } from "@mui/material";

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const NavBarLoggedOutView = ({ onSignUpClicked, onLoginClicked}: NavBarLoggedOutViewProps) => {
    return (
        <>
            <Button onClick={onSignUpClicked} sx={{ my: 2, color: 'white', display: 'block' }}>
                Sigh Up
            </Button>
            <Button onClick={onLoginClicked} sx={{ my: 2, color: 'white', display: 'block' }}>
                Log In
            </Button>
        </>
    );
}
 
export default NavBarLoggedOutView;