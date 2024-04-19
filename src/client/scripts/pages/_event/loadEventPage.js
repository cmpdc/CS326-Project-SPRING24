export const loadEventPage = (event) => {
	const appElement = document.querySelector("#app");
	const contentAreaElement = appElement.querySelector(".contentWrapper .content");

	if (!contentAreaElement) return;

	contentAreaElement.textContent = event.title;

	console.log(event);
};
