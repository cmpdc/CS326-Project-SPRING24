import { eventDisplayCardsComponent } from "../../../components/eventDisplayCardsComponent.js";
import { eventDisplayPrimaryComponent } from "../../../components/eventDisplayPrimaryComponent.js";
import { addComponent, createRef, findCurrentlyHappeningEvent, findFutureEvents, findPastEvents, findSoonestEvent } from "../../../utils.js";

const fetchEvents = async () => {
	try {
		const username = localStorage.getItem("username");
		const response = await fetch("http://127.0.0.1:3001/events");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		// Filter events to only include those where the username is in the invites array
		const filteredData = data.filter((event) => event.invites.includes(username));
		return filteredData;
	} catch (error) {
		console.error("Error fetching events: ", error);
		throw new Error("Error fetching events");
	}
};

const resultElem = (list) => {
	const primaryContainerRef = createRef();

	const happeningRightNowEvent = findCurrentlyHappeningEvent(list);
	const comingSoonEvent = findSoonestEvent(list);
	const futureEvents = findFutureEvents(list);
	const pastEvents = findPastEvents(list);

	const today = new Date();

	const primaryElem = addComponent({
		type: "div",
		props: {
			classList: ["primaryContainer"],
			children: [
				{
					type: "h2",
					props: {
						textContent:
							new Date(comingSoonEvent.dateTime.from) > today && new Date(comingSoonEvent.dateTime.to) > today
								? "Coming Soon"
								: "Happening Now",
					},
				},
				{
					type: "div",
					ref: primaryContainerRef,
					props: {
						classList: ["primary"],
						children: [eventDisplayPrimaryComponent(comingSoonEvent ? comingSoonEvent : happeningRightNowEvent)],
					},
				},
			],
		},
	});

	const upcomingElem = addComponent({
		type: "div",
		props: {
			classList: ["upcomingContainer"],
			children: [
				{
					type: "h2",
					props: {
						textContent: "Other Upcoming Events",
					},
				},
				{
					type: "div",
					props: {
						classList: ["upcoming-event-list", "grid-list"],
						children: [eventDisplayCardsComponent({ list: futureEvents, emptyText: "Nothing to show here." })],
					},
				},
			],
		},
	});

	const pastElem = addComponent({
		type: "div",
		props: {
			classList: ["pastContainer"],
			children: [
				{
					type: "h2",
					props: {
						textContent: "Past Events",
					},
				},
				{
					type: "div",
					props: {
						classList: ["past-event-list", "grid-list"],
						children: [eventDisplayCardsComponent({ list: pastEvents, emptyText: "Nothing to show here." })],
					},
				},
			],
		},
	});

	const elem = addComponent({
		type: "div",
		props: {
			classList: ["eventList"],
			children: [primaryElem, upcomingElem, pastElem],
		},
	});

	return elem;
};

const noResultElem = () => {
	const elem = addComponent({
		type: "div",
		props: {
			classList: ["noResult-message"],
			children: [
				addComponent({
					type: "h1",
					props: {
						textContent: "Events",
					},
				}),
				addComponent({
					type: "div",
					props: {
						classList: ["noResult-content"],
						children: [
							addComponent({
								type: "h2",
								props: {
									textContent: "No Events",
								},
							}),
						],
					},
				}),
			],
		},
	});

	return elem;
};

const updateCurrentTabContent = async (childRef) => {
	try {
		const results = await fetchEvents();

		console.log("Event List:", results);

		if (results && results.length) {
			const element = resultElem(results);

			if (childRef.current) {
				childRef.current.innerHTML = "";

				childRef.current.appendChild(element);
			}
		} else {
			childRef.current.innerHTML = "";
			childRef.current.appendChild(noResultElem());
		}
	} catch (error) {
		console.error("Error updating current tab:", error);

		if (childRef.current) {
			childRef.current.innerHTML = "";
			childRef.current.appendChild(noResultElem());
		}
	}
};

export const pendingTab = () => {
	const childRef = createRef();
	const username = localStorage.getItem("username");
	console.log(username);
	const elem = addComponent({
		type: "div",
		ref: childRef,
		props: {
			classList: ["currentTab", "contentTab"],
			children: [],
		},
	});

	updateCurrentTabContent(childRef);

	return elem;
};
