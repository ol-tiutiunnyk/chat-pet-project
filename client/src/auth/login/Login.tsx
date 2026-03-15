
import React from "react";
import { Link } from "react-router-dom";
import "../auth-form.css";
import useLoginForm from "./use-login-form";


const Login: React.FC = () => {
  const {
    handleSubmit,
    isLoading,
    isError,
    error,
  } = useLoginForm();

  return (
    <form className="auth-form" role="form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      <div className="auth-link-container">
        <span>New user? </span>
        <Link to="/register">Create an account</Link>
      </div>
      {isError && (
        <div className="error">{error}</div>
      )}
    </form>
  );
};

export default Login;
