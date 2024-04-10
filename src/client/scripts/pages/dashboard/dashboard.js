import { sidebarComponent } from "./sidebar.js";

const contentComponent = () => {
	const elem = document.createElement("div");
	elem.classList.add("container");

	return elem;
};

export const loadDashboardPage = (element) => {
	const modalElem = document.querySelector("#modal");

	if (element && modalElem) {
		element.insertBefore(sidebarComponent(), modalElem);
		element.insertBefore(contentComponent(), modalElem);
	}
};
