import { addComponent } from "../utils.js";

export class TimePicker {
	constructor({ date, increment, showCurrentTime, renderButton, renderButtonClick, renderTime, onTimeSelect, disablePast = false, date2 = null }) {
		if (![15, 30].includes(increment)) {
			throw new Error("Increment value must be 15 or 30.");
		}

		this.date = date;
		this.date2 = date2;
		this.increment = increment;
		this.showCurrentTime = showCurrentTime;
		this.renderButton = renderButton;
		this.renderButtonClick = renderButtonClick;
		this.renderTime = renderTime;
		this.onTimeSelect = onTimeSelect;
		this.disablePast = disablePast;

		if (this.showCurrentTime) {
			this.initializeButton();
		}

		this.setupObserver();
	}

	get currentSelectedTime() {
		return this.date;
	}

	setMinTime(newDate) {
		this.date = newDate;
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
		const button = addComponent({
			type: "div",
			props: {
				classList: ["time-picker-button", "picker-button"],
				onClick: (e) => {
					e.stopPropagation();
					e.preventDefault();

					if (this.renderButtonClick) {
						this.renderButtonClick(e);
					}

					this.renderTimePicker();
				},
				children: [this.formatTime(this.date)],
			},
		});

		if (this.renderButton.childNodes.length) {
			this.renderButton.innerHTML = "";
		}

		this.renderButton.appendChild(button);
	}

	renderTimePicker() {
		const pickerElemRef = this.renderTime.querySelector(".time-picker-container");
		const activeClassName = "active";

		if (pickerElemRef) {
			this.hideTimePicker();

			return;
		}

		this.renderTime.innerHTML = "";

		this.renderButton.querySelector(".time-picker-button").classList.add(activeClassName);

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
				timeOption.setSeconds(0, 0);

				let isDisable;
				if (this.disablePast) {
					if (now) {
						isDisable = timeOption < this.date2;
					} else {
						isDisable = timeOption > this.date2;
					}
				} else {
					isDisable = false;
				}

				const timeButton = addComponent({
					type: "div",
					props: {
						textContent: this.formatTime(timeOption),
						classList: ["time-picker-option", isDisable ? "disabled" : ""],
						onclick: isDisable
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

		this.date = time;
		if (this.onTimeSelect) {
			this.onTimeSelect(time);
		}

		this.updateButton();
		this.hideTimePicker();
	}

	updateButton() {
		const button = this.renderButton.querySelector(".time-picker-button");
		if (button) {
			button.textContent = this.formatTime(this.date);
		}
	}

	hideTimePicker() {
		const pickerElemRef = this.renderTime.querySelector(".time-picker-container");

		if (!pickerElemRef) return;
		pickerElemRef.remove();
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
