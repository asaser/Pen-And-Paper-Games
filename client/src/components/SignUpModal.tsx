import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { Box, Modal, Typography } from "@mui/material";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccesful: (user: User) => void,
}

const SignUpModal = ({ onDismiss, onSignUpSuccesful}: SignUpModalProps) => {
    const { register, handleSubmit, formState: {errors, isSubmitting }} = useForm<SignUpCredentials>();
    
    async function onSubmit(credentials: SignUpCredentials) {
        try {
            const newUser = await NotesApi.signUp(credentials);
            onSignUpSuccesful(newUser);
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }
    return (
        <Modal
            open
            onClose={onDismiss}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Sign In
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
            </Box>
        </Modal>
    );
}

export default SignUpModal;