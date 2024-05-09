import { eventDisplayPrimaryComponent } from "../../components/eventDisplayPrimaryComponent.js";
import { addComponent, createRef } from "../../utils.js";

const loadEventPageNoResult = (appElement) => {
	const contentBodyElem = appElement.querySelector(".contentWrapper > .content");
	if (!contentBodyElem) return;

	contentBodyElem.classList.add("noResults");

	const noResultElem = addComponent({
		type: "div",
		props: {
			classList: ["noResultsContainer"],
			children: [
				{
					type: "div",
					props: {
						classList: ["noResultsContainerText"],
						textContent: "Sorry, but we cannot find that event.",
					},
				},
				{
					type: "div",
					props: {
						classList: ["noResultsContainerIcon"],
					},
				},
			],
		},
	});

	contentBodyElem.appendChild(noResultElem);
};

const loadEventPageWithResult = (event) => {
	const appElement = document.querySelector("#app");
	const contentAreaElement = appElement.querySelector(".contentWrapper .content");

	if (!contentAreaElement) return;

	contentAreaElement.textContent = "";

	const primaryContainerRef = createRef();

	const primaryElem = addComponent({
		type: "div",
		props: {
			classList: ["primaryContainer", "eventPage"],
			children: [
				{
					type: "div",
					ref: primaryContainerRef,
					props: {
						id: "primary",
						classList: ["primary"],
						children: [
							eventDisplayPrimaryComponent(event, {
								center: true,
								dragging: true,
								touchZoom: true,
								scrollWheelZoom: true,
								doubleClickZoom: false,
								boxZoom: false,
							}),
						],
					},
				},
			],
		},
	});

	const map = primaryElem.querySelector(".left");

	if (map) {
		map.parentElement.parentElement.parentElement.classList.add("eventSolo");

		map.classList.remove("left");
		map.classList.add("above");
	}

	const info = primaryElem.querySelector(".right");

	if (info) {
		info.classList.remove("right");
		info.classList.add("below");
	}

	primaryElem.querySelector(".primaryEvent").style.flexFlow = "column";

	const viewDetailsButton = primaryElem.querySelector(".button.details");
	if (viewDetailsButton) {
		viewDetailsButton.remove();
	}

	// const locationComponent = addComponent({
	// 	type: "div",
	// 	props: {
	// 		classList: ["locationComponent", "row"],
	// 		children: [
	// 			{
	// 				type: "div",
	// 				props: {
	// 					classList: ["icon"],
	// 				},
	// 			},
	// 			{
	// 				type: "div",
	// 				props: {
	// 					classList: ["info"],
	// 					children: [
	// 						{
	// 							type: "span",
	// 							props: {
	// 								textContent: event.location.formatted,
	// 							},
	// 						},
	// 					],
	// 				},
	// 			},
	// 		],
	// 	},
	// });

	// const titleComponent = addComponent({
	// 	type: "h2",
	// 	props: {
	// 		textContent: event.title,
	// 	},
	// });

	// const informationComponent = addComponent({
	// 	type:"div",
	// 	props: {
	// 		classList: []
	// 	}

	// })

	// const mapRef = createRef();
	// const elem = addComponent({
	// 	type: "div",
	// 	props: {
	// 		classList: ["primary"],
	// 		children: [
	// 			{
	// 				type: "div",
	// 				ref: mapRef,
	// 				props: {
	// 					id: `map-${event.id}`,
	// 					classList: ["above", "mapView"],
	// 				},
	// 			},
	// 			{
	// 				type: "div",
	// 				props: {
	// 					classList: ["below"],
	// 					children: [
	// 						titleComponent,
	// 						informationComponent,
	// 						locationComponent,
	// 					],
	// 				},
	// 			},
	// 		],
	// 	},
	// });

	// setTimeout(() => {
	// 	if (mapRef.current) {
	// 		try {
	// 			const map = L.map(mapRef.current.id, {
	// 				center: true,
	// 				dragging: false,
	// 				touchZoom: false,
	// 				scrollWheelZoom: false,
	// 				doubleClickZoom: false,
	// 				boxZoom: false,
	// 			}).setView([event.location.geometry.lat, event.location.geometry.lng], 13);

	// 			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

	// 			L.marker([event.location.geometry.lat, event.location.geometry.lng]).addTo(map);
	// 		} catch (e) { console.log("failed to execute") }
	// 	}
	// }, 100);

	contentAreaElement.appendChild(primaryElem);

	return primaryElem;
};

export const loadEventPage = async (eventId, appElement) => {
	try {
		const response = await fetch(`http://127.0.0.1:3001/events/${eventId}`);

		if (response.ok) {
			const eventData = await response.json();
			loadEventPageWithResult(eventData);
		} else {
			loadEventPageNoResult(appElement);
		}
	} catch (error) {
		loadEventPageNoResult(appElement);
	}
};
