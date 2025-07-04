import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { motion } from "framer-motion";

export default function Contacts({ contacts, changeChat }) {
	const [currentUserName, setCurrentUserName] = useState(undefined);
	const [currentUserImage, setCurrentUserImage] = useState(undefined);
	const [currentSelected, setCurrentSelected] = useState(undefined);
	useEffect(() => {
		(async () => {
			const data = await JSON.parse(
				localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
			);
			setCurrentUserName(data.username);
			setCurrentUserImage(data.avatarImage);
		})();
	}, []);
	const changeCurrentChat = (index, contact) => {
		setCurrentSelected(index);
		changeChat(contact);
	};
	return (
		<>
			{currentUserImage && (
				<Container>
					<div className="brand">
						<img src={Logo} alt="logo" />
						<h3>Talky</h3>
					</div>
					<div className="contacts">
						{contacts.map((contact, index) => {
							return (
								<motion.div
									key={contact._id}
									className={`contact${
										index === currentSelected ? " selected" : ""
									}`}
									onClick={() => changeCurrentChat(index, contact)}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									transition={{ type: "spring", stiffness: 300 }}
									tabIndex={0}
									aria-label={`Select chat with ${contact.username}`}
								>
									<div className="avatar">
										<img
											src={`data:image/svg+xml;base64,${contact.avatarImage}`}
											alt={`${contact.username} avatar`}
										/>
									</div>
									<div className="username">
										<h3>{contact.username}</h3>
									</div>
								</motion.div>
							);
						})}
					</div>
					<div className="current-user">
						<div className="avatar">
							<img
								src={`data:image/svg+xml;base64,${currentUserImage}`}
								alt="Your avatar"
							/>
						</div>
						<div className="username">
							<h2>{currentUserName}</h2>
						</div>
					</div>
				</Container>
			)}
		</>
	);
}
const Container = styled.div`
	display: grid;
	grid-template-rows: 10% 75% 15%;
	overflow: hidden;
	background-color: #080420;
	@media screen and (max-width: 720px) {
		grid-template-rows: 12% 73% 15%;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: center;
		img {
			height: 2rem;
		}
		h3 {
			color: white;
			text-transform: uppercase;
			font-size: 1.2rem;
			letter-spacing: 1px;
		}
	}
	.contacts {
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: auto;
		gap: 0.8rem;
		padding: 0.5rem 0.2rem;
		@media screen and (max-width: 720px) {
			gap: 0.4rem;
			padding: 0.3rem 0.1rem;
		}
		&::-webkit-scrollbar {
			width: 0.2rem;
			&-thumb {
				background-color: #ffffff39;
				width: 0.1rem;
				border-radius: 1rem;
			}
		}
		.contact {
			background-color: #ffffff34;
			min-height: 4.2rem;
			cursor: pointer;
			width: 95%;
			border-radius: 0.5rem;
			padding: 0.4rem 0.7rem;
			display: flex;
			gap: 1rem;
			align-items: center;
			transition: background 0.3s, box-shadow 0.3s;
			outline: none;
			box-shadow: 0 1px 6px rgba(78, 14, 255, 0.04);
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
					font-size: 1.05rem;
					@media screen and (max-width: 720px) {
						font-size: 0.95rem;
					}
				}
			}
			&:hover,
			&:focus {
				background-color: #9a86f3;
				box-shadow: 0 2px 12px rgba(78, 14, 255, 0.13);
			}
		}
		.selected {
			background-color: #9a86f3;
			box-shadow: 0 2px 12px rgba(78, 14, 255, 0.13);
		}
	}

	.current-user {
		background-color: #0d0d30;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.2rem;
		padding: 0.7rem 0;
		.avatar {
			img {
				height: 3rem;
				max-inline-size: 100%;
				@media screen and (max-width: 720px) {
					height: 2.2rem;
				}
			}
		}
		.username {
			h2 {
				color: white;
				font-size: 1.1rem;
				@media screen and (max-width: 720px) {
					font-size: 0.95rem;
				}
			}
		}
		@media screen and (max-width: 720px) {
			gap: 0.5rem;
			padding: 0.4rem 0;
		}
	}
`;
