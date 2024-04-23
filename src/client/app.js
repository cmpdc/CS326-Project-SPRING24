import { loadAccessPage } from "./scripts/pages/access/access.js";
import { loadDashboardPage } from "./scripts/pages/dashboard/dashboard.js";
import { currentTab } from "./scripts/pages/dashboard/tabs/current.js";
import { pendingTab } from "./scripts/pages/dashboard/tabs/pending.js";
import { sharedTab } from "./scripts/pages/dashboard/tabs/shared.js";
import { loadLandingPage } from "./scripts/pages/landing/landing.js";

/**
 * A function that can be use as an anchor between pages/tabs
 * @returns {void}
 */
export const goToPage = (path) => {
	const normalizedPath = path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
	window.history.pushState({}, "", normalizedPath);
	navigate();
};

/**
 * Navigate throughout the app
 * @returns {void}
 */
const navigate = () => {
	const appElement = document.querySelector("#app");
	let path = window.location.pathname;

	// Normalize the path by removing a trailing slash if it exists
	path = path.replace(/\/$/, "");

	if (!appElement) return;

	if (path.startsWith("/dashboard/event/")) {
		loadDashboardPage(appElement);
	} else {
		switch (path) {
			case "":
			case "/":
				loadLandingPage(appElement);
				break;
			case "/access":
				loadAccessPage(appElement);
				break;
			case "/dashboard":
				goToPage("/dashboard/current");
				break;
			case "/dashboard/current":
			case "/dashboard/shared":
			case "/dashboard/pending":
				appElement.innerHTML = "";

				loadDashboardPage(appElement);
				updateDashboardContent(path.split("/").pop());
				break;
			default:
				appElement.innerHTML = "Page Not Found";
		}
	}

	updateActiveLink();
};

export const updateActiveLink = () => {
	const sidebarLinksContainerRef = document.querySelector(".sidebar-links");

	if (!sidebarLinksContainerRef) return;

	const currentPath = window.location.pathname.split("/").filter(Boolean);
	const activeLinkName = "link-active";

	// Remove the active class from all links
	const links = sidebarLinksContainerRef.querySelectorAll(".link-item");
	links.forEach((link) => {
		link.classList.remove(activeLinkName);
	});

	// Add the active class to the link that corresponds to the current path
	const activeLink = Array.from(links).find((link) => link.id === `${currentPath[currentPath.length - 1]}`);
	if (activeLink) {
		activeLink.classList.add(activeLinkName);
	}
};

export const updateDashboardContent = (path) => {
	const contentWrapper = document.querySelector(".contentWrapper .content");
	if (!contentWrapper) return;

	let elemToAppend = null;
	switch (path) {
		case "current":
			elemToAppend = currentTab();

			break;
		case "shared":
			elemToAppend = sharedTab();

			break;
		case "pending":
			elemToAppend = pendingTab();

			break;
		default:
			break;
	}

	contentWrapper.appendChild(elemToAppend);
};

window.addEventListener("DOMContentLoaded", navigate);
window.addEventListener("hashchange", navigate);
