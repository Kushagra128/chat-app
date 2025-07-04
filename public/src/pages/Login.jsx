import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { motion } from "framer-motion";

export default function Login() {
	const navigate = useNavigate();
	const [values, setValues] = useState({ username: "", password: "" });
	const toastOptions = {
		position: "bottom-right",
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: "dark",
	};
	useEffect(() => {
		if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
			navigate("/");
		}
	}, []);

	const handleChange = (event) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	const validateForm = () => {
		const { username, password } = values;
		if (username === "") {
			toast.error("Username and Password are required.", toastOptions);
			return false;
		} else if (password === "") {
			toast.error("Username and Password are required.", toastOptions);
			return false;
		}
		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (validateForm()) {
			const { username, password } = values;
			const { data } = await axios.post(loginRoute, {
				username,
				password,
			});
			if (data.status === false) {
				toast.error(data.msg, toastOptions);
			}
			if (data.status === true) {
				localStorage.setItem(
					process.env.REACT_APP_LOCALHOST_KEY,
					JSON.stringify(data.user)
				);
				navigate("/");
			}
		}
	};

	return (
		<>
			<StyledContainer>
				<motion.form
					className="login-form"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					onSubmit={handleSubmit}
				>
					<div className="brand">
						<img src={Logo} alt="logo" />
						<h1>Talky</h1>
					</div>
					<label htmlFor="username" className="sr-only">
						Username
					</label>
					<input
						type="text"
						placeholder="Username"
						name="username"
						id="username"
						onChange={handleChange}
						autoComplete="username"
					/>
					<label htmlFor="password" className="sr-only">
						Password
					</label>
					<input
						type="password"
						placeholder="Password"
						name="password"
						id="password"
						onChange={handleChange}
						autoComplete="current-password"
					/>
					<button type="submit">Log In</button>
					<span>
						Don't have an account? <Link to="/register">Create One.</Link>
					</span>
				</motion.form>
			</StyledContainer>
			<ToastContainer />
		</>
	);
}

const StyledContainer = styled.div`
	min-height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: linear-gradient(135deg, #181a20 0%, #23234a 100%);
	padding: 1rem;
	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		background: rgba(24, 26, 32, 0.7);
		backdrop-filter: blur(12px);
		border-radius: 2rem;
		padding: 2rem 1.5rem;
		width: 100%;
		max-width: 400px;
		box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
		border: 1.5px solid rgba(78, 14, 255, 0.18);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 0.5rem;
		img {
			height: 3rem;
		}
		h1 {
			color: white;
			text-transform: uppercase;
			font-size: 1.5rem;
			font-weight: bold;
			letter-spacing: 2px;
		}
	}
	label {
		color: white;
	}
	input {
		background-color: transparent;
		padding: 0.75rem 1rem;
		border: 0.1rem solid #4e0eff;
		border-radius: 0.4rem;
		color: white;
		width: 100%;
		font-size: 1rem;
		transition: border 0.2s;
		&:focus {
			border: 0.1rem solid #997af0;
			outline: none;
		}
		&::placeholder {
			color: #bdbdbd;
		}
	}
	button {
		background-color: #4e0eff;
		color: white;
		padding: 0.75rem 2rem;
		border: none;
		font-weight: bold;
		cursor: pointer;
		border-radius: 0.4rem;
		font-size: 1rem;
		text-transform: uppercase;
		margin-top: 0.5rem;
		box-shadow: 0 2px 8px rgba(78, 14, 255, 0.1);
		transition: background 0.2s;
		&:hover {
			background-color: #6c47ff;
		}
		&:focus {
			background-color: #997af0;
		}
	}
	span {
		color: white;
		text-transform: uppercase;
		font-size: 0.9rem;
		display: block;
		text-align: center;
		margin-top: 0.5rem;
		a {
			color: #4e0eff;
			text-decoration: none;
			font-weight: bold;
			&:hover {
				text-decoration: underline;
			}
		}
	}
	@media (max-width: 500px) {
		.login-form {
			padding: 1rem 0.5rem;
			max-width: 95vw;
		}
		.brand h1 {
			font-size: 1.1rem;
		}
	}
`;
