/**
 * Creates a ref object similar to React's `useRef` method.
 * The created ref can be used to store a reference to a DOM element or any other mutable value.
 * @returns { Object } Returns an object with a `current` property initialized to `null`.
 */
export const createRef = () => {
	return {
		current: null,
	};
};

/**
 * Creates a DOM element with specified properties and attaches it to a provided ref. This function mimics React's `createElement`.
 * @param { Object } config - The configuration object for creating a DOM element.
 * @param { string } config.type - The tag name of the element to be created (e.g., 'div').
 * @param { Object } config.ref - The ref object where the DOM element will be stored.
 * @param { Object } config.props - The properties and events to be assigned to the created element.
 * @returns { HTMLElement } The newly created DOM element.
 */
export const addComponent = ({ type, ref, props }) => {
	const elem = document.createElement(type);

	if (ref) {
		ref.current = elem;
	}

	if (props) {
		Object.entries(props).forEach(([key, value]) => {
			if (key === "classList") {
				value.filter(Boolean).forEach((className) => elem.classList.add(className));
			} else if (key.startsWith("on") && typeof value === "function") {
				const eventName = key.substring(2).toLowerCase();
				elem.addEventListener(eventName, value);
			} else if (key === "attributes") {
				Object.entries(value).forEach(([attrName, attrValue]) => {
					elem.setAttribute(attrName, attrValue);
				});
			} else if (key === "children") {
				value.forEach((child) => {
					if (!child) return;

					if (typeof child === "string") {
						elem.innerHTML += child;
					} else if (child instanceof Node) {
						// If "child" is already a DOM element, append it directly
						elem.appendChild(child);
					} else {
						const childElement = addComponent(child);
						elem.appendChild(childElement);
					}
				});
			} else {
				elem[key] = value;
			}
		});
	}

	return elem;
};

/**
 * Custom state management function that mimics React's useState functionality.
 * It provides a way to manage state within a function and updates it either directly
 * or based on the previous state through a function.
 *
 * @param {{ initialValue: any, ref?: HTMLElement | { current: HTMLElement | null } }} config
 * - `initialValue` is the initial state value.
 * - `ref` is an optional parameter that can either be a direct HTMLElement or an object
 *   containing a `.current` property with an HTMLElement. If provided, updates the textContent
 *   of the element to the current state when the state changes.
 *
 * @returns {[any, Function]} Returns an array containing the current state and a setState function.
 * - The first element of the array is the current state.
 * - The second element, `setState`, is a function that can be used to update the state.
 *   `setState` can be called with a new value or a function that receives the previous
 *   state and returns a new state.
 */
export const updater = ({ initialValue, ref = null }) => {
	let state = initialValue;

	const setState = (updateFunctionOrValue) => {
		const newState = typeof updateFunctionOrValue === "function" ? updateFunctionOrValue(state) : updateFunctionOrValue;

		state = newState;
		if (ref) {
			// Only interact with the DOM if ref is provided
			const element = ref instanceof HTMLElement ? ref : ref.current;
			if (element) {
				element.textContent = `Current State: ${state}`;
			}
		}
	};

	return [state, setState];
};

/**
 * Utilizes the modal element to insert a floating component
 * @param {HTMLElement} element
 * @returns {void}
 */
export const insertModal = (element) => {
	const modalElem = document.querySelector("#modal");
	if (!modalElem) return;

	// ensures for no duplicates
	if (element.classList && modalElem.querySelector(`.${element.classList[0]}`)) return;
	if (element.id && modalElem.querySelector(`#${element?.id}`)) return;

	modalElem.appendChild(element);

	const handleClickOutside = (event) => {
		event.stopPropagation();
		event.preventDefault();

		if (element && !element.contains(event.target)) {
			modalElem.querySelector(`.${element.classList[0]}`)?.remove();

			document.removeEventListener("click", handleClickOutside);
		}
	};

	setTimeout(() => {
		document.addEventListener("click", handleClickOutside);
	}, 10);
};

/**
 * Remove any existing modal components
 * @param { HTMLElement } element
 * @returns { void }
 */
