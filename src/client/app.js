import { loadAccessPage } from "./scripts/pages/access.js"; // login page
import { loadDashboardPage } from "./scripts/pages/dashboard/dashboard.js"; // dashboard page
import { loadLandingPage } from "./scripts/pages/landing.js"; // landing page

export function insertModal(element) {
	const modalElem = document.querySelector("#modal");

	if (modalElem.querySelector(`.${element.classList[0]}`)) return; // ensures for no duplicates

	modalElem.appendChild(element);
}

export function goToPage(path) {
	window.history.pushState({}, "", path);
	navigate();
}

function navigate() {
	const appElement = document.querySelector("#app");

	const path = window.location.hash.slice(1);

	switch (path) {
		case "":
		case "/":
			loadLandingPage(appElement);
			break;
		case "/access":
			loadAccessPage(appElement);
			break;
		case "/dashboard":
			loadDashboardPage(appElement);
			break;
		default:
			appElement.innerHTML = "Page Not Found";
	}
}

window.addEventListener("DOMContentLoaded", navigate);
window.addEventListener("hashchange", navigate);
