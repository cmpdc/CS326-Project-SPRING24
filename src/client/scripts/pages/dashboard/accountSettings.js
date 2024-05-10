import { goToPage } from "../../app.js";
import Toast from "../../components/toast.js";
import { addComponent, createRef, insertModal, removeModalComponent } from "../../utils.js";

const fetchUser = async () => {
	try {
		const username = localStorage.getItem("username");
		if (!username) {
			throw new Error("No username found in local storage.");
		}

		const response = await fetch(`http://127.0.0.1:3001/users/${username.replaceAll(`"`, "")}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		if (response.ok) {
			return data;
		}
	} catch (error) {
		console.error("Error fetching user", error);
		return null;
	}
};

const userData = {};

const accountSettingsModal = () => {
	const elemRef = createRef();

	const headerElem = addComponent({
		type: "h1",
		props: {
			textContent: "Account Settings",
			style: "margin-bottom: 10px;",
		},
	});

	const propertyDisplaySetting = ({ name, key, prop, allowEditing = false }) => {
		const propContainerElemRef = createRef();
		const propElemRef = createRef();
		const buttonContainerElemRef = createRef();
		const editButtonElemRef = createRef();
		const cancelEditButtonRef = createRef();

		const initialValueProp = () => {
			if (key === "avatar") {
				return addComponent({
					type: "div",
					props: {
						id: "avatar",
						style: `background-image: url("data:image/jpeg;base64,${prop}");`,
					},
				});
			} else {
				return key === "joinedDate"
					? `${new Date(prop).toLocaleDateString(undefined, {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "2-digit",
						})}`
					: prop;
			}
		};

		const handleEditButtonClick = (e) => {
			e.target.disabled = true;
			e.target.style.pointerEvents = "none";
			e.target.textContent = "Save";

			if (buttonContainerElemRef.current) {
				buttonContainerElemRef.current.appendChild(cancelEditButtonElem);
			}

			if (propElemRef.current) {
				propElemRef.current.innerHTML = "";

				let elem;
				if (key === "avatar") {
					const handleFileSelect = async (event) => {
						event.stopPropagation();
						event.preventDefault();

						const file = event.target.files[0];
						const maxSize = 100 * 1024;

						if (file) {
							if (file.size > maxSize) {
								new Toast({
									text: "File size exceeds maximum limit of 100KB. Please select a smaller file.",
								});

								return;
							}

							const reader = new FileReader();
							reader.onload = function (loadEvent) {
								const base64StringResult = loadEvent.target.result; // include full data URL
								const backgroundImageUrl = `url(${base64StringResult})`;

								const isTheSame = base64StringResult === prop;
								e.target.disabled = isTheSame;
								e.target.style.pointerEvents = isTheSame ? "none" : "all";

								propElemRef.current.querySelector("#avatar").style.backgroundImage = backgroundImageUrl;
							};

							reader.readAsDataURL(file);
						}
					};

					const dragDropPlaceholder = addComponent({
						type: "div",
						props: {
							classList: ["dragDrop"],
						},
					});

					const fileInput = addComponent({
						type: "input",
						props: {
							id: "fileInput",
							type: "file",
							accept: "image/png, image/jpeg",
							onChange: handleFileSelect,
						},
					});

					elem = addComponent({
						type: "div",
						props: {
							classList: ["avatarEditor"],
							children: [initialValueProp(), fileInput, dragDropPlaceholder],
						},
					});
				} else {
					elem = addComponent({
						type: "input",
						props: {
							classList: ["propInput"],
							id: `${key}-input`,
							value: prop,
							onkeyup: (changeEvent) => {
								const isTheSame = changeEvent.target.value === prop;

								e.target.disabled = isTheSame;
								e.target.style.pointerEvents = isTheSame ? "none" : "all";
							},
						},
					});

					propElemRef.current.appendChild(elem);
				}

				propElemRef.current.appendChild(elem);
			}
		};

		const handleSaveButtonClick = async (e) => {
			let editElem;
			let updatedValue;

			if (key === "avatar") {
				editElem = propElemRef.current.querySelector("#avatar");
				updatedValue = editElem.style.backgroundImage;

				const base64Pattern = /^url\("data:image\/[a-zA-Z]+;base64,(.+?)"\)$/;
				const matches = base64Pattern.exec(updatedValue);
				if (matches && matches.length > 1) {
					updatedValue = matches[1]; // The Base64 part of the string
				}

				if (updatedValue === "") return;
				if (updatedValue === `url("")`) return;
			} else {
				editElem = propElemRef.current.querySelector("input");
				updatedValue = editElem.value;
			}

			if (userData.current[key] === updatedValue) return;

			try {
				const response = await fetch(`http://127.0.0.1:3001/users/${userData.current.username}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ [key]: updatedValue }),
				});

				if (response.ok) {
					userData.current[key] = updatedValue; // Update userData with new value
					prop = updatedValue;

					localStorage.setItem("username", `${userData.current.username}`);

					// Update UI to reflect the new value
					if (key === "avatar") {
						propElemRef.current.innerHTML = "";
						propElemRef.current.appendChild(initialValueProp());
					} else {
						propElemRef.current.textContent = updatedValue;
					}

					e.target.textContent = "Edit";
					e.target.disabled = false;
					e.target.style.pointerEvents = "all";

					new Toast({
						text: "Update successful",
					});

					if (cancelEditButtonRef.current) {
						cancelEditButtonRef.current.remove();
					}
				} else {
					new Toast({
						text: "Failed to update!",
					});

					throw new Error("Failed to update user");
				}
			} catch (error) {
				console.error("Error updating user:", error);
			}
		};

		const handleSaveToEditClick = () => {
			editButtonElemRef.current.textContent = "Edit";
			editButtonElemRef.current.disabled = false;
			editButtonElemRef.current.style.pointerEvents = "all";

			if (propElemRef.current) {
				propElemRef.current.innerHTML = "";

				if (key === "avatar") {
					propElemRef.current.appendChild(initialValueProp());
				} else {
					propElemRef.current.textContent = initialValueProp();
				}
			}
		};

		const handleCancelButtonClick = async (e) => {
			e.stopPropagation();
			e.preventDefault();

			if (cancelEditButtonRef.current) {
				cancelEditButtonRef.current.remove();
			}

			handleSaveToEditClick();
		};

		const cancelEditButtonElem = addComponent({
			type: "button",
			ref: cancelEditButtonRef,
			props: {
				type: "button",
				textContent: "Cancel",
				onClick: (e) => {
					handleCancelButtonClick(e);
				},
			},
		});

		return addComponent({
			type: "div",
			props: {
				classList: ["fieldRow", allowEditing ? "fieldRowDouble" : "fieldRowSingle"],
				id: `${key}Row`,
				children: [
					addComponent({
						type: "div",
						ref: propContainerElemRef,
						props: {
							classList: ["fieldInner"],
							children: [
								addComponent({
									type: "span",
									props: {
										classList: ["title"],
										textContent: name,
									},
								}),
								addComponent({
									type: "div",
									ref: propElemRef,
									props: {
										classList: ["value"],
										textContent: key === "avatar" ? "" : initialValueProp(),
										children: [key === "avatar" ? initialValueProp() : null],
									},
								}),
							],
						},
					}),
					allowEditing
						? addComponent({
								type: "div",
								ref: buttonContainerElemRef,
								props: {
									classList: ["buttonContainer"],
									children: [
										addComponent({
											type: "button",
											ref: editButtonElemRef,
											props: {
												type: "button",
												textContent: "Edit",
												onClick: async (e) => {
													e.stopPropagation();
													e.preventDefault();

													if (e.target.textContent === "Edit") {
														handleEditButtonClick(e);
													}

													if (e.target.textContent === "Save") {
														await handleSaveButtonClick(e);
													}
												},
											},
										}),
									],
								},
							})
						: null,
				],
			},
		});
	};

	const handleCloseButtonClick = (e) => {
		e.stopPropagation();
		e.preventDefault();

		removeModalComponent(elemRef.current);
	};

	const closeModalButtonContainer = addComponent({
		type: "div",
		props: {
			classList: ["fieldRow", "fieldRowSingle", "fieldRowCenter"],
			style: "margin-top: 20px;",
			children: [
				addComponent({
					type: "div",
					props: {
						classList: ["fieldInner"],
						children: [
							addComponent({
								type: "button",
								props: {
									type: "button",
									classList: ["danger"],
									textContent: "Close",
									onClick: (e) => {
										handleCloseButtonClick(e);
									},
								},
							}),
						],
					},
				}),
			],
		},
	});

	const elem = addComponent({
		type: "div",
		ref: elemRef,
		props: {
			classList: ["accountSettingsModal"],
			children: [
				addComponent({
					type: "div",
					props: {
						classList: ["accountSettingsModalInner"],
						children: [
							headerElem,
							propertyDisplaySetting({
								name: "Avatar",
								key: "avatar",
								prop: userData.current.avatar,
								allowEditing: true,
							}),
							propertyDisplaySetting({ name: "Joined Date", key: "joinedDate", prop: userData.current.joinedDate }),
							propertyDisplaySetting({ name: "Username", key: "username", prop: userData.current.username, allowEditing: true }),
							propertyDisplaySetting({ name: "First Name", key: "firstName", prop: userData.current.firstName, allowEditing: true }),
							propertyDisplaySetting({ name: "Last Name", key: "lastName", prop: userData.current.lastName, allowEditing: true }),
							propertyDisplaySetting({ name: "EMail", key: "email", prop: userData.current.email, allowEditing: true }),
							closeModalButtonContainer,
						],
					},
				}),
			],
		},
	});

	return elem;
};

export const accountSettingsPopup = () => {
	const usernameElemRef = createRef();
	const popoutElemRef = createRef();
	const themeSwitcherElemRef = createRef();

	const currentTheme = () => {
		const selectedTheme = localStorage.getItem("theme");

		if (!selectedTheme) {
			return "Light Theme";
		}

		return selectedTheme === "light" ? "Light Theme" : "Dark Theme";
	};

	fetchUser().then((res) => {
		usernameElemRef.current.textContent = `${res.firstName}!`;

		userData.current = { ...res };
		console.log(userData);
	});

	const userElem = addComponent({
		type: "div",
		props: {
			classList: ["username"],
			children: [
				addComponent({
					type: "div",
					props: {
						classList: ["username-inner"],
						children: [
							addComponent({
								type: "span",
								props: {
									textContent: "Hello,",
								},
							}),
							addComponent({
								type: "span",
								ref: usernameElemRef,
							}),
						],
					},
				}),
			],
		},
	});

	const linksElem = addComponent({
		type: "div",
		props: {
			classList: ["settings-links"],
			children: [
				addComponent({
					type: "span",
					props: {
						textContent: "Account Settings",
						onClick: (e) => {
							e.preventDefault();
							e.stopPropagation();

							insertModal(accountSettingsModal());
							removeModalComponent(popoutElemRef.current);

							document.querySelector(".user-account").classList.remove("open");
						},
					},
				}),
				addComponent({
					type: "span",
					ref: themeSwitcherElemRef,
					props: {
						textContent: currentTheme(),
						onClick: (e) => {
							e.preventDefault();
							e.stopPropagation();

							const isLightTheme = themeSwitcherElemRef.current.textContent === "Light Theme";
							themeSwitcherElemRef.current.textContent = isLightTheme ? "Dark Theme" : "Light Theme";
							localStorage.setItem("theme", isLightTheme ? "dark" : "light");

							if (isLightTheme) {
								document.body.classList.remove("light-theme");
								document.body.classList.add("dark-theme");
							} else {
								document.body.classList.remove("dark-theme");
								document.body.classList.add("light-theme");
							}
						},
					},
				}),
				addComponent({
					type: "span",
					props: {
						textContent: "Logout",
						onClick: (e) => {
							e.preventDefault();
							e.stopPropagation();

							localStorage.removeItem("username");
							goToPage("/access");
						},
					},
				}),
			],
		},
	});

	const popupElem = addComponent({
		type: "div",
		ref: popoutElemRef,
		props: {
			classList: ["account-popup"],
			children: [
				{
					type: "div",
					props: {
						classList: ["account-popup-inner"],
						children: [userElem, linksElem],
					},
				},
			],
		},
	});

	return popupElem;
};
