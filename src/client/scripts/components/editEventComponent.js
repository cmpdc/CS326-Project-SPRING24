import { addComponent, createRef, formatAMPM, getDateWithSuffix, getDayName, insertModal, removeModalComponent } from "../utils.js";

const editModalComponent = (data) => {
	console.log("Data to edit:", data);

	const elemRef = createRef();

	const propertyDisplaySetting = ({ name, key, prop, propType, allowEditing = false }) => {
		const propElemRef = createRef();
		const buttonElemRef = createRef();

		const handleEditButton = (e) => {
			e.target.disabled = true;
			e.target.style.pointerEvents = "none";
			e.target.textContent = "Save";

			propElemRef.current.innerHTML = "";

			const propElemInput = addComponent({
				type: "input",
				props: {
					classList: ["propInput"],
					id: `${key}-input`,
					value: prop,
					onkeyup: (changeEvent) => {
						const isTheSame = changeEvent.target.value === prop;

						e.target.disabled = isTheSame;
						e.target.style.pointerEvents = isTheSame ? "none" : "all";
					},
				},
			});

			propElemRef.current.appendChild(propElemInput);
		};

		const handleSaveButton = async (e) => {
			// const inputElem = propElemRef.current.querySelector("input");
			// const updatedValue = inputElem.value;
			// if (data[key] === updatedValue) {
			// 	return;
			// }
			// Add backend fetching here
		};

		let valueElem;
		switch (propType) {
			case "date1":
				const eventDate = new Date(prop);

				const eventDayName = getDayName(eventDate);
				const eventDateWithSuffix = getDateWithSuffix(eventDate);
				const eventFormattedDate = `${eventDayName}, ${eventDate.toLocaleString("default", { month: "long" })} ${eventDateWithSuffix}`;

				const eventFormattedDateTime = formatAMPM(eventDate);
				const eventFormattedTime = `${eventFormattedDateTime}`;

				valueElem = addComponent({
					type: "div",
					ref: propElemRef,
					props: {
						classList: ["value"],
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
				});

				break;
			case "date2":
				const eventFromDate = new Date(prop.from);
				const eventToDate = new Date(prop.to);

				const _eventDayName = getDayName(eventFromDate);
				const _eventDateWithSuffix = getDateWithSuffix(eventFromDate);
				const _eventFormattedDate = `${_eventDayName}, ${eventFromDate.toLocaleString("default", { month: "long" })} ${_eventDateWithSuffix}`;

				const _eventFormattedFromTime = formatAMPM(eventFromDate);
				const _eventFormattedToTime = formatAMPM(eventToDate);
				const _eventFormattedTime = `${_eventFormattedFromTime} — ${_eventFormattedToTime}`;

				valueElem = addComponent({
					type: "div",
					ref: propElemRef,
					props: {
						classList: ["value"],
						children: [
							{
								type: "span",
								props: {
									textContent: _eventFormattedDate,
								},
							},
							{ type: "span", props: { textContent: "•" } },
							{
								type: "span",
								props: {
									textContent: _eventFormattedTime,
								},
							},
						],
					},
				});

				break;
			case "listString":
				valueElem = addComponent({
					type: "div",
					ref: propElemRef,
					props: {
						classList: ["value"],
					},
				});

				prop.map((child) => {
					const childElem = addComponent({
						type: "div",
						props: {
							classList: ["listItem"],
							textContent: child,
						},
					});

					valueElem.appendChild(childElem);
				});

				break;
			default:
				valueElem = addComponent({
					type: "div",
					ref: propElemRef,
					props: {
						classList: ["value"],
						textContent: prop,
					},
				});

				break;
		}

		return addComponent({
			type: "div",
			props: {
				classList: ["fieldRow", allowEditing ? "fieldRowDouble" : "fieldRowSingle"],
				id: `${key}Row`,
				children: [
					addComponent({
						type: "div",
						props: {
							classList: ["fieldInner"],
							children: [
								addComponent({
									type: "span",
									props: {
										classList: ["title"],
										textContent: name,
									},
								}),
								valueElem,
							],
						},
					}),
					allowEditing
						? addComponent({
								type: "div",
								props: {
									classList: ["editButtonContainer"],
									children: [
										addComponent({
											type: "button",
											ref: buttonElemRef,
											props: {
												type: "button",
												textContent: "Edit",
												onClick: async (e) => {
													e.stopPropagation();
													e.preventDefault();

													if (e.target.textContent === "Edit") {
														handleEditButton(e);
													}

													if (e.target.textContent === "Save") {
														await handleSaveButton(e);
													}
												},
											},
										}),
									],
								},
							})
						: null,
				],
			},
		});
	};

	const headerElem = addComponent({
		type: "h1",
		props: {
			textContent: `Edit Event`,
		},
	});

	const handleCancelButtonClick = (e) => {
		e.stopPropagation();
		e.preventDefault();

		removeModalComponent(elemRef.current);
	};

	const cancelButtonContainer = addComponent({
		type: "div",
		props: {
			classList: ["fieldRow", "fieldRowSingle", "fieldRowCenter"],
			style: "margin-top: 20px;",
			children: [
				addComponent({
					type: "div",
					props: {
						classList: ["fieldInner"],
						children: [
							addComponent({
								type: "button",
								props: {
									type: "button",
									classList: ["danger"],
									textContent: "Cancel",
									onClick: (e) => {
										handleCancelButtonClick(e);
									},
								},
							}),
						],
					},
				}),
			],
		},
	});

	const elem = addComponent({
		type: "div",
		ref: elemRef,
		props: {
			classList: ["editEventModal"],
			children: [
				{
					type: "div",
					props: {
						classList: ["editEventModalInner"],
						children: [
							headerElem,
							propertyDisplaySetting({ name: "Event Title", key: "title", propType: "string", prop: data.title, allowEditing: true }),
							propertyDisplaySetting({ name: "Creator", key: "creator", propType: "string", prop: JSON.parse(data.creator) }),
							propertyDisplaySetting({ name: "Created At", key: "createdDateTime", propType: "date1", prop: data.createdDateTime }),
							propertyDisplaySetting({
								name: "Event Date",
								key: "dateTime",
								propType: "date2",
								prop: data.dateTime,
								allowEditing: true,
							}),
							propertyDisplaySetting({
								name: "Event Location",
								key: "location",
								propType: "string",
								prop: data.location ? data.location.formatted : "No location added",
								allowEditing: true,
							}),
							propertyDisplaySetting({
								name: "Event Invites",
								key: "invites",
								propType: "listString",
								prop: data.invites,
								allowEditing: true,
							}),
							propertyDisplaySetting({
								name: "Event Tracking",
								key: "tracking",
								propType: "string",
								prop: data.tracking ? "Tracking Enabled" : "Tracking Disabled",
								allowEditing: true,
							}),
							propertyDisplaySetting({
								name: "Event Description",
								key: "description",
								propType: "string",
								prop: data.description ? data.description : "No description added",
								allowEditing: true,
							}),
							cancelButtonContainer,
						],
					},
				},
			],
		},
	});

	return elem;
};

export const editEventComponent = (data) => {
	insertModal(editModalComponent(data));
};
