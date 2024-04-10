import { addComponent, createRef } from "../../../utils.js";
import { loadEventComponent } from "../../components/newEvent.js";

const sidebarLinks = [
	{
		name: "New Event",
		click: () => {
			loadEventComponent();
		},
		icon: () => {
			return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg>`;
		},
	},
	{
		name: "My Events",
		click: () => {},
		icon: () => {
			return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 10H4V19H20V10ZM15.0355 11.136L16.4497 12.5503L11.5 17.5L7.96447 13.9645L9.37868 12.5503L11.5 14.6716L15.0355 11.136ZM7 5H4V8H20V5H17V6H15V5H9V6H7V5Z"></path></svg>`;
		},
	},
	{
		name: "Shared",
		click: () => {},
		icon: () => {
			return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M5.8 11.3 2 22l10.7-3.79"></path><path d="M4 3h.01"></path><path d="M22 8h.01"></path><path d="M15 2h.01"></path><path d="M22 20h.01"></path><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"></path><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"></path><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"></path><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"></path></svg>`;
		},
	},
	{
		name: "Pending",
		click: () => {},
		icon: () => {
			return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm1.65 7.35L16.5 17.2V14h1v2.79l1.85 1.85-.7.71zM18 3h-3.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H6c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h6.11a6.743 6.743 0 0 1-1.42-2H6V5h2v3h8V5h2v5.08c.71.1 1.38.31 2 .6V5c0-1.1-.9-2-2-2zm-6 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>`;
		},
	},
];

export const sidebarComponent = () => {
	const sidebarLinksContainerRef = createRef();
	const upcomingEventsContainerRef = createRef();

	const sidebarComponent = addComponent({
		type: "aside",
		props: {
			classList: ["sidebar"],
			children: [
				{
					type: "div",
					props: {
						classList: ["logo"],
					},
				},
				{
					type: "ul",
					ref: sidebarLinksContainerRef,
					props: {
						classList: ["sidebar-links"],
					},
				},
				{
					type: "div",
					ref: upcomingEventsContainerRef,
					props: {
						classList: ["upcomingEvents"],
					},
				},
			],
		},
	});

	let activeLinkIndex = 0;
	let activeLinkName = "link-active";

	sidebarLinks.forEach((link, linkIndex) => {
		const linkIconElemRef = createRef();
		const linkElem = addComponent({
			type: "li",
			props: {
				classList: ["link-item"],
				id: String(link.name).replace(" ", "_").toLowerCase(),
				children: [
					{
						type: "span",
						ref: linkIconElemRef,
						props: {
							classList: ["link-icon"],
							innerHTML: link.icon ? link.icon() : "",
						},
					},
					{
						type: "span",
						props: {
							classList: ["link-title"],
							textContent: link.name,
						},
					},
				],
			},
		});

		linkElem.addEventListener("click", () => {
			link.click();

			if (activeLinkIndex !== null) {
				const previousActive = sidebarLinksContainerRef.current.children[activeLinkIndex];
				previousActive.classList.remove(activeLinkName);
			}

			linkElem.classList.add(activeLinkName);

			activeLinkIndex = linkIndex;
		});

		sidebarLinksContainerRef.current.appendChild(linkElem);
	});

	return sidebarComponent;
};
