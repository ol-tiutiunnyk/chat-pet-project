import { useState, SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/slices/auth.api";
import { mapApiErrorToString } from "@/core";

const useLoginForm = () => {
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");

    const formData = new FormData(event.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    if (!raw.username || !raw.password) {
      setLocalError("Username and password are required");
      return;
    }

    const username = raw.username.toString().trim();
    const password = raw.password.toString().trim();

    const { error: loginError } = await login({ username, password });
    if (!loginError) {
      navigate("/");
    }
  };

  return {
    handleSubmit,
    isLoading,
    isError: isError || Boolean(localError),
    error: isError ? mapApiErrorToString(error) : (localError || "Login failed"),
  };
};

export default useLoginForm;
