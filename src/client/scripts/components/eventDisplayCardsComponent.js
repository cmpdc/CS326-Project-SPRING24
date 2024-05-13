import { goToPage } from "../app.js";
import { deleteEvent, editEvent } from "../events.js";
import { addComponent, createRef, formatAMPM, getDateWithSuffix, getDayName } from "../utils.js";

const eventDisplayCardComponent = (data, index) => {
	const mapRef = createRef();

	const currentUser = localStorage.getItem("username");
	const isOwner = currentUser === data.creator;

	const locationComponent = addComponent({
		type: "div",
		props: {
			classList: ["locationDisplay", "top"],
			children: [
				{
					type: "div",
					ref: mapRef,
					props: {
						id: `map-${index}`,
						classList: ["mapView"],
					},
				},
			],
		},
	});

	setTimeout(() => {
		if (mapRef.current && data.location) {
			const map = L.map(mapRef.current.id, {
				center: true,
				zoomControl: false, // Disable zoom control
				dragging: false, // Disable dragging
				touchZoom: false, // Disable touch zoom
				scrollWheelZoom: false, // Disable scroll wheel zoom
				doubleClickZoom: false, // Disable zoom on double click
				boxZoom: false, // Disable box zoom
			}).setView([data.location.geometry.lat, data.location.geometry.lng], 13);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

			L.marker([data.location.geometry.lat, data.location.geometry.lng]).addTo(map);
		}
	}, 100);

	const fromDate = new Date(data.dateTime.from);

	const today = new Date();
	const isExpiredEvent = today > new Date(data.dateTime.from) && today > new Date(data.dateTime.to);

	const dayName = getDayName(fromDate);
	const dateWithSuffix = getDateWithSuffix(fromDate);
	const formattedDate = `${dayName}, ${fromDate.toLocaleString("default", { month: "long" })} ${dateWithSuffix}`;

	const formattedFromTime = formatAMPM(fromDate);
	const formattedTime = `${formattedFromTime}`;

	const dateTimeComponent = addComponent({
		type: "div",
		props: {
			classList: ["dateTimeDisplay", "middle"],
			children: [
				{
					type: "span",
					props: {
						textContent: formattedDate,
					},
				},
				{
					type: "span",
					props: {
						classList: ["border"],
					},
				},
				{
					type: "span",
					props: {
						textContent: formattedTime,
					},
				},
			],
		},
	});

	const viewButton = addComponent({
		type: "div",
		props: {
			classList: ["button", "details"],
			textContent: "View Details",
			onClick: (e) => {
				e.preventDefault();

				const eventId = encodeURIComponent(data.eventId);
				goToPage(`/dashboard/event/${eventId}`);
			},
		},
	});

	const editButton = addComponent({
		type: "div",
		props: {
			classList: ["button", "edit"],
			textContent: "Edit",
			onClick: async (e) => {
				e.preventDefault();
				e.stopPropagation();

				editEvent(data);
			},
		},
	});

	const deleteButton = addComponent({
		type: "div",
		props: {
			classList: ["button", "delete"],
			textContent: "Delete",
			onClick: async (e) => {
				e.stopPropagation();
				e.preventDefault();

				const eventID = data.eventId;
				await deleteEvent(eventID);
			},
		},
	});
	const isInvited = data.invites.includes(currentUser);

	const acceptButton = addComponent({
		type: "button",
		props: {
			textContent: "Accept",
			classList: ["button", "accept"],
			onClick: async (e) => {
				e.preventDefault();
				e.stopPropagation();
				// Implement the acceptance logic here
				await handleAcceptInvitation(data.eventId, currentUser);
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
				// Implement the rejection logic here
				await handleRejectInvitation(data.eventId, currentUser);
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
	const detailsComponent = addComponent({
		type: "div",
		props: {
			classList: ["descriptionDisplay", "bottom"],
			children: [
				{
					type: "div",
					props: {
						classList: ["descriptionInner"],
						children: [
							{
								type: "div",
								props: {
									classList: ["title", "info"],
									children: [
										{
											type: "b",
											props: {
												textContent: data.title,
											},
										},
									],
								},
							},
							{
								type: "div",
								props: {
									classList: ["address", "info"],
									children: [
										{
											type: "span",
											props: {
												textContent: data.location
													? `${data.location.components.town}, ${data.location.components.state}`
													: "",
											},
										},
									],
								},
							},
						],
					},
				},
				{
					type: "div",
					props: {
						classList: ["buttons"],
						children: [
							viewButton,
							isOwner || !isExpiredEvent ? editButton : null,
							isOwner ? deleteButton : null,
							...(!isOwner && isInvited ? [acceptButton, rejectButton] : []),
						],
					},
				},
			],
		},
	});

	const elem = addComponent({
		type: "div",
		props: {
			classList: ["grid-item", "default", isExpiredEvent ? "event-expired" : ""],
			children: [locationComponent, dateTimeComponent, detailsComponent],
		},
	});

	return elem;
};

export const eventDisplayCardsComponent = ({ list, emptyText }) => {
	const container = addComponent({
		type: "div",
		props: {
			classList: ["event-cards", "grid"],
		},
	});

	if (list.length > 0) {
		list.forEach((data, index) => {
			const card = eventDisplayCardComponent(data, index);
			container.appendChild(card);
		});
	} else {
		const noCardElem = addComponent({
			type: "div",
			props: {
				classList: ["grid-item", "empty"],
				children: [
					{
						type: "h4",
						props: {
							textContent: emptyText,
						},
					},
				],
			},
		});

		container.appendChild(noCardElem);
	}

	return container;
};
