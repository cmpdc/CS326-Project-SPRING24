import { insertModal } from "../../app.js";
import { addComponent, createRef } from "../../utils.js";
import { DayPicker } from "./dayPicker.js";

const maximizeIcon = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`;

const minimizeIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49z"></path></svg>`;

const timeIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"></path></svg>`;

const guestsIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M64.12,147.8a4,4,0,0,1-4,4.2H16a8,8,0,0,1-7.8-6.17,8.35,8.35,0,0,1,1.62-6.93A67.79,67.79,0,0,1,37,117.51a40,40,0,1,1,66.46-35.8,3.94,3.94,0,0,1-2.27,4.18A64.08,64.08,0,0,0,64,144C64,145.28,64,146.54,64.12,147.8Zm182-8.91A67.76,67.76,0,0,0,219,117.51a40,40,0,1,0-66.46-35.8,3.94,3.94,0,0,0,2.27,4.18A64.08,64.08,0,0,1,192,144c0,1.28,0,2.54-.12,3.8a4,4,0,0,0,4,4.2H240a8,8,0,0,0,7.8-6.17A8.33,8.33,0,0,0,246.17,138.89Zm-89,43.18a48,48,0,1,0-58.37,0A72.13,72.13,0,0,0,65.07,212,8,8,0,0,0,72,224H184a8,8,0,0,0,6.93-12A72.15,72.15,0,0,0,157.19,182.07Z"></path></svg>`;

const locationIcon = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M20.891 2.006l.106 -.006l.13 .008l.09 .016l.123 .035l.107 .046l.1 .057l.09 .067l.082 .075l.052 .059l.082 .116l.052 .096c.047 .1 .077 .206 .09 .316l.005 .106c0 .075 -.008 .149 -.024 .22l-.035 .123l-6.532 18.077a1.55 1.55 0 0 1 -1.409 .903a1.547 1.547 0 0 1 -1.329 -.747l-.065 -.127l-3.352 -6.702l-6.67 -3.336a1.55 1.55 0 0 1 -.898 -1.259l-.006 -.149c0 -.56 .301 -1.072 .841 -1.37l.14 -.07l18.017 -6.506l.106 -.03l.108 -.018z" stroke-width="0" fill="currentColor"></path></svg>`;

const descriptionIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"></path></svg>`;

const eventContainerClassName = "eventContainer";

const eventElementContent = (element) => {
	const iconClassName = "event-icon";

	const titleWrapperRef = createRef();
	const dateComponentRef = createRef();
	const timeComponentRef = createRef();
	const dateTimeWrapperRef = createRef();
	const dateTimeComponentRendererRef = createRef();
	const guestWrapperRef = createRef();
	const locationWrapperRef = createRef();
	const descriptionWrapperRef = createRef();
	const saveButtonRef = createRef();

	let dayPicker = null;

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

	const dateComponent = addComponent({
		type: "div",
		ref: dateComponentRef,
		props: {
			textContent: "Date Component",
		},
	});

	const timeComponent = addComponent({
		type: "span",
		ref: timeComponentRef,
		props: {
			textContent: "Time Component",
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
						children: [dateComponent, timeComponent],
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

	const guestComponent = addInputComponent({
		type: "input",
		props: {
			id: "guests",
			placeholder: "Enter email address",
		},
	});

	const locationComponent = addInputComponent({
		type: "input",
		props: {
			id: "location",
			placeholder: "Where do you want to go?",
		},
	});

	const descriptionComponent = addInputComponent({
		type: "textarea",
		props: {
			id: "description",
			placeholder: "Add meeting notes here",
		},
	});

	const handleClick = (e, type) => {
		e.preventDefault();

		if (!e.target.classList.contains("default")) return;
		e.target.classList.remove("default");

		if (!e.target.parentElement.classList.contains("revealed")) {
			e.target.parentElement.classList.add("revealed");
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

				dayPicker = new DayPicker({
					fixedWeeks: true,
					showWeekNumber: false,
					mode: "multiple",
					min: 1,
					max: 3,
					date: new Date(),
					renderCalendar: dateTimeComponentRendererRef.current,
					renderButton: dateComponentRef.current,
				});

				break;

			case "guests":
				targetRef = guestWrapperRef;
				newContent = guestComponent;
				break;

			case "location":
				targetRef = locationWrapperRef;
				newContent = locationComponent;
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
					ref: titleWrapperRef,
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
						onClick: (e) => {
							handleClick(e, "dateTime");
						},
						children: [
							{
								type: "span",
								props: {
									textContent: "Add time and calendar",
								},
							},
						],
					},
				},
			],
		},
	});

	const guestsContainer = addComponent({
		type: "div",
		props: {
			classList: ["guestsContainer", "column"],
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
						onClick: (e) => {
							handleClick(e, "guests");
						},
						children: [
							{
								type: "span",
								props: {
									textContent: "Add invite event guests",
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
						onClick: (e) => {
							handleClick(e, "location");
						},
						children: [
							{
								type: "span",
								props: {
									textContent: "Add location",
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
						onClick: (e) => {
							handleClick(e, "description");
						},
						children: [
							{
								type: "span",
								props: {
									textContent: "Add meeting notes",
								},
							},
						],
					},
				},
			],
		},
	});

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
						classList: ["button", "saveButton"],
						textContent: "Save",
					},
				},
			],
		},
	});

	[titleContainer, dateTimeContainer, guestsContainer, locationContainer, descriptionContainer, buttonContainer].forEach((elem) => {
		contentContainer.appendChild(elem);
	});

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
	elem.style.position = "absolute";
	elem.style.top = `${initialRect.top}px`;
	elem.style.left = `${initialRect.left + 55}px`;

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
		elem.remove();
	};

	const handleClickOutside = (event) => {
		if (elem && !elem.contains(event.target)) {
			removeClassesAndElement();
			document.removeEventListener("click", handleClickOutside);
		}
	};

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
			elem.style.left = `${sidebarRect.width + offset}px`;
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

			newLeft = Math.max(newLeft + offset, 0);
			newLeft = Math.min(newLeft + offset, window.innerWidth - elem.offsetWidth - offset);

			newTop = Math.max(newTop + offset, 0);
			newTop = Math.min(newTop + offset, window.innerHeight - elem.offsetHeight - offset);

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
		document.removeEventListener("click", handleClickOutside);
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
