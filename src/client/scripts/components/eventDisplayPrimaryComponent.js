import { descriptionIcon, guestsIcon, locationIcon, timeIcon, trackingIcon } from "../icons.js";
import { addComponent, createRef, formatAMPM, getDateWithSuffix, getDayName } from "../utils.js";

const eventDisplayElemComponent = (eventData) => {
	if (!eventData) return null;

	const titleComponent = addComponent({
		type: "h2",
		props: {
			textContent: eventData.title,
		},
	});

	const fromDate = new Date(eventData.dateTime.from);
	const toDate = new Date(eventData.dateTime.to);

	const dayName = getDayName(fromDate);
	const dateWithSuffix = getDateWithSuffix(fromDate);
	const formattedDate = `${dayName}, ${fromDate.toLocaleString("default", { month: "long" })} ${dateWithSuffix}`;

	const formattedFromTime = formatAMPM(fromDate);
	const formattedToTime = formatAMPM(toDate);
	const formattedTime = `${formattedFromTime} — ${formattedToTime}`;

	const dateTimeComponent = addComponent({
		type: "div",
		props: {
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
						classList: ["info", "row"],
						children: [
							{
								type: "span",
								props: {
									textContent: formattedDate,
								},
							},
							{ type: "span", props: { textContent: "•" } },
							{
								type: "span",
								props: {
									textContent: formattedTime,
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
									textContent: eventData.location.formatted,
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
					},
				},
			],
		},
	});

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

	const trackingComponent = addComponent({
		type: "div",
		props: {
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
									textContent: eventData.tracking ? "Yes" : "No",
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
						textContent: eventData.description ? eventData.description : "None",
					},
				},
			],
		},
	});

	const mapRef = createRef();
	const elem = addComponent({
		type: "div",
		props: {
			classList: ["primaryEvent", "default-event"],
			children: [
				{
					type: "div",
					ref: mapRef,
					props: {
						id: `map-${eventData.id}`,
						classList: ["left"],
					},
				},
				{
					type: "div",
					props: {
						classList: ["right"],
						children: [
							titleComponent,
							dateTimeComponent,
							locationComponent,
							eventData.invites.length ? inviteComponent : null,
							trackingComponent,
							descriptionComponent,
						],
					},
				},
			],
		},
	});

	setTimeout(() => {
		if (mapRef.current) {
			try {
				const map = L.map(mapRef.current.id, {
					center: true,
					dragging: false,
					touchZoom: false,
					scrollWheelZoom: false,
					doubleClickZoom: false,
					boxZoom: false,
				}).setView([eventData.location.geometry.lat, eventData.location.geometry.lng], 13);

				L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

				L.marker([eventData.location.geometry.lat, eventData.location.geometry.lng]).addTo(map);
			} catch (e) {}
		}
	}, 100);

	return elem;
};

export const eventDisplayPrimaryComponent = (data) => {
	const elem = addComponent({
		type: "div",
		props: {
			classList: ["primaryEventContainer"],
			children: [
				eventDisplayElemComponent(data)
					? eventDisplayElemComponent(data)
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
