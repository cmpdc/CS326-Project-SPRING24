import { eventDisplayPrimaryComponent } from "../../components/eventDisplayPrimaryComponent.js";
import { addComponent, createRef } from "../../utils.js";

export const loadEventPage = (event) => {
	const appElement = document.querySelector("#app");
	const contentAreaElement = appElement.querySelector(".contentWrapper .content");

	if (!contentAreaElement) return;

	contentAreaElement.textContent = "";

	const primaryContainerRef = createRef();

	const primaryElem = addComponent({
		type: "div",
		props: {
			classList: ["primaryContainer"],
			children: [
				{
					type: "div",
					ref: primaryContainerRef,
					props: {
						classList: ["primary"],
						children: [eventDisplayPrimaryComponent(event)],
					},
				},
			],
		},
	});

	// primaryContainerRef.getElementByClass("icon").style.height = "20px";

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
