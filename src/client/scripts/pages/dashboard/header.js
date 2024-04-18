import { goToPage } from "../../../app.js";
import { logoIcon, searchIcon, userIcon } from "../../icons.js";
import { addComponent, createRef, insertModal } from "../../utils.js";
import { accountSettingsPopup } from "./accountSettings.js";

export const headerComponent = () => {
	const searchInputRef = createRef();
	const userAccountComponentRef = createRef();

	const handleLogoClick = (e) => {
		e.stopPropagation();
		e.preventDefault();

		goToPage("/dashboard");
	};

	const logoComponent = addComponent({
		type: "div",
		props: {
			classList: ["logoContainer"],
			children: [
				{
					type: "div",
					props: {
						classList: ["icon"],
						children: [logoIcon],
						onClick: (e) => {
							handleLogoClick(e);
						},
					},
				},
				{
					type: "h2",
					props: {
						classList: ["app-name"],
						children: [
							{
								type: "span",
								props: {
									classList: ["primary"],
									textContent: "Meet",
								},
							},
							{
								type: "span",
								props: {
									classList: ["secondary"],
									textContent: "Up",
								},
							},
						],
						onClick: (e) => {
							handleLogoClick(e);
						},
					},
				},
			],
			onClick: (e) => {
				goToPage("/dashboard");
			},
		},
	});

	const searchComponent = addComponent({
		type: "div",
		props: {
			classList: ["searchComponent"],
			children: [
				{
					type: "span",
					props: {
						classList: ["search-icon", "icon"],
						children: [searchIcon],
					},
				},
				{
					type: "input",
					ref: searchInputRef,
					props: {
						id: "searchInput",
						placeholder: "Search",
					},
				},
			],
		},
	});

	const handleUserAccountClickOutside = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!userAccountComponentRef.current && userAccountComponentRef.current.contains(e.target)) return;
		if (document.querySelector(`.${accountSettingsPopup().classList[0]}`)?.parentElement?.contains(e.target)) return;

		if (userAccountComponentRef.current.classList.contains("open")) {
			userAccountComponentRef.current.classList.remove("open");
		}

		document.removeEventListener("click", handleUserAccountClickOutside);
	};

	const userAccountComponent = addComponent({
		type: "div",
		ref: userAccountComponentRef,
		props: {
			classList: ["user-account"],
			children: [
				{
					type: "span",
					props: {
						classList: ["user-icon", "icon"],
						children: [userIcon],
					},
				},
			],
			onClick: (event) => {
				event.stopPropagation();
				event.preventDefault();

				userAccountComponent.classList.add("open");

				insertModal(accountSettingsPopup());

				document.addEventListener("click", handleUserAccountClickOutside);
			},
		},
	});

	const elem = addComponent({
		type: "header",
		props: {
			classList: ["app-header"],
			children: [
				logoComponent,
				{
					type: "div",
					props: {
						classList: ["rightSide"],
						children: [searchComponent, userAccountComponent],
					},
				},
			],
		},
	});

	return elem;
};
