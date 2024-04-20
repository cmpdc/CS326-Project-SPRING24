import { goToPage } from "../../../app.js";
import { addComponent } from "../../utils.js";

// NOTE: don't forget that when importing modules, there needs to have ".js" at the end

/**
 * The "homepage" of our app.
 * This component is what will be seen if a user uses our app without an account.
 * @returns {void}
 */
export const loadLandingPage = (element) => {
	element.innerHTML = `<h1>Home</h1>`;

	const sampleButton = addComponent({
		type: "button",
		props: {
			id: "goTo",
			textContent: "Go to Dashboard",
			onClick: (e) => {
				goToPage("/dashboard");
			},
		},
	});

	element.appendChild(sampleButton);
};
