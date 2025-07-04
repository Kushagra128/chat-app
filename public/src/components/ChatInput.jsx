import React, { useState, useRef, useEffect } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatInput({ handleSendMsg }) {
	const [msg, setMsg] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const emojiRef = useRef();

	const handleEmojiPickerhideShow = () => {
		setShowEmojiPicker((prev) => !prev);
	};

	const handleEmojiClick = (event, emojiObject) => {
		let message = msg;
		message += emojiObject.emoji;
		setMsg(message);
	};

	const sendChat = (event) => {
		event.preventDefault();
		if (msg.length > 0) {
			handleSendMsg(msg);
			setMsg("");
		}
	};

	// Close emoji picker when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (
				emojiRef.current &&
				!emojiRef.current.contains(event.target) &&
				showEmojiPicker
			) {
				setShowEmojiPicker(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showEmojiPicker]);

	return (
		<Container>
			<div className="button-container">
				<div className="emoji" ref={emojiRef}>
					<motion.button
						type="button"
						aria-label="Show emoji picker"
						whileTap={{ scale: 0.85 }}
						className="emoji-btn"
						onClick={handleEmojiPickerhideShow}
					>
						<BsEmojiSmileFill />
					</motion.button>
					<AnimatePresence>
						{showEmojiPicker && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.2 }}
								className="emoji-picker-wrapper"
							>
								<Picker
									onEmojiClick={handleEmojiClick}
									disableAutoFocus={true}
									theme="dark"
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
			<form className="input-container" onSubmit={sendChat}>
				<label htmlFor="chat-input" className="visually-hidden">
					Type your message
				</label>
				<input
					id="chat-input"
					type="text"
					placeholder="Type your message here"
					onChange={(e) => setMsg(e.target.value)}
					value={msg}
					autoComplete="off"
				/>
				<motion.button
					type="submit"
					whileTap={{ scale: 0.9 }}
					className="send-btn"
					aria-label="Send message"
				>
					<IoMdSend />
				</motion.button>
			</form>
		</Container>
	);
}
const Container = styled.div`
	display: grid;
	align-items: center;
	grid-template-columns: 5% 95%;
	background-color: #080420;
	padding: 0 2rem;
	@media screen and (max-width: 720px) {
		padding: 0 0.5rem;
	}
	.button-container {
		display: flex;
		align-items: center;
		color: white;
		gap: 1rem;
		.emoji {
			position: relative;
			.emoji-btn {
				background: none;
				border: none;
				padding: 0;
				margin: 0;
				cursor: pointer;
				display: flex;
				align-items: center;
				svg {
					font-size: 1.7rem;
					color: #ffff00c8;
					transition: color 0.2s;
				}
				&:hover svg {
					color: #ffe066;
				}
			}
			.emoji-picker-wrapper {
				position: absolute;
				top: -350px;
				left: 0;
				z-index: 10;
				background-color: #080420;
				box-shadow: 0 5px 10px #9a86f3;
				border-color: #9a86f3;
				border-radius: 1rem;
				.emoji-picker-react {
					background: #181a20 !important;
					border-radius: 1rem !important;
					box-shadow: 0 5px 10px #9a86f3 !important;
					border: 1px solid #4e0eff !important;
				}
				.emoji-scroll-wrapper::-webkit-scrollbar {
					background-color: #080420;
					width: 5px;
					&-thumb {
						background-color: #9a86f3;
					}
				}
				.emoji-categories {
					button {
						filter: contrast(0);
					}
				}
				.emoji-search {
					background-color: transparent;
					border-color: #9a86f3;
				}
				.emoji-group:before {
					background-color: #080420;
				}
			}
		}
	}
	.input-container {
		width: 100%;
		border-radius: 2rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		background-color: #ffffff34;
		padding: 0.3rem 0.7rem;
		@media screen and (max-width: 720px) {
			gap: 0.5rem;
			padding: 0.2rem 0.3rem;
		}
		input {
			width: 90%;
			height: 2.2rem;
			background-color: transparent;
			color: white;
			border: none;
			padding-left: 1rem;
			font-size: 1.1rem;
			&::selection {
				background-color: #9a86f3;
			}
			&:focus {
				outline: none;
			}
		}
		.send-btn {
			padding: 0.3rem 1.2rem;
			border-radius: 2rem;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #9a86f3;
			border: none;
			transition: background 0.2s;
			@media screen and (max-width: 720px) {
				padding: 0.3rem 0.7rem;
				svg {
					font-size: 1.2rem;
				}
			}
			svg {
				font-size: 1.7rem;
				color: white;
			}
			&:hover {
				background-color: #6c47ff;
			}
			&:focus {
				background-color: #997af0;
			}
		}
	}
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
`;
