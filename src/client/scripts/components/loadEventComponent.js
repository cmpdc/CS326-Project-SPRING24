import Database from "../../server/database.js";
import { descriptionIcon, guestsIcon, locationIcon, locationPinIcon, maximizeIcon, minimizeIcon, timeIcon, trackingIcon } from "../icons.js";
import { geocode } from "../location.js";
import { addComponent, createRef, debounce, insertModal, removeModalComponent } from "../utils.js";
import { DayPicker } from "./dayPicker.js";
import { InviteComponent } from "./inviteComponent.js";
import { TimePicker } from "./timePicker.js";

const eventContainerClassName = "eventContainer";

const eventElementContent = (element) => {
	const iconClassName = "event-icon";

	const today = new Date();
	let eventStartGlobal = new Date();
	eventStartGlobal.setHours(today.getHours() + 1, 0, 0, 0);

	let eventEndGlobal = new Date();
	eventEndGlobal.setHours(today.getHours() + 2, 0, 0, 0);

	let locationSelection = null;
	const debouncedGeocode = debounce(geocode, 500);

	let trackingSelection = false;

	const inviteComponent = new InviteComponent();

	const dateTimeWrapperRef = createRef();
	const dateTimeComponentRendererRef = createRef();
	const guestWrapperRef = createRef();
	const locationWrapperRef = createRef();
	const locationResultsRef = createRef();
	const trackingWrapperRef = createRef();
	const descriptionWrapperRef = createRef();

	const saveButtonRef = createRef();

	const addInputComponent = (obj) => {
		obj.props.classList = ["input"];

		return addComponent({
			type: "div",
			props: {
				classList: ["eventInputWrapper"],
				children: [
					{ ...obj },
					{
						type: "span",
						props: {
							classList: ["spanBorder"],
						},
					},
				],
			},
		});
	};

	const titleComponent = addInputComponent({
		type: "input",
		props: {
			id: "title",
			placeholder: "Add Title",
		},
	});

	const dateComponentFrom = addComponent({
		type: "div",
		props: {
			classList: ["dateComponent", "dateComponentFrom"],
			textContent: "Date Component",
		},
	});

	const timeComponentFrom = addComponent({
		type: "div",
		props: {
			classList: ["timeComponent", "timeComponentFrom"],
		},
	});

	const timeComponentTo = addComponent({
		type: "div",
		props: {
			classList: ["timeComponent", "timeComponentTo"],
		},
	});

	const dateTimeComponent = addComponent({
		type: "div",
		props: {
			classList: ["dateTimeComponent"],
			children: [
				{
					type: "div",
					props: {
						classList: ["dateTimeComponentInner"],
						children: [
							{
								type: "div",
								props: {
									classList: ["col"],
									children: [{ type: "span", props: { textContent: "Date", classList: ["title"] } }, dateComponentFrom],
								},
							},
							{
								type: "div",
								props: {
									classList: ["col"],
									children: [{ type: "span", props: { textContent: "From", classList: ["title"] } }, timeComponentFrom],
								},
							},
							{
								type: "div",
								props: {
									classList: ["col"],
									children: [{ type: "span", props: { textContent: "To", classList: ["title"] } }, timeComponentTo],
								},
							},
						],
					},
				},
				{
					type: "div",
					ref: dateTimeComponentRendererRef,
					props: {
						classList: ["dateTimeComponentRenderer"],
					},
				},
			],
		},
	});

	const locationComponent = addComponent({
		type: "div",
		props: {
			classList: ["locationContainer"],
			children: [
				addInputComponent({
					type: "input",
					props: {
						id: "location",
						placeholder: "Where do you want to go?",
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

												locationSelection = result;

												locationComponent.querySelector("#location").value = result.formatted;
												locationResultsRef.current.innerHTML = "";
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
														textContent: result.formatted,
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
				}),
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

	const handleTrackingSelection = (e) => {
		e.stopPropagation();
		e.preventDefault();

		const activeName = "active";

		trackingWrapperRef.current.querySelectorAll("span").forEach((item) => {
			if (item.textContent !== e.target.textContent) {
				if (item.classList.contains(activeName)) {
					item.classList.remove(activeName);
				}
			} else {
				e.target.classList.add(activeName);
			}
		});
	};

	const trackingComponent = addComponent({
		type: "div",
		props: {
			classList: ["trackingContainer"],
			children: [
				{
					type: "span",
					props: {
						textContent: "Yes",
						onClick: (e) => {
							handleTrackingSelection(e);
							trackingSelection = true;
						},
					},
				},
				{
					type: "span",
					props: {
						textContent: "No",
						onClick: (e) => {
							handleTrackingSelection(e);
							trackingSelection = false;
						},
					},
				},
			],
		},
	});

	const descriptionComponent = addInputComponent({
		type: "textarea",
		props: {
			id: "description",
			placeholder: "Add meeting notes here",
		},
	});

	const handleComponentClick = (e, type) => {
		e.preventDefault();
		e.stopPropagation();

		if (!e.target.parentElement.classList.contains("default")) return;
		e.target.parentElement.classList.remove("default");
		saveButtonRef.current.disabled = false;

		if (!e.target.parentElement.parentElement.classList.contains("revealed")) {
			e.target.parentElement.parentElement.classList.add("revealed");
		}

		const replaceContent = (ref, newContent) => {
			while (ref.current.firstChild) {
				ref.current.removeChild(ref.current.firstChild);
			}

			if (typeof newContent === "object") {
				ref.current.appendChild(newContent);
			} else if (typeof newContent === "string") {
				ref.current.textContent = newContent;
			}
		};

		let targetRef;
		let newContent;

		switch (type) {
			case "dateTime":
				targetRef = dateTimeWrapperRef;
				newContent = dateTimeComponent;

				let calendarPicker = null;
				let timePickerEndTime = null;
				let timePickerStartTime = null;

				const hideCalendar = () => {
					const calendarElem = dateTimeComponentRendererRef.current.querySelector(".calendar");
					const calendarButtonElem = dateComponentFrom.querySelector(".day-picker-toggle");

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
					const pickerElem = dateTimeComponentRendererRef.current.querySelector(".time-picker-container");
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

				timePickerEndTime = new TimePicker({
					date: eventEndGlobal,
					date2: eventEndGlobal,
					increment: 15,
					showCurrentTime: true,
					renderButton: timeComponentTo,
					renderButtonClick: (event) => {
						hideCalendar();
					},
					renderTime: dateTimeComponentRendererRef.current,
					disablePast: true,
					onTimeSelect: (selectedTime) => {
						const newTime = new Date(selectedTime);

						eventStartGlobal.setDate(newTime.getDate());
						eventEndGlobal = newTime;
					},
				});

				timePickerStartTime = new TimePicker({
					date: eventStartGlobal,
					increment: 15,
					showCurrentTime: true,
					renderButton: timeComponentFrom,
					renderButtonClick: (event) => {
						hideCalendar();
					},
					disablePast: true,
					renderTime: dateTimeComponentRendererRef.current,
					onTimeSelect: (selectedTime) => {
						const newDate = new Date(selectedTime);

						// default to 30 minutes later
						newDate.setHours(newDate.getHours(), newDate.getMinutes() + 30);

						timePickerEndTime.setMinTime(newDate);
						timePickerEndTime.initializeButton();

						eventEndGlobal = newDate;
						eventStartGlobal = newDate;
					},
				});

				calendarPicker = new DayPicker({
					fixedWeeks: true,
					showWeekNumber: false,
					date: eventStartGlobal,
					renderButton: dateComponentFrom,
					renderButtonClick: (event) => {
						hideTimePickers();
					},
					renderCalendar: dateTimeComponentRendererRef.current,
					onDateChangeConfirm: (selectedDate) => {
						const newDate = new Date(selectedDate);

						const dateForTo = new Date(selectedDate);
						dateForTo.setHours(newDate.getHours() + 1);

						eventStartGlobal.setDate(newDate.getDate());
						eventEndGlobal = newDate < today ? today : newDate;

						if (newDate < today) {
							newDate.setHours(today.getHours() + 1, 0);
							dateForTo.setHours(newDate.getHours() + 1, 0);
						}

						timePickerStartTime.setMinTime(newDate);
						timePickerStartTime.initializeButton();

						timePickerEndTime.setMinTime(dateForTo);
						timePickerEndTime.initializeButton();
					},
				});

				break;

			case "invites":
				targetRef = guestWrapperRef;
				newContent = inviteComponent.render();
				break;

			case "location":
				targetRef = locationWrapperRef;
				newContent = locationComponent;
				break;

			case "tracking":
				targetRef = trackingWrapperRef;
				newContent = trackingComponent;
				break;

			case "description":
				targetRef = descriptionWrapperRef;
				newContent = descriptionComponent;
				break;

			default:
				return;
		}

		if (targetRef && newContent) {
			replaceContent(targetRef, newContent);
		}
	};

	const contentContainer = addComponent({
		type: "div",
		props: {
			classList: ["eventContent"],
		},
	});

	const titleContainer = addComponent({
		type: "div",
		props: {
			classList: ["titleContainer", "wide"],
			children: [
				{
					type: "div",
					props: {
						classList: ["titleInner", "titleWrapper"],
						children: [titleComponent],
					},
				},
			],
		},
	});

	const dateTimeContainer = addComponent({
		type: "div",
		props: {
			classList: ["dateTimeContainer", "column"],
			children: [
				{
					type: "div",
					props: {
						classList: [iconClassName],
						children: [timeIcon],
					},
				},
				{
					type: "div",
					ref: dateTimeWrapperRef,
					props: {
						classList: ["rightSide", "componentWrapper", "default"],
						children: [
							{
								type: "span",
								props: {
									textContent: "Add time and calendar",
									onClick: (e) => {
										handleComponentClick(e, "dateTime");
									},
								},
							},
						],
					},
				},
			],
		},
	});

	const inviteContainer = addComponent({
		type: "div",
		props: {
			classList: ["inviteContainer", "column"],
			children: [
				{
					type: "div",
					props: {
						classList: [iconClassName],
						children: [guestsIcon],
					},
				},
				{
					type: "div",
					ref: guestWrapperRef,
					props: {
						classList: ["rightSide", "componentWrapper", "default"],
						children: [
							{
								type: "span",
								props: {
									textContent: "Invite friends or guests",
									onClick: (e) => {
										handleComponentClick(e, "invites");
									},
								},
							},
						],
					},
				},
			],
		},
	});

	const locationContainer = addComponent({
		type: "div",
		props: {
			classList: ["locationContainer", "column"],
			children: [
				{
					type: "div",
					props: {
						classList: [iconClassName],
						children: [locationIcon],
					},
				},
				{
					type: "div",
					ref: locationWrapperRef,
					props: {
						classList: ["rightSide", "componentWrapper", "default"],
						children: [
							{
								type: "span",
								props: {
									textContent: "Add location",
									onClick: (e) => {
										handleComponentClick(e, "location");
									},
								},
							},
						],
					},
				},
			],
		},
	});

	const trackingContainer = addComponent({
		type: "div",
		props: {
			classList: ["trackingContainer", "column"],
			children: [
				{
					type: "div",
					props: {
						classList: [iconClassName],
						children: [trackingIcon],
					},
				},
				{
					type: "div",
					ref: trackingWrapperRef,
					props: {
						classList: ["rightSide", "componentWrapper", "default"],
						children: [
							{
								type: "span",
								props: {
									textContent: "Allow tracking",
									onClick: (e) => {
										handleComponentClick(e, "tracking");
									},
								},
							},
						],
					},
				},
			],
		},
	});

	const descriptionContainer = addComponent({
		type: "div",
		props: {
			classList: ["descriptionContainer", "column"],
			children: [
				{
					type: "div",
					props: {
						classList: [iconClassName],
						children: [descriptionIcon],
					},
				},
				{
					type: "div",
					ref: descriptionWrapperRef,
					props: {
						classList: ["rightSide", "componentWrapper", "default"],
						children: [
							{
								type: "span",
								props: {
									textContent: "Add meeting notes",
									onClick: (e) => {
										handleComponentClick(e, "description");
									},
								},
							},
						],
					},
				},
			],
		},
	});

	const handleSaveButtonClick = async (e) => {
		e.stopPropagation();
		e.preventDefault();

		const data = {
			title: titleComponent.querySelector("#title").value,
			dateTime: {
				from: eventStartGlobal,
				to: eventEndGlobal,
			},
			invites: inviteComponent.getInviteList(),
			location: locationSelection,
			tracking: trackingSelection,
			description: descriptionComponent.querySelector("#description").value,
		};

		Object.freeze(data);

		const db = new Database("events");

		const createdEvent = await db.create(data);

		const readNewEvent = await db.read(createdEvent.id);

		console.log(readNewEvent);
	};

	const buttonContainer = addComponent({
		type: "div",
		props: {
			classList: ["buttonContainer", "wide"],
			children: [
				{
					type: "button",
					ref: saveButtonRef,
					props: {
						type: "button",
						disabled: true,
						classList: ["button", "saveButton"],
						textContent: "Save",
						onClick: async (e) => {
							await handleSaveButtonClick(e);
						},
					},
				},
			],
		},
	});

	[titleContainer, dateTimeContainer, inviteContainer, locationContainer, trackingContainer, descriptionContainer, buttonContainer].forEach(
		(elem) => {
			contentContainer.appendChild(elem);
		},
	);

	element.appendChild(contentContainer);
};

const eventElementComponent = () => {
	const eventHandleRef = createRef();
	const eventHandleButtonsRef = createRef();

	const element = addComponent({
		type: "div",
		props: {
			classList: ["eventContainerInner"],
			children: [
				{
					type: "div",
					ref: eventHandleRef,
					props: {
						classList: ["eventContainerHandle"],
						children: [
							{
								type: "div",
								props: {
									children: [
										{
											type: "div",
											ref: eventHandleButtonsRef,
											props: {
												classList: ["eventHandleButtons"],
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

	const elementHandleClose = addComponent({
		type: "span",
		props: {
			id: "close",
			innerHTML: minimizeIcon,
		},
	});

	const elementHandleMax = addComponent({
		type: "span",
		props: {
			id: "max",
			innerHTML: maximizeIcon,
		},
	});

	eventHandleButtonsRef.current.appendChild(elementHandleMax);
	eventHandleButtonsRef.current.appendChild(elementHandleClose);

	eventElementContent(element);

	return element;
};

export const loadEventComponent = () => {
	const eventButtonElem = document.querySelector(".link-item#new");
	if (!eventButtonElem) return;

	eventButtonElem.classList.add("link-modal-open");

	const elem = addComponent({
		type: "div",
		props: {
			classList: [eventContainerClassName],
		},
	});

	elem.appendChild(eventElementComponent());

	const initialRect = eventButtonElem.getBoundingClientRect();
	elem.style.position = "fixed";
	elem.style.top = `${initialRect.top}px`;
	elem.style.left = `${initialRect.left + 45}px`;

	// variables to track the original and maximized states
	let isMaximized = false;
	let originalDimensions = {
		width: elem.style.width,
		height: elem.style.height,
		top: elem.style.top,
		left: elem.style.left,
	};

	insertModal(elem);

	const elementHandleContainer = elem.querySelector(".eventContainerHandle");
	const elementHandleClose = elem.querySelector("#close");
	const elementHandleMax = elem.querySelector("#max");

	const removeClassesAndElement = () => {
		eventButtonElem.classList.remove("link-active", "link-modal-open");
	};

	const handleClickOutside = (event) => {
		if (elem && !elem.contains(event.target)) {
			removeClassesAndElement();
			document.removeEventListener("click", handleClickOutside);
		}
	};

	const hasVerticalScrollbar = document.body.scrollHeight > window.innerHeight;

	const handleFullScreen = () => {
		if (isMaximized) {
			// minimize --- IMPORTANT to note
			elem.style.width = originalDimensions.width;
			elem.style.height = originalDimensions.height;
			elem.style.maxHeight = null; // null to be dependent with css
			elem.style.top = originalDimensions.top;
			elem.style.left = originalDimensions.left;
		} else {
			// save the current dimensions before maximizing
			originalDimensions = {
				width: elem.style.width,
				height: elem.style.height,
				top: elem.style.top,
				left: elem.style.left,
			};

			// Maximize
			const sidebarElem = document.querySelector(".sidebar");
			const sidebarRect = sidebarElem.getBoundingClientRect();
			const offset = 30;
			const fullScreenOffset = 10;

			elem.style.width = `${window.innerWidth - sidebarRect.width - offset - fullScreenOffset}px`;
			elem.style.height = `${window.innerHeight - fullScreenOffset * 2}px`;
			elem.style.maxHeight = `${window.innerHeight}px`;
			elem.style.top = `${fullScreenOffset}px`;
			elem.style.left = `${sidebarRect.width + (hasVerticalScrollbar ? offset - 15 : offset)}px`;
		}
	};

	const handleDrag = (event) => {
		event.preventDefault();

		const dragClassName = "isDragging";

		let startX = event.clientX;
		let startY = event.clientY;

		const offset = 10;

		const originalTop = parseInt(elem.style.top, offset);
		const originalLeft = parseInt(elem.style.left, offset);

		const onDragging = (moveEvent) => {
			elementHandleContainer.classList.add(dragClassName);

			const dx = moveEvent.clientX - startX;
			const dy = moveEvent.clientY - startY;

			let newLeft = originalLeft + dx;
			let newTop = originalTop + dy;

			newLeft = Math.max(newLeft, offset);
			newLeft = Math.min(newLeft, window.innerWidth - elem.offsetWidth - (hasVerticalScrollbar ? offset + 15 : offset));

			newTop = Math.max(newTop, offset);
			newTop = Math.min(newTop, window.innerHeight - elem.offsetHeight - offset);

			elem.style.left = `${newLeft}px`;
			elem.style.top = `${newTop}px`;
		};

		const stopDragging = () => {
			elementHandleContainer.classList.remove(dragClassName);
			document.removeEventListener("mousemove", onDragging);
			document.removeEventListener("mouseup", stopDragging);
		};

		document.addEventListener("mousemove", onDragging);
		document.addEventListener("mouseup", stopDragging);
	};

	elementHandleClose.addEventListener("click", () => {
		removeClassesAndElement();
		removeModalComponent(elem);
	});

	elementHandleMax.addEventListener("click", () => {
		handleFullScreen();
		isMaximized = !isMaximized;
	});

	elementHandleContainer.addEventListener("mousedown", handleDrag);

	setTimeout(() => {
		document.addEventListener("click", handleClickOutside);
		window.addEventListener("resize", () => {
			handleFullScreen();
		});
	}, 10);
};
