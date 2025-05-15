import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { Alert, Box, Button, Modal } from "@mui/material";
import TextInputField from "./form/TextInputField";

import styleUtils from "../styles/utils.module.css";
import { useState } from "react";
import { UnauthorizedError } from "../errors/http_errors";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface LoginModalProps {
  onDismiss: () => void;
  onLoginSuccessful: (user: User, token: string) => void;
}

const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  async function onSubmit(credentials: LoginCredentials) {
    try {
      const { user, token } = await NotesApi.login(credentials);
      onLoginSuccessful(user, token);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.error(error);
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
        {errorText && <Alert severity="error">{errorText}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.email}
          />
          <TextInputField
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.password}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className={styleUtils.width100}
          >
            Log In
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default LoginModal;
