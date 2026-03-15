import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useCreateMessageMutation } from "@/slices/messages.api";
import { useParams } from "react-router-dom";

const useChatInput = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [input, setInput] = useState("");
  const [createMessage, { isLoading }] = useCreateMessageMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && input.trim() && conversationId) {
      await createMessage({ text: input.trim(), conversationId: Number(conversationId) });
      setInput("");
      // Focus input after submit
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1);
    }
  };

  return {
    input,
    handleInputChange,
    handleKeyDown,
    isLoading,
    inputRef,
  };
};

export default useChatInput;
