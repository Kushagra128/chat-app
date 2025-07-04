import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { motion, AnimatePresence } from "framer-motion";

function formatChatStartBanner(date) {
	const now = new Date();
	const msgDate = new Date(date);
	const isToday = now.toDateString() === msgDate.toDateString();
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	const isYesterday = yesterday.toDateString() === msgDate.toDateString();
	const time = msgDate.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	if (isToday) return `Today at ${time} user started the chat`;
	if (isYesterday) return `Yesterday at ${time} user started the chat`;
	return `${msgDate.toLocaleDateString()} at ${time} user started the chat`;
}

function formatMessageTime(date) {
	const msgDate = new Date(date);
	return msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatContainer({ currentChat, socket }) {
	const [messages, setMessages] = useState([]);
	const scrollRef = useRef();
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [contextMenu, setContextMenu] = useState({
		visible: false,
		x: 0,
		y: 0,
		msgIdx: null,
	});
	const [editMsgIdx, setEditMsgIdx] = useState(null);
	const [editMsgValue, setEditMsgValue] = useState("");

	useEffect(() => {
		(async () => {
			const data = await JSON.parse(
				localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
			);
			const response = await axios.post(recieveMessageRoute, {
				from: data._id,
				to: currentChat._id,
			});
			setMessages(response.data);
		})();
	}, [currentChat]);

	useEffect(() => {
		const getCurrentChat = async () => {
			if (currentChat) {
				await JSON.parse(
					localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
				)._id;
			}
		};
		getCurrentChat();
	}, [currentChat]);

	const handleSendMsg = async (msg) => {
		const data = await JSON.parse(
			localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
		);
		socket.current.emit("send-msg", {
			to: currentChat._id,
			from: data._id,
			msg,
		});
		const now = new Date();
		await axios.post(sendMessageRoute, {
			from: data._id,
			to: currentChat._id,
			message: msg,
			timestamp: now,
		});
		const msgs = [...messages];
		msgs.push({ fromSelf: true, message: msg, timestamp: now });
		setMessages(msgs);
	};

	useEffect(() => {
		if (socket.current) {
			socket.current.on("msg-recieve", (msg) => {
				setArrivalMessage({
					fromSelf: false,
					message: msg,
					timestamp: new Date(),
				});
			});
		}
	}, []);

	useEffect(() => {
		arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
	}, [arrivalMessage]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Context menu handlers
	const handleContextMenu = (e, idx) => {
		e.preventDefault();
		setContextMenu({ visible: true, x: e.clientX, y: e.clientY, msgIdx: idx });
	};
	const handleLongPress = (idx) => {
		setContextMenu({ visible: true, x: 100, y: 100, msgIdx: idx }); // fallback position
	};
	const handleCloseMenu = () =>
		setContextMenu({ visible: false, x: 0, y: 0, msgIdx: null });
	const handleEdit = () => {
		setEditMsgIdx(contextMenu.msgIdx);
		setEditMsgValue(messages[contextMenu.msgIdx].message);
		handleCloseMenu();
	};
	const handleUnsend = () => {
		// Stub: Remove message locally
		const idx = contextMenu.msgIdx;
		setMessages((msgs) => msgs.filter((_, i) => i !== idx));
		handleCloseMenu();
	};
	const handleEditChange = (e) => setEditMsgValue(e.target.value);
	const handleEditSave = () => {
		setMessages((msgs) =>
			msgs.map((msg, i) =>
				i === editMsgIdx ? { ...msg, message: editMsgValue } : msg
			)
		);
		setEditMsgIdx(null);
		setEditMsgValue("");
	};
	const handleEditCancel = () => {
		setEditMsgIdx(null);
		setEditMsgValue("");
	};

	// Detect long press for mobile
	let longPressTimer = null;
	const handleTouchStart = (idx) => {
		longPressTimer = setTimeout(() => handleLongPress(idx), 600);
	};
	const handleTouchEnd = () => {
		clearTimeout(longPressTimer);
	};

	const firstMsg = messages[0];
	const firstMsgTime =
		firstMsg && (firstMsg.timestamp || firstMsg.createdAt || new Date());

	return (
		<Container onClick={handleCloseMenu}>
			<div className="chat-header">
				<div className="user-details">
					<div className="avatar">
						<img
							src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
							alt="User avatar"
						/>
					</div>
					<div className="username">
						<h3>{currentChat.username}</h3>
					</div>
				</div>
				<Logout />
			</div>
			<div className="chat-messages">
				{firstMsg && (
					<div className="chat-start-banner">
						{formatChatStartBanner(firstMsgTime)}
					</div>
				)}
				<AnimatePresence initial={false}>
					{messages.map((message, idx) => (
						<motion.div
							ref={scrollRef}
							key={uuidv4()}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.2, delay: idx * 0.02 }}
						>
							<div
								className={`message ${
									message.fromSelf ? "sended" : "recieved"
								}`}
								onContextMenu={(e) => handleContextMenu(e, idx)}
								onTouchStart={() => handleTouchStart(idx)}
								onTouchEnd={handleTouchEnd}
							>
								<div className="content">
									{editMsgIdx === idx ? (
										<div className="edit-msg-box">
											<input value={editMsgValue} onChange={handleEditChange} />
											<button onClick={handleEditSave}>Save</button>
											<button onClick={handleEditCancel}>Cancel</button>
										</div>
									) : (
										<>
											<p>{message.message}</p>
											<div className="msg-time">
												{formatMessageTime(
													message.timestamp || message.createdAt || new Date()
												)}
											</div>
										</>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
				{contextMenu.visible && (
					<div
						className="context-menu"
						style={{ top: contextMenu.y, left: contextMenu.x }}
						onClick={(e) => e.stopPropagation()}
					>
						<button onClick={handleEdit}>Edit</button>
						<button onClick={handleUnsend}>Unsend</button>
					</div>
				)}
			</div>
			<ChatInput handleSendMsg={handleSendMsg} />
		</Container>
	);
}

const Container = styled.div`
	display: grid;
	grid-template-rows: 10% 80% 10%;
	gap: 0.1rem;
	overflow: hidden;
	@media screen and (max-width: 1080px) {
		grid-template-rows: 15% 70% 15%;
	}
	@media screen and (max-width: 720px) {
		grid-template-rows: 12% 73% 15%;
	}
	.chat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 2rem;
		@media screen and (max-width: 720px) {
			padding: 0 0.7rem;
		}
		.user-details {
			display: flex;
			align-items: center;
			gap: 1rem;
			.avatar {
				img {
					height: 2.5rem;
					@media screen and (max-width: 720px) {
						height: 2rem;
					}
				}
			}
			.username {
				h3 {
					color: white;
					font-size: 1.1rem;
					@media screen and (max-width: 720px) {
						font-size: 1rem;
					}
				}
			}
		}
	}
	.chat-messages {
		padding: 1rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow: auto;
		@media screen and (max-width: 720px) {
			padding: 0.5rem 0.3rem;
			gap: 0.5rem;
		}
		&::-webkit-scrollbar {
			width: 0.2rem;
			&-thumb {
				background-color: #ffffff39;
				width: 0.1rem;
				border-radius: 1rem;
			}
		}
		.chat-start-banner {
			align-self: center;
			background: #23234a;
			color: #fff;
			font-size: 0.95rem;
			padding: 0.4rem 1.2rem;
			border-radius: 1.2rem;
			margin-bottom: 0.7rem;
			box-shadow: 0 2px 8px rgba(78, 14, 255, 0.08);
			letter-spacing: 0.5px;
		}
		.message {
			display: flex;
			align-items: center;
			.content {
				max-width: 60vw;
				overflow-wrap: break-word;
				padding: 0.8rem 1.1rem;
				font-size: 1.05rem;
				border-radius: 1rem;
				color: #d1d1d1;
				@media screen and (max-width: 720px) {
					max-width: 85vw;
					font-size: 0.98rem;
					padding: 0.6rem 0.7rem;
				}
				.edit-msg-box {
					display: flex;
					gap: 0.5rem;
					input {
						flex: 1;
						padding: 0.2rem 0.5rem;
						border-radius: 0.4rem;
						border: 1px solid #4e0eff;
					}
					button {
						background: #4e0eff;
						color: #fff;
						border: none;
						border-radius: 0.3rem;
						padding: 0.2rem 0.7rem;
						font-size: 0.95rem;
						cursor: pointer;
						&:hover {
							background: #6c47ff;
						}
					}
				}
				.msg-time {
					font-size: 0.8rem;
					color: #bdbdbd;
					margin-top: 0.3rem;
					text-align: right;
				}
			}
		}
		.sended {
			justify-content: flex-end;
			.content {
				background-color: #4f04ff21;
			}
		}
		.recieved {
			justify-content: flex-start;
			.content {
				background-color: #9900ff20;
			}
		}
		.context-menu {
			position: fixed;
			z-index: 100;
			background: #23234a;
			color: #fff;
			border-radius: 0.7rem;
			box-shadow: 0 2px 12px rgba(78, 14, 255, 0.13);
			padding: 0.5rem 0.7rem;
			display: flex;
			flex-direction: column;
			gap: 0.3rem;
			button {
				background: none;
				color: #fff;
				border: none;
				font-size: 1rem;
				padding: 0.2rem 0.7rem;
				border-radius: 0.3rem;
				cursor: pointer;
				text-align: left;
				&:hover {
					background: #4e0eff;
				}
			}
		}
	}
`;