export const removeModalComponent = (element) => {
	const modalElem = document.querySelector("#modal");
	if (!modalElem) return;

	while (modalElem.firstChild && modalElem.firstChild.classList[0] === element.classList[0]) {
		modalElem.removeChild(modalElem.firstChild);
	}
};

/**
 * Debounce function to limit the rate of API calls
 *
 * @param {*} func
 * @param {number} [timeout]
 * @returns {(...args: {}) => void}
 */
export const debounce = (func, timeout = 500) => {
	let timer;
	return (...args) => {
		return new Promise((resolve, reject) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args).then(resolve).catch(reject);
			}, timeout);
		});
	};
};

/**
 * Finds the first event from a list that is currently happening based on the current time.
 * An event is considered to be currently happening if the current time falls between
 * the event's start (`dateTime.from`) and end (`dateTime.to`) times.
 *
 * @param {Array} eventsList - An array of event objects, each having a `dateTime` object with `from` and `to` date strings.
 * @returns {Object|undefined} The first event object that is currently happening, or undefined if no such event exists.
 */
export const findCurrentlyHappeningEvent = (eventsList) => {
	const now = new Date(); // Current date and time
	return eventsList.find((event) => {
		const startTime = new Date(event.dateTime.from);
		const endTime = new Date(event.dateTime.to);
		return now >= startTime && now <= endTime;
	});
};

/**
 * Finds the event with the soonest start date from a list of events.
 * Each event must have a `dateTime.from` property which is a date string.
 *
 * @param {Array} events - An array of event objects, where each event includes a `dateTime` object with a `from` date string.
 * @returns {Object | undefined} The event object with the soonest start date, or undefined if no events are provided.
 */
export const findSoonestEvent = (eventsList) => {
	const now = new Date(); // Current date and time
	return eventsList.reduce((soonestEvent, currentEvent) => {
		const currentDate = new Date(currentEvent.dateTime.from);
		// Check if the event date is in the future and is sooner than the current soonestEvent
		return !soonestEvent || (currentDate < new Date(soonestEvent.dateTime.from) && currentDate > now) ? currentEvent : soonestEvent;
	}, undefined);
};

/**
 * Filters and returns a list of future events, excluding the soonest event found by `findSoonestEvent`.
 *
 * @param {Array} events - An array of event objects, each having a `dateTime` object with a `from` date string.
 * @returns {Array} An array of upcoming event objects, excluding the soonest event.
 */
export const findFutureEvents = (events) => {
	const soonestEvent = findSoonestEvent(events);
	const now = new Date();
	return events.filter((event) => {
		const eventDate = new Date(event.dateTime.from);
		return eventDate > now && event !== soonestEvent;
	});
};

/**
 * Filters and returns a list of past events, based on the end date (`dateTime.to`).
 *
 * @param {Array} events - An array of event objects, each having a `dateTime` object with a `to` date string indicating when the event ends.
 * @returns {Array} An array of past event objects, where each event has ended before the current date and time.
 */
export const findPastEvents = (events) => {
	const now = new Date();
	return events.filter((event) => {
		const endDate = new Date(event.dateTime.to);
		return endDate < now;
	});
};

export const getDayName = (date) => {
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return days[date.getDay()];
};

export const getDateWithSuffix = (date) => {
	const dateOfMonth = date.getDate();
	let suffix = "th";
	if (dateOfMonth === 1 || dateOfMonth === 21 || dateOfMonth === 31) {
		suffix = "st";
	} else if (dateOfMonth === 2 || dateOfMonth === 22) {
		suffix = "nd";
	} else if (dateOfMonth === 3 || dateOfMonth === 23) {
		suffix = "rd";
	}
	return `${dateOfMonth}${suffix}`;
};

export const formatAMPM = (date) => {
	let hours = date.getHours();

	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";

	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'

	const hoursStr = hours < 10 ? "0" + hours : hours;
	const minutesStr = minutes < 10 ? "0" + minutes : minutes;

	return `${hoursStr}:${minutesStr}${ampm}`;
};
