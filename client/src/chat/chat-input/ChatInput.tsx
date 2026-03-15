import "./chat-input.css";

import { FC } from "react";
import useChatInput from "./use-chat-input";
import { useGetUserQuery } from "@/slices/auth.api";
import "@/styles/skeleton.css";


const ChatInput: FC = () => {
	const { input, handleInputChange, handleKeyDown, isLoading, inputRef } = useChatInput();
	const { isLoading: isUserLoading } = useGetUserQuery();

	if (isUserLoading) {
		return <div data-testid="skeleton-input" className="skeleton skeleton-input" />;
	}

	return (
		<input
			ref={inputRef}
			className="chat-input"
			type="text"
			placeholder="Type a message..."
			value={input}
			onChange={handleInputChange}
			onKeyDown={handleKeyDown}
			disabled={isLoading}
		/>
	);
};

export default ChatInput;
