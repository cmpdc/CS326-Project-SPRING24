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
		const propElemRef = createRef();
		const buttonElemRef = createRef();

		const handleEditButton = (e) => {
			e.target.disabled = true;
			e.target.style.pointerEvents = "none";
			e.target.textContent = "Save";

			propElemRef.current.innerHTML = "";

			const propElemInput = addComponent({
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

			propElemRef.current.appendChild(propElemInput);
		};

		const handleSaveButton = async (e) => {
			const inputElem = propElemRef.current.querySelector("input");
			const updatedValue = inputElem.value;

			if (userData.current[key] === updatedValue) {
				return;
			}

			try {
				const response = await fetch(`http://127.0.0.1:3001/users/${userData.current.username}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ [key]: updatedValue }),
				});

				if (response.ok) {
					// Update userData with new value
					userData.current[key] = updatedValue;

					// Update UI to reflect the new value
					propElemRef.current.textContent = updatedValue;

					e.target.textContent = "Edit";
					e.target.disabled = false;
					e.target.style.pointerEvents = "all";

					console.log("Update successful");
				} else {
					throw new Error("Failed to update user");
				}
			} catch (error) {
				console.error("Error updating user:", error);
			}
		};

		return addComponent({
			type: "div",
			props: {
				classList: ["fieldRow", allowEditing ? "fieldRowDouble" : "fieldRowSingle"],
				id: `${key}Row`,
				children: [
					addComponent({
						type: "div",
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
										textContent:
											key === "joinedDate"
												? `${new Date(prop).toLocaleDateString(undefined, {
														weekday: "long",
														year: "numeric",
														month: "long",
														day: "2-digit",
													})}`
												: prop,
									},
								}),
							],
						},
					}),
					allowEditing
						? addComponent({
								type: "div",
								props: {
									classList: ["editButtonContainer"],
									children: [
										addComponent({
											type: "button",
											ref: buttonElemRef,
											props: {
												type: "button",
												textContent: "Edit",
												onClick: async (e) => {
													e.stopPropagation();
													e.preventDefault();

													if (e.target.textContent === "Edit") {
														handleEditButton(e);
													}

													if (e.target.textContent === "Save") {
														await handleSaveButton(e);
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

	const handleCancelButtonClick = (e) => {
		e.stopPropagation();
		e.preventDefault();

		removeModalComponent(elemRef.current);
	};

	const cancelButtonContainer = addComponent({
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
									textContent: "Cancel",
									onClick: (e) => {
										handleCancelButtonClick(e);
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
							propertyDisplaySetting({ name: "Joined Date", key: "joinedDate", prop: userData.current.joinedDate }),
							propertyDisplaySetting({ name: "Username", key: "username", prop: userData.current.username, allowEditing: true }),
							propertyDisplaySetting({ name: "First Name", key: "firstName", prop: userData.current.firstName, allowEditing: true }),
							propertyDisplaySetting({ name: "Last Name", key: "lastName", prop: userData.current.lastName, allowEditing: true }),
							propertyDisplaySetting({ name: "EMail", key: "email", prop: userData.current.email, allowEditing: true }),
							cancelButtonContainer,
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
					props: {
						textContent: "Logout",
						onClick: (e) => {
							e.preventDefault();
							e.stopPropagation();
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
