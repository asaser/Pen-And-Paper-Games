// TODO - change styling and add styling dedicated to Sign Up Modal

import { useForm } from "react-hook-form";
import { User } from "../../models/user";
import { SignUpCredentials } from "../../network/notes_api";
import * as NotesApi from "../../network/notes_api";
import { Alert, Button } from "@mui/material";
import TextInputField from "../Form/TextInputField";

import styles from "./LoginAndSignUpPage.module.css";
import logo from "../../logo.svg";
import { useState } from "react";
import { ConflictError } from "../../errors/http_errors";

interface SignUpPageProps {
  onDismiss: () => void;
  onSignUpSuccesful: (user: User, token: string) => void;
}

const SignUpPage = ({ onDismiss, onSignUpSuccesful }: SignUpPageProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  async function onSubmit(credentials: SignUpCredentials) {
    try {
      const { user, token } = await NotesApi.signUp(credentials);
      localStorage.setItem("token", token);
      onSignUpSuccesful(user, token);
    } catch (error) {
      if (error instanceof ConflictError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.log(error);
    }
  }

  function handleGoogleSignUp() {
    alert("Google sign up not implemented");
  }

  return (
    <div className={styles.loginPageRoot}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" className={styles.applicationLogo} />
          <div>Pen & Paper Games</div>
        </div>
        <div className={styles.signupText}>Create your account</div>
        {errorText && <Alert severity="error">{errorText}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <TextInputField
            name="username"
            label="Username"
            type="text"
            placeholder="Username"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.username}
            className={styles.inputField}
          />
          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.email}
            className={styles.inputField}
          />
          <TextInputField
            name="password"
            label="Password"
            type="password"
            placeholder="Password"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.password}
            className={styles.inputField}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className={styles.loginButton}
          >
            Sign Up
          </Button>
        </form>
        <div className={styles.orDivider}>
          <div className={styles.orDividerLine}></div>
          <div className={styles.orDividerText}>or</div>
          <div className={styles.orDividerLine}></div>
        </div>
        <button
          className={styles.googleButton}
          type="button"
          onClick={handleGoogleSignUp}
        >
          <img alt="Google" style={{ width: 20, height: 20 }} />
          Google
        </button>
        <div style={{ marginTop: 16 }}>
          <span
            role="button"
            className={styles.signupButtonText}
            onClick={onDismiss}
            tabIndex={0}
          >
            Already have an account? Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
