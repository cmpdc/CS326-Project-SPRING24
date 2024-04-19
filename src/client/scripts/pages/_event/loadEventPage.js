export const loadEventPage = (eventName) => {
	const appElement = document.querySelector("#app");
	const contentAreaElement = appElement.querySelector(".contentWrapper .content");

	if (!contentAreaElement) return;

	contentAreaElement.textContent = eventName;
};
