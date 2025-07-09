// @ts-ignore
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../Services/auth";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";



const LoginForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await loginUser(username, password);
            if (response.access_token) {
                document.cookie = `access_token=${response.access_token}; path=/; secure; samesite=strict`;
                document.cookie = `token_type=Bearer; path=/; secure; samesite=strict`;
                navigate("/home");
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(`Login failed: ${err.message}`);
            } else {
                setError('Login failed: Unknown error');
            }
        }
    };


    return (
        <div style={styles.formContainer}>
            <h2 style={styles.title}>Log In</h2>
            <form onSubmit={handleLogin} style={styles.form}>
                <div style={styles.fieldContainer}>
                    <label htmlFor="username" style={styles.label}>
                        Username
                    </label>
                    <TextField
                        id="username"
                        type="text"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div style={styles.fieldContainer}>
                  <label htmlFor="password" style={styles.label}>
                    Password
                  </label>
                  <TextField
                    id="password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.loginButton}>
                        Log In
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    formContainer: {
        maxWidth: "400px",
        margin: "60px auto",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "white",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    fieldContainer: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: "5px",
        fontWeight: "600",
        color: "#555",
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    error: {
        color: "red",
        textAlign: "center",
        fontSize: "14px",
        marginTop: "5px",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "20px",
    },
    loginButton: {
        backgroundColor: "#007BFF",
        color: "white",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "16px",
    },
    registerButton: {
        backgroundColor: "white",
        color: "#007BFF",
        border: "2px solid #007BFF",
        padding: "12px",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default LoginForm;