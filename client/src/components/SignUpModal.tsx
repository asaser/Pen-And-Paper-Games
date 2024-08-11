import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccesful: (user: User) => void,
}

const SignUpModal = ({ onDismiss, onSignUpSuccesful}: SignUpModalProps) => {
    const { register, handleSubmit, formState: {errors, isSubmitting }} = useForm<SignUpCredentials>();
    
    async function onSubmit(credentials: SignUpCredentials) {
        try {
            
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }
    return (
        <></>
    );
}