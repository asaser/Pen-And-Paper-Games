import { TextField } from "@mui/material";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const TextInputField = ({ name, label, register, registerOptions, error, ...props}: TextInputFieldProps) => {
    return (
        <div>
            <TextField
                label={label}
                {...props}
                {...register(name, registerOptions)}
                error={!!error}
            />
            <p>
                {error?.message}
            </p>
        </div>
    );
}

export default TextInputField;