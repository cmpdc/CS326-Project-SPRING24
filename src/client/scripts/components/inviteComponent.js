import { trashIcon } from "../icons.js";
import { addComponent, createRef } from "../utils.js";
import Toast from "./toast.js";

export class InviteComponent {
	constructor({ emailList, onUpdateDelete, onInputEnter }) {
		this.containerRef = createRef();
		this.emailListRef = createRef();
		this.inputRef = createRef();

		this.emails = Array.isArray(emailList) ? [...emailList] : [];

		this.originalEmails = [...this.emails];

		this.onUpdateDelete = onUpdateDelete;
		this.onInputEnter = onInputEnter;

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
			const listItem = this.renderEmailItem(email);

			this.emailListRef.current.appendChild(listItem);
			this.emails.push(email); // Update the internal array
			this.inputRef.current.value = "";
		} else {
			new Toast({
				text: "Please enter a valid email.",
			});
		}

		if (this.onInputEnter) {
			this.onInputEnter(email);
		}
	}

	deleteEmail(email) {
		// Remove the email from the emails array
		const index = this.emails.indexOf(email);

		if (index > -1) {
			this.emails.splice(index, 1);
		}

		if (this.onUpdateDelete) {
			this.onUpdateDelete(email);
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

	renderEmails() {
		const list = this.emails;

		this.emailListRef.current.innerHTML = "";

		list.map((email) => {
			const elem = this.renderEmailItem(email);

			if (this.emailListRef.current) {
				this.emailListRef.current.appendChild(elem);
			}
		});
	}

	renderEmailItem(email) {
		const itemElem = addComponent({
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

		return itemElem;
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

		if (this.emails.length > 0) {
			this.renderEmails();
		}

		return container;
	}

	revertEmails() {
		this.emails = [...this.originalEmails];
	}
}
