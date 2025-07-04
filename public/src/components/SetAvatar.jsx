import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { css } from "styled-components";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import { motion } from "framer-motion";

export default function SetAvatar() {
	const navigate = useNavigate();
	const [avatars, setAvatars] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedAvatar, setSelectedAvatar] = useState(undefined);
	const toastOptions = {
		position: "bottom-right",
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: "dark",
	};

	useEffect(() => {
		if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
			navigate("/login");
	}, []);

	const setProfilePicture = async () => {
		if (selectedAvatar === undefined) {
			toast.error("Please select an avatar", toastOptions);
		} else {
			const user = await JSON.parse(
				localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
			);

			const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
				image: avatars[selectedAvatar],
			});

			if (data.isSet) {
				user.isAvatarImageSet = true;
				user.avatarImage = data.image;
				localStorage.setItem(
					process.env.REACT_APP_LOCALHOST_KEY,
					JSON.stringify(user)
				);
				navigate("/");
			} else {
				toast.error("Error setting avatar. Please try again.", toastOptions);
			}
		}
	};

	useEffect(() => {
		const fetchAvatars = async () => {
			const data = [];
			try {
				for (let i = 0; i < 4; i++) {
					const randomSeed = Math.round(Math.random() * 1000);
					// Using DiceBear Avatars API - free and no API key needed
					const avatarUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${randomSeed}`;
					const response = await axios.get(avatarUrl);
					// Fix the encoding issue by properly handling UTF-8 characters
					const base64data = window.btoa(
						unescape(encodeURIComponent(response.data))
					);
					data.push(base64data);
				}
				setAvatars(data);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching avatars:", error);
				toast.error("Failed to load avatars. Please try again.", toastOptions);
			}
		};

		fetchAvatars();
	}, []);

	return (
		<>
			{isLoading ? (
				<StyledContainer>
					<div className="loader-container">
						<img src={loader} alt="loader" className="loader" />
					</div>
				</StyledContainer>
			) : (
				<StyledContainer>
					<motion.div
						className="content"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						<div className="title-container">
							<h1>Pick an Avatar as your profile picture</h1>
						</div>
						<div className="avatars">
							{avatars.map((avatar, index) => {
								return (
									<motion.div
										key={index}
										className={`avatar-wrapper${
											selectedAvatar === index ? " selected" : ""
										}`}
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
									>
										<img
											src={`data:image/svg+xml;base64,${avatar}`}
											alt={`avatar-${index}`}
											onClick={() => setSelectedAvatar(index)}
											className="avatar-img"
										/>
									</motion.div>
								);
							})}
						</div>
						<button onClick={setProfilePicture} className="set-avatar-btn">
							Set as Profile Picture
						</button>
					</motion.div>
					<ToastContainer />
				</StyledContainer>
			)}
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
	background-color: #131324;
	.loader-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}
	.loader {
		max-width: 100px;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}
	.title-container h1 {
		color: white;
		font-size: 1.5rem;
		text-align: center;
		margin-bottom: 1rem;
	}
	.avatars {
		display: flex;
		gap: 2rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	.avatar-wrapper {
		border: 4px solid transparent;
		padding: 0.5rem;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: border 0.3s;
		background: rgba(255, 255, 255, 0.05);
		&.selected {
			border-color: #4e0eff;
			background: rgba(78, 14, 255, 0.1);
		}
	}
	.avatar-img {
		height: 6rem;
		width: 6rem;
		border-radius: 50%;
		cursor: pointer;
		transition: box-shadow 0.3s;
		box-shadow: 0 2px 8px rgba(78, 14, 255, 0.1);
	}
	.set-avatar-btn {
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
	@media (max-width: 600px) {
		.content {
			gap: 1rem;
			max-width: 98vw;
		}
		.avatars {
			gap: 1rem;
		}
		.avatar-img {
			height: 4rem;
			width: 4rem;
		}
	}
`;
