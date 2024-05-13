import { goToPage } from "../app.js";
import { deleteEvent, editEvent } from "../events.js";
import { descriptionIcon, guestsIcon, locationIcon, timeIcon, trackingIcon, userIcon } from "../icons.js";
import { addComponent, createRef, formatAMPM, getDateWithSuffix, getDayName } from "../utils.js";

const eventDisplayElemComponent = (eventData, mapSettings) => {
	if (!eventData) return null;

	const currentUser = localStorage.getItem("username");
	const isOwner = currentUser === eventData.creator;
	const isInvited = eventData.invites.includes(currentUser);

	const titleComponent = addComponent({
		type: "h2",
		props: {
			textContent: eventData.title,
		},
	});

	const eventFromDate = new Date(eventData.dateTime.from);
	const eventToDate = new Date(eventData.dateTime.to);

	const eventDayName = getDayName(eventFromDate);
	const eventDateWithSuffix = getDateWithSuffix(eventFromDate);
	const eventFormattedDate = `${eventDayName}, ${eventFromDate.toLocaleString("default", { month: "long" })} ${eventDateWithSuffix}`;

	const eventFormattedFromTime = formatAMPM(eventFromDate);
	const eventFormattedToTime = formatAMPM(eventToDate);
	const eventFormattedTime = `${eventFormattedFromTime} — ${eventFormattedToTime}`;

	const eventCreationDate = new Date(eventData.createdDateTime);
	const eventCreationName = getDayName(eventCreationDate);
	const eventCreationDateWithSuffix = getDateWithSuffix(eventCreationDate);
	const eventCreationFormattedDate = `${eventCreationName}, ${eventCreationDate.toLocaleString("default", { month: "long" })} ${eventCreationDateWithSuffix}`;

	const eventCreationFormattedTime = formatAMPM(eventCreationDate);

	const dateTimeComponent = addComponent({
		type: "div",
		props: {
			id: "date",
			classList: ["dateComponent", "row"],
			children: [
				{
					type: "div",
					props: {
						classList: ["icon"],
						children: [timeIcon],
					},
				},
				{
					type: "div",
					props: {
						classList: ["info"],
						children: [
							{
								type: "span",
								props: {
									textContent: eventFormattedDate,
								},
							},
							{ type: "span", props: { textContent: "•" } },
							{
								type: "span",
								props: {
									textContent: eventFormattedTime,
								},
							},
						],
					},
				},
			],
		},
	});

	const userComponent = addComponent({
		type: "div",
		props: {
			id: "user",
			classList: ["userComponent", "row"],
			children: [
				{
					type: "div",
					props: {
						classList: ["icon"],
						children: [userIcon],
					},
				},
				{
					type: "div",
					props: {
						classList: ["info"],
						children: [
							{
								type: "div",
								props: {
									classList: ["creator"],
									children: [
										{
											type: "span",
											props: {
												textContent: `Created by:`,
											},
										},
										{
											type: "span",
											props: {
												textContent: eventData.creator,
											},
										},
									],
								},
							},
							{
								type: "div",
								props: {
									classList: ["createdTime"],
									children: [
										{ type: "span", props: { textContent: "When:" } },
										{
											type: "span",
											props: {
												textContent: eventCreationFormattedDate,
											},
										},
										{ type: "span", props: { textContent: "•" } },
										{
											type: "span",
											props: {
												textContent: eventCreationFormattedTime,
											},
										},
									],
								},
							},
						],
					},
				},
			],
		},
	});

	const locationComponent = addComponent({
		type: "div",
		props: {
			id: "location",
			classList: ["locationComponent", "row"],
			children: [
				{
					type: "div",
					props: {
						classList: ["icon"],
						children: [locationIcon],
					},
				},
				{
					type: "div",
					props: {
						classList: ["info"],
						children: [
							{
								type: "span",
								props: {
									textContent: eventData.location ? eventData.location.formatted : "",
								},
							},
						],
					},
				},
			],
		},
	});

	const inviteComponent = addComponent({
		type: "div",
		props: {
			id: "invite",
			classList: ["invitesComponent", "row"],
			children: [
				{
					type: "div",
					props: {
						classList: ["icon"],
						children: [guestsIcon],
					},
				},
				{
					type: "div",
					props: {
						classList: ["info"],
						children: [
							{
								type: "div",
								props: {
									classList: ["header"],
									textContent: "Invited",
								},
							},
						],
					},
				},
			],
		},
	});

	if (eventData.invites.length > 0) {
		eventData.invites.forEach((data) => {
			const inviteElem = addComponent({
				type: "div",
				props: {
					classList: ["invite-item"],
					textContent: data,
				},
			});

			inviteComponent.querySelector(".info").appendChild(inviteElem);
		});
	} else {
		const noInvitesElem = addComponent({
			type: "div",
			props: {
				classList: ["invite-item"],
				textContent: "No users invited",
			},
		});

		inviteComponent.querySelector(".info").appendChild(noInvitesElem);
	}

	const acceptedComponent = addComponent({
		type: "div",
		props: {
			id: "accepted",
			classList: ["acceptedComponent", "row"],
			children: [
				{
					type: "div",
					props: {
						classList: ["icon"],
						children: [guestsIcon],
					},
				},
				{
					type: "div",
					props: {
						classList: ["info"],
						children: [
							{
								type: "div",
								props: {
									classList: ["header"],
									textContent: "Accepted",
								},
							},
						],
					},
				},
			],
		},
	});

	if (eventData.accepted.length > 0) {
		eventData.accepted.forEach((data) => {
			const acceptedElem = addComponent({
				type: "div",
				props: {
					classList: ["accepted-item"],
					textContent: data,
				},
			});

			acceptedComponent.querySelector(".info").appendChild(acceptedElem);
		});
	} else {
		const noAcceptedElem = addComponent({
			type: "div",
			props: {
				classList: ["accepted-item"],
				textContent: "No users accepted",
			},
		});

		acceptedComponent.querySelector(".info").appendChild(noAcceptedElem);
	}

	const trackingComponent = addComponent({
		type: "div",
		props: {
			id: "tracking",
			classList: ["trackingComponent", "row"],
			children: [
				{
					type: "div",
					props: {
						classList: ["icon"],
						children: [trackingIcon],
					},
				},
				{
					type: "div",
					props: {
						classList: ["info"],
						children: [
							{
								type: "span",
								props: {
									textContent: eventData.tracking ? "Tracking Enabled" : "Tracking Disabled",
								},
							},
						],
					},
				},
			],
		},
	});

	const descriptionComponent = addComponent({
		type: "div",
		props: {
			id: "description",
			classList: ["descriptionComponent", "row"],
			children: [
				{
					type: "div",
					props: {
						classList: ["icon"],
						children: [descriptionIcon],
					},
				},
				{
					type: "span",
					props: {
						textContent: eventData.description ? eventData.description : "No description added",
					},
				},
			],
		},
	});

	const viewDetailsButton = addComponent({
		type: "div",
		props: {
			textContent: "View Details",
			classList: ["button", "details"],
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();

				const eventId = encodeURIComponent(eventData.eventId);
				goToPage(`/dashboard/event/${eventId}`);
			},
		},
	});

	const editButton = addComponent({
		type: "div",
		props: {
			textContent: "Edit",
			classList: ["button", "edit"],
			onClick: async (e) => {
				e.preventDefault();
				e.stopPropagation();

				editEvent(eventData);
			},
		},
	});

	const deleteButton = addComponent({
		type: "div",
		props: {
			textContent: "Delete",
			classList: ["button", "delete"],
			onClick: async (e) => {
				e.preventDefault();
				e.stopPropagation();

				const eventID = eventData.eventId;
				await deleteEvent(eventID);

				goToPage("/dashboard/current");
			},
		},
	});

	const acceptButton = addComponent({
		type: "button",
		props: {
			textContent: "Accept",
			classList: ["button", "accept"],
			onClick: async (e) => {
				e.preventDefault();
				e.stopPropagation();
				handleAcceptInvitation(eventData.eventId, currentUser);
			},
		},
	});

	const rejectButton = addComponent({
		type: "button",
		props: {
			textContent: "Reject",
			classList: ["button", "reject"],
			onClick: async (e) => {
				e.preventDefault();
				e.stopPropagation();
				handleRejectInvitation(eventData.eventId, currentUser);
			},
		},
	});

	const handleAcceptInvitation = async (eventId, currentUser) => {
		try {
			const eventUrl = `http://127.0.0.1:3001/events/${eventId}`;
			const response = await fetch(eventUrl);
			if (!response.ok) {
				throw new Error("Failed to fetch event data.");
			}
			const eventData = await response.json();

			// Remove user from invites and add to accepted if not already there
			eventData.invites = eventData.invites.filter((user) => user !== currentUser);
			if (!eventData.accepted.includes(currentUser)) {
				eventData.accepted.push(currentUser);
			}
			console.log(eventData);
			// Update event data
			const updateResponse = await fetch(eventUrl, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(eventData),
			});

			if (updateResponse.ok) {
				alert("You have successfully accepted the invitation.");
			} else {
				throw new Error("Failed to accept the invitation.");
			}
		} catch (error) {
			console.error("Error accepting invitation:", error);
			alert(error.message);
		}
	};

	const handleRejectInvitation = async (eventId, currentUser) => {
		try {
			const eventUrl = `http://127.0.0.1:3001/events/${eventId}`;
			const response = await fetch(eventUrl);
			if (!response.ok) {
				throw new Error("Failed to fetch event data.");
			}
			const eventData = await response.json();

			// Remove user from invites and accepted
			eventData.invites = eventData.invites.filter((user) => user !== currentUser);
			eventData.accepted = eventData.accepted.filter((user) => user !== currentUser);

			// Update event data
			const updateResponse = await fetch(eventUrl, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(eventData),
			});

			if (updateResponse.ok) {
				alert("You have successfully rejected the invitation.");
			} else {
				throw new Error("Failed to reject the invitation.");
			}
		} catch (error) {
			console.error("Error rejecting invitation:", error);
			alert(error.message);
		}
	};
	// Existing buttonContainerComponent with new buttons added conditionally
	const buttonContainerComponent = addComponent({
		type: "div",
		props: {
			classList: ["buttonContainer"],
			children: [
				viewDetailsButton,
				isOwner ? editButton : null,
				isOwner ? deleteButton : null,
				isInvited && !isOwner ? acceptButton : null,
				isInvited && !isOwner ? rejectButton : null,
			].filter(Boolean), // Filters out null values
		},
	});

	const mapRef = createRef();
	const elem = addComponent({
		type: "div",
		props: {
			id: "map",
			classList: ["primaryEvent", "default-event"],
			children: [
				{
					type: "div",
					ref: mapRef,
					props: {
						id: `map-${eventData.id}`,
						classList: ["left", "map"],
					},
				},
				{
					type: "div",
					props: {
						classList: ["right"],
						children: [
							titleComponent,
							dateTimeComponent,
							userComponent,
							acceptedComponent,
							eventData.location ? locationComponent : void 0,
							eventData.invites.length ? inviteComponent : null,
							trackingComponent,
							descriptionComponent,
							buttonContainerComponent,
						],
					},
				},
			],
		},
	});

	setTimeout(() => {
		if (mapRef.current) {
			try {
				const map = L.map(mapRef.current.id, mapSettings).setView([eventData.location.geometry.lat, eventData.location.geometry.lng], 13);

				L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

				L.marker([eventData.location.geometry.lat, eventData.location.geometry.lng]).addTo(map);
			} catch (e) {}
		}
	}, 100);

	return elem;
};

const initialMapSettings = {
	center: true,
	dragging: false,
	touchZoom: false,
	scrollWheelZoom: false,
	doubleClickZoom: false,
	boxZoom: false,
};

export const eventDisplayPrimaryComponent = (data, mapSettings) => {
	const elemComponent = eventDisplayElemComponent(data, !mapSettings ? initialMapSettings : mapSettings);

	const elem = addComponent({
		type: "div",
		props: {
			classList: ["primaryEventContainer"],
			children: [
				elemComponent
					? elemComponent
					: {
							type: "div",
							props: {
								classList: ["primaryEvent", "no-event"],
							},
						},
			],
		},
	});

	return elem;
};
