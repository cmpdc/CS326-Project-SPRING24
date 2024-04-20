import { goToPage } from "../../../app.js";
import { addComponent } from "../../utils.js";

// NOTE: don't forget that when importing modules, there needs to have ".js" at the end

/**
 * The "account" page of our app.
 * This component is what the user will see to login or create account.
 * @returns {void}
 */
export const loadAccessPage = (element) => {
	element.innerHTML = `<h1>Login/SignUp</h1>`;

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
