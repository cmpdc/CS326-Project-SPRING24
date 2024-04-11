import { addComponent, createRef } from "../../utils.js";

export class DayPicker {
	constructor({ numberOfWeeks, fixedWeeks, showWeekNumber, mode, min, max, selected, renderCalendar, renderButton }) {
		this.numberOfWeeks = numberOfWeeks;
		this.fixedWeeks = fixedWeeks;
		this.showWeekNumber = showWeekNumber;
		this.mode = mode;
		this.min = min;
		this.max = max;
		this.selected = selected || new Date();
		this.renderCalendar = renderCalendar;
		this.renderButton = renderButton;

		this.selectedDates = []; // For storing selected dates in multiple mode
		this.rangeStart = null; // Start of the range in range mode
		this.rangeEnd = null; // End of the range in range mode

		this.calendarRef = createRef();
		this.buttonRef = createRef();
		this.initialRender();
	}

	initialRender() {
		const formattedDate = this.selected.toLocaleDateString("default", { year: "numeric", month: "long", day: "numeric" });
		const buttonElement = addComponent({
			type: "div",
			ref: this.buttonRef,
			props: {
				classList: ["day-picker-toggle"],
				onClick: () => this.toggleCalendar(),
				children: [formattedDate],
			},
		});

		this.renderButton.appendChild(buttonElement);
	}

	toggleCalendar() {
		if (!this.calendarRef.current) {
			const calendarElement = addComponent({
				type: "div",
				ref: this.calendarRef,
				props: {
					classList: ["calendar"],
					children: [
						this.renderHeader(),
						this.renderDayNames(),
						// Placeholder for day grid, to be implemented
					],
				},
			});

			this.renderCalendar.appendChild(calendarElement);
		} else {
			// Simple show/hide toggle for now
			this.calendarRef.current.style.display = this.calendarRef.current.style.display === "none" ? "block" : "none";
		}
	}

	renderHeader() {
		const prevButton = addComponent({
			type: "div",
			props: {
				classList: ["prev-button"],
				onClick: () => this.changeMonth(-1),
				children: ["<"],
			},
		});

		const nextButton = addComponent({
			type: "div",
			props: {
				classList: ["next-button"],
				onClick: () => this.changeMonth(1),
				children: [">"],
			},
		});

		const monthYearDisplay = addComponent({
			type: "div",
			props: {
				classList: ["month-year"],
				children: [this.selected.toLocaleDateString("default", { year: "numeric", month: "long" })],
			},
		});

		return addComponent({
			type: "div",
			props: {
				classList: ["calendar-header"],
				children: [prevButton, monthYearDisplay, nextButton],
			},
		});
	}

	renderDayNames() {
		const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
		const dayElements = dayNames.map((day) =>
			addComponent({
				type: "div",
				props: {
					classList: ["day-name"],
					children: [day],
				},
			}),
		);

		return addComponent({
			type: "div",
			props: {
				classList: ["day-names-row"],
				children: dayElements,
			},
		});
	}

	renderDateGrid() {
		const grid = [];
		const date = new Date(this.selected.getFullYear(), this.selected.getMonth(), 1);
		const firstDayOfMonth = date.getDay();
		const daysInMonth = new Date(this.selected.getFullYear(), this.selected.getMonth() + 1, 0).getDate();

		// Calculate the number of days to include from the previous month
		const prevMonthDays = firstDayOfMonth;
		const prevMonth = new Date(this.selected.getFullYear(), this.selected.getMonth(), 0);
		const daysInPrevMonth = prevMonth.getDate();

		// Add days from the previous month to the grid
		for (let i = daysInPrevMonth - prevMonthDays + 1; i <= daysInPrevMonth; i++) {
			grid.push(this.renderDay(prevMonth.getFullYear(), prevMonth.getMonth(), i, true));
		}

		// Add current month days to the grid
		for (let i = 1; i <= daysInMonth; i++) {
			grid.push(this.renderDay(this.selected.getFullYear(), this.selected.getMonth(), i, false));
		}

		// Calculate and add the next month's days to fill the last week, if necessary
		const totalDays = prevMonthDays + daysInMonth; // Total including prev month's days
		const nextMonthDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);

		for (let i = 1; i <= nextMonthDays; i++) {
			grid.push(this.renderDay(this.selected.getFullYear(), this.selected.getMonth() + 1, i, true));
		}

		return addComponent({
			type: "div",
			props: {
				classList: ["date-grid"],
				children: grid,
			},
		});
	}

	renderDay(year, month, day, isOutside) {
		const dayElement = addComponent({
			type: "div",
			props: {
				classList: ["day", isOutside ? "outside" : ""],
				onClick: () => this.selectDay(new Date(year, month, day)),
				children: [`${day}`],
			},
		});
		return dayElement;
	}

	selectDay(date) {
		switch (this.mode) {
			case "single":
				this.selected = date;
				this.updateCalendar();
				break;
			case "multiple":
				this.handleMultipleSelection(date);
				break;
			case "range":
				this.handleRangeSelection(date);
				break;
		}
	}

	handleMultipleSelection(date) {
		const dateString = date.toISOString().split("T")[0];
		const index = this.selectedDates.findIndex((d) => d.toISOString().split("T")[0] === dateString);
		if (index === -1) {
			if (this.selectedDates.length < this.max) {
				this.selectedDates.push(date);
			}
		} else {
			this.selectedDates.splice(index, 1); // Deselect if already selected
		}
		this.updateCalendar();
	}

	handleRangeSelection(date) {
		if (!this.rangeStart || this.rangeEnd) {
			this.rangeStart = date;
			this.rangeEnd = null; // Reset end date
		} else {
			// Ensure the end date is after the start date
			this.rangeEnd = date > this.rangeStart ? date : this.rangeStart;
			this.rangeStart = date <= this.rangeStart ? date : this.rangeStart;
			this.updateCalendar();
		}
	}

	updateCalendar() {
		// Logic to re-render the calendar with updated selection
		this.renderCalendar.innerHTML = ""; // Clear the current calendar
		this.initialRender(); // Re-render the calendar to reflect the selection changes
	}

	changeMonth(direction) {
		this.selected.setMonth(this.selected.getMonth() + direction);
		this.renderCalendar.innerHTML = ""; // Clear the current calendar
		this.initialRender(); // Re-render the calendar
	}

	initialRender() {
		// Updated to include renderDateGrid in the children array
		const calendarElement = addComponent({
			type: "div",
			ref: this.calendarRef,
			props: {
				classList: ["calendar"],
				children: [
					this.renderHeader(),
					this.renderDayNames(),
					this.renderDateGrid(), // Include the date grid
				],
			},
		});

		this.renderCalendar.appendChild(calendarElement);
	}
}
