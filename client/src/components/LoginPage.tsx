import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { Alert, Button } from "@mui/material";
import TextInputField from "./form/TextInputField";
import { useState } from "react";
import { UnauthorizedError } from "../errors/http_errors";
import styles from "../styles/LoginPage.module.css";
import logo from "../logo.svg";

interface LoginPageProps {
  onLoginSuccessful: (user: User, token: string) => void;
  onSignUpClicked: () => void;
}

const LoginPage = ({ onLoginSuccessful, onSignUpClicked }: LoginPageProps) => {
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

  function handleGoogleLogin() {
    alert("Google login not implemented");
  }

  return (
    <div className={styles.loginPageRoot}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" className={styles.applicationLogo} />
          <div>Pen & Paper Games</div>
        </div>
        <div className={styles.signupText}>Don't have an account, yet?</div>
        <span
          role="button"
          className={styles.signupButtonText}
          onClick={onSignUpClicked}
          tabIndex={0}
        >
          Sign Up
        </span>
        {errorText && <Alert severity="error">{errorText}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
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
          <div
            className={styles.forgotPassword}
            tabIndex={0}
            role="button"
            onClick={() => alert("Forgot password not implemented")}
          >
            Forgot Password?
          </div>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            className={styles.loginButton}
          >
            Login
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
          onClick={handleGoogleLogin}
        >
          <img alt="Google" style={{ width: 20, height: 20 }} />
          Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
