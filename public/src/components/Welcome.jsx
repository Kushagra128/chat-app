import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.png";
import { motion } from "framer-motion";
export default function Welcome() {
	const [userName, setUserName] = useState("");
	useEffect(() => {
		(async () => {
			const data = await JSON.parse(
				localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
			);
			setUserName(data.username);
		})();
	}, []);
	return (
		<Container>
			<motion.img
				src={Robot}
				alt="Welcome robot"
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
				className="welcome-img"
			/>
			<motion.h1
				className="welcome-title"
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
			>
				Welcome, <span>{userName}!</span>
			</motion.h1>
			<motion.h3
				className="welcome-subtitle"
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
			>
				Please select a chat to Start messaging.
			</motion.h3>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	flex-direction: column;
	text-align: center;
	padding: 2rem 1rem;
	min-height: 60vh;
	.welcome-img {
		height: 16rem;
		max-width: 90vw;
		margin-bottom: 1.5rem;
		@media (max-width: 600px) {
			height: 8rem;
		}
	}
	.welcome-title {
		font-size: 2.2rem;
		font-weight: bold;
		margin-bottom: 1rem;
		@media (max-width: 600px) {
			font-size: 1.3rem;
		}
	}
	.welcome-subtitle {
		font-size: 1.2rem;
		font-weight: 400;
		@media (max-width: 600px) {
			font-size: 1rem;
		}
	}
	span {
		color: #4e0eff;
	}
`;
