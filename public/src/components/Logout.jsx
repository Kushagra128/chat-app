import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import { motion } from "framer-motion";

export default function Logout() {
	const navigate = useNavigate();
	const handleClick = async () => {
		const id = await JSON.parse(
			localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
		)._id;
		const data = await axios.get(`${logoutRoute}/${id}`);
		if (data.status === 200) {
			localStorage.clear();
			navigate("/login");
		}
	};
	return (
		<Button
			as={motion.button}
			whileTap={{ scale: 0.85 }}
			whileHover={{ scale: 1.07 }}
			onClick={handleClick}
			aria-label="Logout"
		>
			<BiPowerOff />
		</Button>
	);
}

const Button = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.5rem;
	border-radius: 0.5rem;
	background-color: #9a86f3;
	border: none;
	cursor: pointer;
	transition: background 0.2s, box-shadow 0.2s;
	box-shadow: 0 1px 6px rgba(78, 14, 255, 0.08);
	svg {
		font-size: 1.3rem;
		color: #ebe7ff;
		@media screen and (max-width: 720px) {
			font-size: 1.1rem;
		}
	}
	&:hover,
	&:focus {
		background-color: #6c47ff;
		box-shadow: 0 2px 12px rgba(78, 14, 255, 0.13);
		outline: none;
	}
`;
