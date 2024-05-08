import { locationPinIcon } from "../icons.js";
import { geocode } from "../location.js";
import { addComponent, createRef, debounce, formatAMPM, getDateWithSuffix, getDayName, insertModal, removeModalComponent } from "../utils.js";
import { DayPicker } from "./dayPicker.js";
import { InviteComponent } from "./inviteComponent.js";
import { TimePicker } from "./timePicker.js";
import Toast from "./toast.js";

const newData = {};

const editModalComponent = (data) => {
	const elemRef = createRef();

	newData.current = { ...data };

	const propertyDisplaySetting = ({ name, key, prop, propType, keyToEdit, allowEditing = false }) => {
		const propContainerElemRef = createRef();
		const propElemRef = createRef();
		const editSaveButtonElemRef = createRef();
		const cancelEditButtonRef = createRef();

		const createEditableElement = (keyToEdit, prop) => {
			let valueEditElem;

			const locationResultsRef = createRef();
			const debouncedGeocode = debounce(geocode, 500);

			switch (keyToEdit) {
				case "title":
					valueEditElem = addComponent({
						type: "div",
						props: {
							classList: ["propInput"],
							children: [
								{
									type: "input",
									props: {
										id: `${key}-input`,
										value: prop,
										onkeyup: (changeEvent) => {
											const isTheSame = changeEvent.target.value === prop;

											newData.current.title = !isTheSame ? changeEvent.target.value : data.title;

											editSaveButtonElemRef.current.disabled = isTheSame;
											editSaveButtonElemRef.current.style.pointerEvents = isTheSame ? "none" : "all";
										},
									},
								},
							],
						},
					});

					break;
				case "dateTime":
					const timeFromElementRef = createRef();
					const timeToElementRef = createRef();
					const dateElementRef = createRef();
					const dateTimeRenderElementRef = createRef();

					valueEditElem = addComponent({
						type: "div",
						props: {
							classList: ["propInput"],
							id: `${key}-input`,
							children: [
								{
									type: "div",
									props: {
										classList: ["dateTimeComponent"],
										children: [
											{
												type: "div",
												ref: dateElementRef,
												props: {
													classList: ["dateComponent"],
												},
											},
											{
												type: "div",
												props: {
													classList: ["timeComponent"],
													children: [
														{
															type: "div",
															ref: timeFromElementRef,
															props: {
																classList: ["timeComponentFrom"],
															},
														},
														{
															type: "div",
															ref: timeToElementRef,
															props: {
																classList: ["timeComponentTo"],
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
									ref: dateTimeRenderElementRef,
									props: {
										classList: ["dateTimeComponentRenderer"],
									},
								},
							],
						},
					});

					const hideCalendar = () => {
						const calendarElem = valueEditElem.querySelector(".calendar");
						const calendarButtonElem = valueEditElem.querySelector(".day-picker-toggle");

						if (calendarElem) {
							calendarElem.remove();
						}

						if (calendarButtonElem) {
							if (calendarButtonElem.classList.contains("active")) {
								calendarButtonElem.classList.remove("active");
							}
						}
					};

					const hideTimePickers = () => {
						const pickerElem = valueEditElem.querySelector(".time-picker-container");
						const pickerButtonElems = document.querySelectorAll(".time-picker-button");

						if (pickerElem) {
							pickerElem.remove();
						}

						if (pickerButtonElems) {
							pickerButtonElems.forEach((elem) => {
								if (elem.classList.contains("active")) {
									elem.classList.remove("active");
								}
							});
						}
					};

					let fromDate = new Date(prop.from);
					let toDate = new Date(prop.to);
					const today = new Date();

					const timePickerEndTime = new TimePicker({
						date: new Date(data.dateTime.to),
						date2: new Date(data.dateTime.from),
						increment: 15,
						showCurrentTime: true,
						renderButton: timeToElementRef.current,
						renderButtonClick: (event) => {
							hideCalendar();
						},
						renderTime: dateTimeRenderElementRef.current,
						disablePast: false,
						onTimeSelect: (selectedTime) => {
							const newTime = new Date(selectedTime);

							fromDate.setDate(newTime.getDate());
							toDate = newTime;

							const isTheSame = toDate === prop.to;

							newData.current.dateTime.to = !isTheSame ? toDate : data.from.to;

							editSaveButtonElemRef.current.disabled = isTheSame;
							editSaveButtonElemRef.current.style.pointerEvents = isTheSame ? "none" : "all";
						},
					});

					const timePickerStartTime = new TimePicker({
						date: new Date(data.dateTime.from),
						increment: 15,
						showCurrentTime: true,
						renderButton: timeFromElementRef.current,
						renderButtonClick: (event) => {
							hideCalendar();
						},
						renderTime: dateTimeRenderElementRef.current,
						onTimeSelect: (selectedTime) => {
							const newDate = new Date(selectedTime);

							// default to 30 minutes later
							newDate.setHours(newDate.getHours(), newDate.getMinutes() + 30);

							timePickerEndTime.setMinTime(newDate);
							timePickerEndTime.initializeButton();

							fromDate = newDate;
							toDate = newDate;

							const isTheSame = fromDate === prop.from;

							newData.current.dateTime.from = !isTheSame ? fromDate : data.from.from;

							editSaveButtonElemRef.current.disabled = isTheSame;
							editSaveButtonElemRef.current.style.pointerEvents = isTheSame ? "none" : "all";
						},
					});

					const eventDateInput = new DayPicker({
						fixedWeeks: true,
						showWeekNumber: false,
						date: new Date(data.dateTime.from),
						renderButton: dateElementRef.current,
						renderButtonClick: (event) => {
							hideTimePickers();
						},
						renderCalendar: dateTimeRenderElementRef.current,
						onDateChangeConfirm: (selectedDate) => {
							const newDate = new Date(selectedDate);

							const dateForTo = new Date(selectedDate);
							dateForTo.setHours(newDate.getHours() + 1);

							fromDate.setDate(newDate.getDate());
							toDate = newDate < today ? today : newDate;

							if (newDate < today) {
								newDate.setHours(today.getHours() + 1, 0);
								dateForTo.setHours(newDate.getHours() + 1, 0);
							}

							timePickerStartTime.setMinTime(newDate);
							timePickerStartTime.initializeButton();

							timePickerEndTime.setMinTime(dateForTo);
							timePickerEndTime.initializeButton();

							const isTheSame = toDate === prop.to && fromDate === prop.from;

							newData.current.dateTime.to = !isTheSame ? toDate : data.from.to;
							newData.current.dateTime.from = !isTheSame ? fromDate : data.from.from;

							editSaveButtonElemRef.current.disabled = isTheSame;
							editSaveButtonElemRef.current.style.pointerEvents = isTheSame ? "none" : "all";
						},
					});

					break;
				case "invites":
					const inviteListData = [];

					const inviteListComponent = new InviteComponent({
						emailList: data.invites,
						onUpdateDelete: (email) => {
							const index = inviteListData.indexOf(email);
							if (index > -1) {
								inviteListData.splice(index, 1);
							}

							handleInviteListChange();
						},
						onInputEnter: (email) => {
							inviteListData.push(email);
							handleInviteListChange();
						},
					});

					const handleInviteListChange = () => {
						const isTheSame = () => {
							return inviteListData.every((emailData, index) => {
								return emailData === data.invites[index];
							});
						};

						newData.current.invites = !isTheSame() ? inviteListData : null;

						editSaveButtonElemRef.current.disabled = isTheSame();
						editSaveButtonElemRef.current.style.pointerEvents = isTheSame() ? "none" : "all";
					};

					valueEditElem = addComponent({
						type: "div",
						props: {
							classList: ["inviteContainer"],
							children: [inviteListComponent.render()],
						},
					});

					break;
				case "locationInput":
					valueEditElem = addComponent({
						type: "div",
						props: {
							classList: ["locationContainer"],
							children: [
								{
									type: "div",
									props: {
										classList: ["locationContainerInput"],
										children: [
											{
												type: "input",
												props: {
													id: "location",
													value: data.location.formatted ? data.location.formatted : "",
													placeholder: !data.location.formatted ? "Where do you want to go?" : "",
													onInput: async (locationEvent) => {
														locationEvent.stopPropagation();
														locationEvent.preventDefault();

														const query = locationEvent.target.value;
														if (!query) return;

														const infoElem = addComponent({
															type: "li",
															props: {
																classList: ["info"],
																children: [
																	{
																		type: "span",
																		props: {
																			textContent: "Searching...",
																		},
																	},
																],
															},
														});

														if (!locationResultsRef.current.firstChild) {
															locationResultsRef.current.appendChild(infoElem);
														}

														const results = await debouncedGeocode(query);
														if (results && Object.prototype.toString.call(results) === "[object Array]") {
															locationResultsRef.current.innerHTML = "";

															results.forEach((result) => {
																const resultElem = addComponent({
																	type: "li",
																	props: {
																		onClick: (resultEvent) => {
																			resultEvent.stopPropagation();
																			resultEvent.preventDefault();

																			newData.current.location =
																				result === data.location ? data.location : result;

																			valueEditElem.querySelector("#location").value = result
																				? result.formatted
																				: "";

																			locationResultsRef.current.innerHTML = "";

																			const isTheSame = data.location === result;
																			editSaveButtonElemRef.current.disabled = isTheSame;
																			editSaveButtonElemRef.current.style.pointerEvents = isTheSame
																				? "none"
																				: "all";
																		},
																		classList: ["result"],
																		children: [
																			{
																				type: "span",
																				props: {
																					classList: ["icon"],
																					children: [locationPinIcon],
																				},
																			},
																			{
																				type: "span",
																				props: {
																					textContent: result ? result.formatted : "",
																				},
																			},
																		],
																	},
																});

																locationResultsRef.current.appendChild(resultElem);
															});
														} else {
															locationResultsRef.current.innerHTML = "";
														}
													},
												},
											},
										],
									},
								},
								{
									type: "ul",
									ref: locationResultsRef,
									props: {
										classList: ["locationsResults"],
									},
								},
							],
						},
					});

					break;
				case "trackingBoolean":
					let trackingSelection = data.tracking;

					valueEditElem = addComponent({
						type: "div",
						props: {
							classList: ["trackingContainer"],
							children: [
								{
									type: "span",
									props: {
										textContent: "Yes",
										onClick: (e) => {
											e.preventDefault();
											e.stopPropagation();

											trackingSelection = true;
											handleTrackingSelection(e);
										},
									},
								},
								{
									type: "span",
									props: {
										textContent: "No",
										onClick: (e) => {
											e.preventDefault();
											e.stopPropagation();

											trackingSelection = false;
											handleTrackingSelection(e);
										},
									},
								},
							],
						},
					});

					const selectedName = "selected";

					if (data.tracking) {
						valueEditElem.children[0].classList.add(selectedName);
					} else {
						valueEditElem.children[1].classList.add(selectedName);
					}

					const handleTrackingSelection = (e) => {
						e.stopPropagation();
						e.preventDefault();

						valueEditElem.querySelectorAll("span").forEach((item) => {
							if (item.textContent !== e.target.textContent) {
								if (item.classList.contains(selectedName)) {
									item.classList.remove(selectedName);
								}
							} else {
								e.target.classList.add(selectedName);
							}
						});

						const isTheSame = data.tracking === trackingSelection;
						editSaveButtonElemRef.current.disabled = isTheSame;
						editSaveButtonElemRef.current.style.pointerEvents = isTheSame ? "none" : "all";

						newData.current.tracking = !isTheSame ? trackingSelection : data.tracking;
					};

					break;
				case "descriptionInput":
					valueEditElem = addComponent({
						type: "div",
						props: {
							classList: ["textareaValue"],
							children: [
								{
									type: "textarea",
									props: {
										id: "description",
										value: data.description !== "" ? data.description : "",
										placeholder: data.description !== "" ? "" : "No description added. Wanna add something?",
										onInput: (e) => {
											e.preventDefault();
											e.stopPropagation();

											const isTheSame = data.description === e.target.value;
											editSaveButtonElemRef.current.disabled = isTheSame;
											editSaveButtonElemRef.current.style.pointerEvents = isTheSame ? "none" : "all";

											newData.current.description = !isTheSame ? e.target.value : data.description;
										},
									},
								},
							],
						},
					});

					break;
				default:
					break;
			}

			return valueEditElem;
		};

		const createInitialElement = (_propType, _prop) => {
			let elem;
			switch (_propType) {
				case "date1":
					const eventDate = new Date(_prop);

					const eventDayName = getDayName(eventDate);
					const eventDateWithSuffix = getDateWithSuffix(eventDate);
					const eventFormattedDate = `${eventDayName}, ${eventDate.toLocaleString("default", { month: "long" })} ${eventDateWithSuffix}`;

					const eventFormattedDateTime = formatAMPM(eventDate);
					const eventFormattedTime = `${eventFormattedDateTime}`;

					elem = addComponent({
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
					const eventFromDate = new Date(_prop.from);
					const eventToDate = new Date(_prop.to);

					const _eventDayName = getDayName(eventFromDate);
					const _eventDateWithSuffix = getDateWithSuffix(eventFromDate);
					const _eventFormattedDate = `${_eventDayName}, ${eventFromDate.toLocaleString("default", { month: "long" })} ${_eventDateWithSuffix}`;

					const _eventFormattedFromTime = formatAMPM(eventFromDate);
					const _eventFormattedToTime = formatAMPM(eventToDate);
					const _eventFormattedTime = `${_eventFormattedFromTime} — ${_eventFormattedToTime}`;

					elem = addComponent({
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
					elem = addComponent({
						type: "div",
						ref: propElemRef,
						props: {
							classList: ["email-list"],
						},
					});

					_prop.map((child) => {
						const childElem = addComponent({
							type: "div",
							props: {
								classList: ["email-item"],
								textContent: child,
							},
						});

						elem.appendChild(childElem);
					});

					break;
				default:
					elem = addComponent({
						type: "div",
						ref: propElemRef,
						props: {
							classList: ["value"],
							textContent: _prop,
						},
					});

					break;
			}

			return elem;
		};

		const initialValueElem = createInitialElement(propType, prop);

		const handleEditButtonClick = (e) => {
			e.target.disabled = true;
			e.target.style.pointerEvents = "none";
			e.target.textContent = "Save";

			const valueEditElem = createEditableElement(keyToEdit, prop);

			if (propContainerElemRef.current) {
				propContainerElemRef.current.innerHTML = "";
				propContainerElemRef.current.appendChild(valueEditElem);
			}

			if (editSaveButtonElemRef.current) {
				editSaveButtonElemRef.current.parentElement.appendChild(cancelEditButtonElem);
			}
		};

		const handleSaveButtonClick = async (e) => {
			if (data[key] === newData.current[key]) {
				return;
			}

			const currentDateTime = new Date();
			newData.current.editedDateTime = currentDateTime; // to keep track when an event was modified

			const updateEvent = new CustomEvent("updateEvent");
			document.dispatchEvent(updateEvent);

			// backend here
			try {
				const response = await fetch(`http://127.0.0.1:3001/events/${newData.current._id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newData.current),
				});

				if (response.ok) {
					const responseBody = await response.json();
					newData.current._rev = responseBody.rev;
					newData.current._id = responseBody.id;

					data = newData.current;

					new Toast({
						text: `Update successful for ${key}!`,
					});

					if (cancelEditButtonRef.current) {
						cancelEditButtonRef.current.remove();
					}

					let newElem;
					switch (keyToEdit) {
						case "title":
							newElem = createInitialElement("string", newData.current.title);
							break;
						case "dateTime":
							newElem = createInitialElement("date2", newData.current.dateTime);
							break;
						case "invites":
							newElem = createInitialElement("listString", newData.current.invites);
							break;
						case "locationInput":
							newElem = createInitialElement(
								"string",
								newData.current.location ? newData.current.location.formatted : "No location added",
							);
							break;
						case "trackingBoolean":
							newElem = createInitialElement("string", newData.current.tracking ? "Tracking Enabled" : "Tracking Disabled");
							break;
						case "descriptionInput":
							newElem = createInitialElement(
								"string",
								newData.current.description ? newData.current.description : "No description added",
							);
							break;
						default:
							break;
					}

					handleSaveToEditClick();
					if (propContainerElemRef.current) {
						propContainerElemRef.current.innerHTML = "";
						propContainerElemRef.current.appendChild(newElem);
					}
				} else {
					new Toast({
						text: `Failed to update!`,
					});
				}
			} catch (error) {
				console.error(`Error updating event:`, error);
			}
		};

		const handleSaveToEditClick = () => {
			editSaveButtonElemRef.current.textContent = "Edit";
			editSaveButtonElemRef.current.disabled = false;
			editSaveButtonElemRef.current.style.pointerEvents = "all";
		};

		const handleCancelButtonClick = async (e) => {
			e.stopPropagation();
			e.preventDefault();

			newData.current[key] = data[key]; // revert data

			if (cancelEditButtonRef.current) {
				cancelEditButtonRef.current.remove();
			}

			handleSaveToEditClick();

			if (propContainerElemRef.current) {
				propContainerElemRef.current.innerHTML = "";
				propContainerElemRef.current.appendChild(initialValueElem);
			}
		};

		const cancelEditButtonElem = addComponent({
			type: "button",
			ref: cancelEditButtonRef,
			props: {
				type: "button",
				textContent: "Cancel",
				onClick: (e) => {
					handleCancelButtonClick(e);
				},
			},
		});

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
								addComponent({
									type: "div",
									ref: propContainerElemRef,
									props: {
										classList: ["value"],
										children: [initialValueElem],
									},
								}),
							],
						},
					}),
					allowEditing
						? addComponent({
								type: "div",
								props: {
									classList: ["buttonContainer"],
									children: [
										addComponent({
											type: "button",
											ref: editSaveButtonElemRef,
											props: {
												type: "button",
												textContent: "Edit",
												onClick: async (e) => {
													e.stopPropagation();
													e.preventDefault();

													if (e.target.textContent === "Edit") {
														handleEditButtonClick(e);
													}

													if (e.target.textContent === "Save") {
														await handleSaveButtonClick(e);
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

	const handleCloseButtonClick = (e) => {
		e.stopPropagation();
		e.preventDefault();

		removeModalComponent(elemRef.current);
	};

	const closeButtonContainer = addComponent({
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
									textContent: "Close",
									onClick: (e) => {
										handleCloseButtonClick(e);
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
							propertyDisplaySetting({
								name: "Event Title",
								key: "title",
								propType: "string",
								prop: data.title,
								allowEditing: true,
								keyToEdit: "title",
							}),
							propertyDisplaySetting({ name: "Creator", key: "creator", propType: "string", prop: data.creator }),
							propertyDisplaySetting({ name: "Created At", key: "createdDateTime", propType: "date1", prop: data.createdDateTime }),
							propertyDisplaySetting({
								name: "Event Date",
								key: "dateTime",
								propType: "date2",
								prop: data.dateTime,
								allowEditing: true,
								keyToEdit: "dateTime",
							}),
							propertyDisplaySetting({
								name: "Invites",
								key: "invites",
								propType: "listString",
								prop: data.invites,
								allowEditing: true,
								keyToEdit: "invites",
							}),
							propertyDisplaySetting({
								name: "Location",
								key: "location",
								propType: "string",
								prop: data.location ? data.location.formatted : "No location added",
								allowEditing: true,
								keyToEdit: "locationInput",
							}),
							propertyDisplaySetting({
								name: "Tracking",
								key: "tracking",
								propType: "string",
								prop: data.tracking ? "Tracking Enabled" : "Tracking Disabled",
								allowEditing: true,
								keyToEdit: "trackingBoolean",
							}),
							propertyDisplaySetting({
								name: "Description",
								key: "description",
								propType: "string",
								prop: data.description ? data.description : "No description added",
								allowEditing: true,
								keyToEdit: "descriptionInput",
							}),
							closeButtonContainer,
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

	console.log("Data to edit:", data);
};
