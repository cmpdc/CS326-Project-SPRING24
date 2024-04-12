import { addComponent, createRef } from "../../utils.js";

export class TimePicker {
	constructor({ date, increment, showCurrentTime, renderButton, renderTime, disablePast = false }) {
		if (![15, 30].includes(increment)) {
			throw new Error("Increment value must be 15 or 30.");
		}

		this.date = date;
		this.increment = increment;
		this.showCurrentTime = showCurrentTime;
		this.renderButton = renderButton;
		this.renderTime = renderTime;
		this.disablePast = disablePast;
		this.selectedTime = this.formatTime(this.date);

		if (this.showCurrentTime) {
			this.initializeButton();
		}

		this.setupObserver();
	}

	get currentSelectedTime() {
		return this.selectedTime;
	}

	formatTime(date) {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12;
		hours = hours ? hours : 12;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		return `${hours}:${minutes} ${ampm}`;
	}

	initializeButton() {
		const buttonRef = createRef();
		const button = addComponent({
			type: "div",
			ref: buttonRef,
			props: {
				classList: ["time-picker-button"],
				onClick: () => this.renderTimePicker(),
				children: [this.selectedTime],
			},
		});
		this.renderButton.appendChild(button);
	}

	renderTimePicker() {
		if (this.renderTime.querySelector(".time-picker-container")) return;

		this.renderTime.innerHTML = "";

		this.renderButton.querySelector(".time-picker-button").classList.add("active");

		const pickerContainer = addComponent({
			type: "div",
			props: {
				classList: ["time-picker-container"],
			},
		});

		const now = new Date();
		for (let hour = 0; hour < 24; hour++) {
			const hourContainer = addComponent({
				type: "div",
				props: {
					classList: ["time-picker-hour-container"],
				},
			});

			for (let minute = 0; minute < 60; minute += this.increment) {
				const timeOption = new Date(this.date);
				timeOption.setHours(hour, minute);
				const timeString = this.formatTime(timeOption);

				const isPast = this.disablePast && timeOption < now;
				const timeButton = addComponent({
					type: "div",
					props: {
						textContent: timeString,
						classList: ["time-picker-option", isPast ? "disabled" : ""],
						onclick: isPast
							? null
							: (e) => {
									this.selectTime(e, timeOption);
								},
					},
				});

				hourContainer.appendChild(timeButton);
			}

			if (hourContainer.children.length > 0) {
				pickerContainer.appendChild(hourContainer);
			}
		}

		this.renderTime.appendChild(pickerContainer);
	}

	selectTime(e, time) {
		e.stopPropagation();
		e.preventDefault();

		this.selectedTime = this.formatTime(time);
		this.updateButton();
		this.hideTimePicker();
	}

	updateButton() {
		const button = this.renderButton.querySelector(".time-picker-button");
		if (button) {
			button.textContent = this.selectedTime;
		}
	}

	hideTimePicker() {
		this.renderTime.innerHTML = "";
	}

	setupObserver() {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (!this.renderTime.contains(document.querySelector(".time-picker-container"))) {
					const button = this.renderButton.querySelector(".time-picker-button");
					if (button && button.classList.contains("active")) {
						button.classList.remove("active");
					}
				}
			});
		});

		observer.observe(this.renderTime, { childList: true, subtree: true });
	}
}
