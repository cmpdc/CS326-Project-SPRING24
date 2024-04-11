import { addComponent, createRef } from "../../utils";

export class TimePicker {
	constructor({ date, increment, showCurrentTime, renderButton, renderTime }) {
		if (![15, 30].includes(increment)) {
			throw new Error("Increment value must be 15 or 30.");
		}
		this.date = date;
		this.increment = increment;
		this.showCurrentTime = showCurrentTime;
		this.renderButton = renderButton;
		this.renderTime = renderTime;
		this.selectedTime = this.formatTime(this.date);

		if (this.showCurrentTime) {
			this.initializeButton();
		}
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
		// Clear existing time picker to avoid duplicates
		this.renderTime.innerHTML = "";

		// Create a container for the time picker options
		const pickerContainer = addComponent({
			type: "div",
			props: {
				classList: ["time-picker-container"],
			},
		});

		// Calculate and create time options based on the increment
		for (let hour = 0; hour < 24; hour++) {
			for (let minute = 0; minute < 60; minute += this.increment) {
				const timeOption = new Date(this.date);
				timeOption.setHours(hour, minute);

				const timeString = this.formatTime(timeOption);

				const timeButton = addComponent({
					type: "div",
					props: {
						textContent: timeString,
						classList: ["time-picker-option"],
						onclick: () => this.selectTime(timeOption),
					},
				});

				pickerContainer.appendChild(timeButton);
			}
		}

		this.renderTime.appendChild(pickerContainer);
	}

	selectTime(time) {
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
}
