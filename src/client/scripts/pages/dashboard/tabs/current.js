import { eventDisplayCardsComponent } from "../../../components/eventDisplayCardsComponent.js";
import { eventDisplayPrimaryComponent } from "../../../components/eventDisplayPrimaryComponent.js";
import { mockUp } from "../../../mockup.js";
import { addComponent, createRef, findCurrentlyHappeningEvent, findFutureEvents, findPastEvents, findSoonestEvent } from "../../../utils.js";

export const currentTab = () => {
	const primaryContainerRef = createRef();

	const happeningRightNowEvent = findCurrentlyHappeningEvent(mockUp);
	const comingSoonEvent = findSoonestEvent(mockUp);
	const futureEvents = findFutureEvents(mockUp);
	const pastEvents = findPastEvents(mockUp);

	const today = new Date();

	const primaryElem = addComponent({
		type: "div",
		props: {
			classList: ["primaryContainer"],
			children: [
				{
					type: "h2",
					props: {
						textContent: new Date(comingSoonEvent.dateTime.from) < today ? "Coming Soon" : "Happening Now",
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
			classList: ["currentTab", "contentTab"],
			children: [primaryElem, upcomingElem, pastElem],
		},
	});

	return elem;
};
