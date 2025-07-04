import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { motion } from "framer-motion";

export default function Chat() {
	const navigate = useNavigate();
	const socket = useRef();
	const [contacts, setContacts] = useState([]);
	const [currentChat, setCurrentChat] = useState(undefined);
	const [currentUser, setCurrentUser] = useState(undefined);
	useEffect(() => {
		(async () => {
			if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
				navigate("/login");
			} else {
				setCurrentUser(
					await JSON.parse(
						localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
					)
				);
			}
		})();
	}, []);
	useEffect(() => {
		if (currentUser) {
			socket.current = io(host);
			socket.current.emit("add-user", currentUser._id);
		}
	}, [currentUser]);

	useEffect(() => {
		(async () => {
			if (currentUser) {
				if (currentUser.isAvatarImageSet) {
					const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
					setContacts(data.data);
				} else {
					navigate("/setAvatar");
				}
			}
		})();
	}, [currentUser]);
	const handleChatChange = (chat) => {
		setCurrentChat(chat);
	};
	return (
		<>
			<Container>
				<motion.div
					className="container"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					<Contacts contacts={contacts} changeChat={handleChatChange} />
					{currentChat === undefined ? (
						<Welcome />
					) : (
						<ChatContainer currentChat={currentChat} socket={socket} />
					)}
				</motion.div>
			</Container>
		</>
	);
}

const Container = styled.div`
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 1rem;
	align-items: center;
	background: linear-gradient(135deg, #181a20 0%, #23234a 100%);
	.container {
		height: 85vh;
		width: 85vw;
		background: rgba(24, 26, 32, 0.7);
		backdrop-filter: blur(12px);
		display: grid;
		grid-template-columns: 25% 75%;
		border-radius: 2.2rem;
		box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
		overflow: hidden;
		border: 1.5px solid rgba(78, 14, 255, 0.18);
		@media screen and (min-width: 720px) and (max-width: 1080px) {
			grid-template-columns: 35% 65%;
		}
		@media screen and (max-width: 720px) {
			width: 99vw;
			height: 99vh;
			grid-template-columns: 100%;
			grid-template-rows: 40% 60%;
			border-radius: 1rem;
		}
	}
`;
