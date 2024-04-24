import { addComponent } from "../../utils.js";
import { headerComponent } from "./header.js";
import { sidebarComponent } from "./sidebar.js";

/**
 * Dashboard page
 * @returns {void}
 */
const contentComponent = () => {
	return addComponent({
		type: "div",
		props: {
			classList: ["content"],
		},
	});
};

const contentComponentWrapper = () => {
	return addComponent({
		type: "div",
		props: {
			classList: ["containerWrapper"],
			children: [
				{
					type: "div",
					props: {
						classList: ["sidebarWrapper"],
						children: [sidebarComponent()],
					},
				},
				{
					type: "div",
					props: {
						classList: ["contentWrapper"],
						children: [contentComponent()],
					},
				},
			],
		},
	});
};

export const loadDashboardPage = (element) => {
	if (!element) return;

	let modalElem = document.querySelector("#modal");
	if (!modalElem) {
		modalElem = addComponent({
			type: "div",
			props: {
				id: "modal",
			},
		});

		element.appendChild(modalElem);
	}

	const headerContainerElem = headerComponent({
		rightSideContent: null,
	});

	const sidebarContainerElem = sidebarComponent();

	if (element.querySelector(`.${headerContainerElem?.classList[0]}`) || element.querySelector(`.${sidebarContainerElem.classList[0]}`)) {
		return;
	}

	if (headerContainerElem) element.insertBefore(headerContainerElem, modalElem);
	element.insertBefore(contentComponentWrapper(), modalElem);

	const sidebarElem = document.querySelector(".sidebar");
	if (sidebarElem) {
		const calculateWidth = () => {
			const sidebarElemRect = sidebarElem.getBoundingClientRect();

			document.body.style.setProperty("--sidebarWidth", `${sidebarElemRect.width}px`);
		};

		calculateWidth();

		window.addEventListener("resize", () => {
			calculateWidth();
		});
	}
};
