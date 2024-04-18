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

const contentComponent_ = () => {
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
	const modalElem = document.querySelector("#modal");

	if (
		element.querySelector(`.${headerComponent().classList[0]}`) ||
		element.querySelector(`.${sidebarComponent().classList[0]}`) ||
		element.querySelector(`.${contentComponent().classList[0]}`)
	)
		return;

	if (element && modalElem) {
		element.insertBefore(headerComponent(), modalElem);
		element.insertBefore(contentComponent_(), modalElem);
	}

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
