import { useState, SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/slices/auth.api";
import { mapApiErrorToString } from "@/core";

const useRegisterForm = () => {
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const [register, { isLoading, isError, error }] = useRegisterMutation();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");
    const formData = new FormData(event.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    if (!raw.username || !raw.password) {
      setLocalError("Username and password are required");
      return;
    }
    if (raw.password !== raw.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    const username = raw.username.toString().trim();
    const password = raw.password.toString().trim();

    const { error: registerError } = await register({ username, password });
    if (!registerError) {
      navigate("/login");
    }
  };

  return {
    handleSubmit,
    isLoading,
    isError: isError || Boolean(localError),
    error: isError ? mapApiErrorToString(error) : (localError || "Registration failed"),
    setLocalError,
  };
};

export default useRegisterForm;
