

import React from "react";
import "../auth-form.css";
import useRegisterForm from "./use-register-form";
const Register: React.FC = () => {
  const {
    handleSubmit,
    isLoading,
    isError,
    error,
  } = useRegisterForm();
  return (
    <form className="auth-form" role="form" onSubmit={handleSubmit}>
      <h2>Register</h2>
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
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>
      {isError && (
        <div className="error">{error}</div>
      )}
    </form>
  );
};

export default Register;
