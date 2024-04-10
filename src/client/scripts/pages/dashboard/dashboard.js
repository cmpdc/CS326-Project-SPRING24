import { addComponent } from "../../../utils.js";
import { sidebarComponent } from "./sidebar.js";

const contentComponent = () => {
	return addComponent({
		type: "div",
		props: {
			classList: ["container"],
		},
	});
};

export const loadDashboardPage = (element) => {
	const modalElem = document.querySelector("#modal");

	if (element && modalElem) {
		element.insertBefore(sidebarComponent(), modalElem);
		element.insertBefore(contentComponent(), modalElem);
	}
};
