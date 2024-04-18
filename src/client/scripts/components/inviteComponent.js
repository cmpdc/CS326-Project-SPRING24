import { trashIcon } from "../icons.js";
import { addComponent, createRef } from "../utils.js";

export class InviteComponent {
	constructor() {
		this.containerRef = createRef();
		this.emailListRef = createRef();
		this.inputRef = createRef();
		this.emails = [];

		this.updateEmailList = this.updateEmailList.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.deleteEmail = this.deleteEmail.bind(this);
	}

	getInviteList() {
		return this.emails;
	}

	isValidEmail(email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	updateEmailList() {
		const email = this.inputRef.current.value;

		if (this.isValidEmail(email)) {
			const listItem = addComponent({
				type: "li",
				props: {
					classList: ["email-item"],
					children: [
						{
							type: "span",
							props: {
								textContent: email,
							},
						},
						{
							type: "span",
							props: {
								classList: ["delete-button"],
								children: [trashIcon],
								onClick: (e) => {
									e.preventDefault();
									e.stopPropagation();

									this.deleteEmail(email);
								},
							},
						},
					],
				},
			});

			this.emailListRef.current.appendChild(listItem);
			this.emails.push(email); // Update the internal array
			this.inputRef.current.value = "";
		} else {
			alert("Please enter a valid email.");
		}
	}

	deleteEmail(email) {
		// Remove the email from the emails array
		const index = this.emails.indexOf(email);
		if (index > -1) {
			this.emails.splice(index, 1);
		}

		// Update the list in the DOM
		Array.from(this.emailListRef.current.children).forEach((child) => {
			if (child.querySelector("span").textContent === email) {
				this.emailListRef.current.removeChild(child);
			}
		});
	}

	handleKeyPress(event) {
		if (event.key === "Enter") {
			this.updateEmailList();
		}
	}

	render() {
		const container = addComponent({
			type: "div",
			ref: this.containerRef,
			props: {
				id: "invites",
				children: [
					{
						type: "ul",
						ref: this.emailListRef,
						props: { classList: ["email-list"] },
					},
					{
						type: "div",
						props: {
							classList: ["eventInputWrapper"],
							children: [
								{
									type: "input",
									ref: this.inputRef,
									props: {
										type: "text",
										id: "inviteInput",
										placeholder: "Enter email",
										onKeyup: this.handleKeyPress,
									},
								},
								{
									type: "span",
									props: {
										classList: ["spanBorder"],
									},
								},
							],
						},
					},
				],
			},
		});

		return container;
	}
}
