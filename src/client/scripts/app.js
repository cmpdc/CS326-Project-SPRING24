import { loadEventPage } from "./pages/_event/loadEventPage.js";
import { loadAccessPage } from "./pages/access/access.js";
import { loadDashboardPage } from "./pages/dashboard/dashboard.js";
import { currentTab } from "./pages/dashboard/tabs/current.js";
import { pendingTab } from "./pages/dashboard/tabs/pending.js";
import { acceptedTab } from "./pages/dashboard/tabs/shared.js";
import { loadInitialPage } from "./pages/initial/initial.js";

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
		const eventId = path.split("/")[3];
		loadDashboardPage(appElement);
		loadEventPage(eventId, appElement);
	} else {
		switch (path) {
			case "":
			case "/":
				loadInitialPage(appElement);
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

				checkUserAccount();
				break;
			default:
				appElement.innerHTML = "Page Not Found";
		}
	}

	updateActiveLink();
};

const checkUserAccount = () => {
	// this checks the "username" in localStorage.
	// when "username" is not found, forcefully redirect
	// user to access (login/registration) page
	const username = localStorage.getItem("username");

	if (!username) {
		goToPage("/access");
	}
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
			elemToAppend = acceptedTab();

			break;
		case "pending":
			elemToAppend = pendingTab();

			break;
		default:
			break;
	}

	contentWrapper.appendChild(elemToAppend);
};

const setTheme = () => {
	const currentTheme = localStorage.getItem("theme");

	switch (currentTheme) {
		case "light":
			if (document.body.classList.contains("dark-theme")) {
				document.body.classList.remove("dark-theme");
			}

			document.body.classList.add("light-theme");

			break;
		case "dark":
			if (document.body.classList.contains("light-theme")) {
				document.body.classList.remove("light-theme");
			}

			document.body.classList.add("dark-theme");

			break;
		default:
			document.body.classList.add("light-theme");
			break;
	}
};

window.addEventListener("DOMContentLoaded", () => {
	setTheme();
	navigate();
});

window.addEventListener("hashchange", navigate);
