import { caretDownIcon, caretUpIcon, resetIcon } from "../icons.js";
import { addComponent, createRef } from "../utils.js";

export class DayPicker {
	constructor({ fixedWeeks, showWeekNumber, date, renderCalendar, renderButton, renderButtonClick, onDateChangeConfirm, showOldDays = false }) {
		this.fixedWeeks = fixedWeeks;
		this.showWeekNumber = showWeekNumber;
		this.date = date;
		this.renderCalendar = renderCalendar;
		this.renderButton = renderButton;
		this.showOldDays = showOldDays;

		this.onDateChangeConfirm = onDateChangeConfirm;
		this.renderButtonClick = renderButtonClick;

		this.isMonthViewOpen = false;
		this.isYearViewOpen = false;

		this.rangeStart = null;
		this.rangeEnd = null;

		this.calendarRef = createRef();
		this.buttonRef = createRef();
		this.initialRender();
	}

	getPickedDate() {
		return this.date;
	}

	getWeekNumber(d) {
		d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
		d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

		return weekNo;
	}

	setMinDate(newDate) {
		this.date = newDate;
		this.updateCalendar();
	}

	initialRender() {
		const formattedDate = this.date.toLocaleDateString("default", { year: "numeric", month: "long", day: "numeric" });
		const buttonElement = addComponent({
			type: "div",
			ref: this.buttonRef,
			props: {
				classList: ["day-picker-toggle", "picker-button"],
				onClick: (e) => {
					e.preventDefault();
					e.stopPropagation();

					if (this.renderButtonClick) {
						this.renderButtonClick(e);
					}

					this.render();
				},
				children: [formattedDate],
			},
		});

		this.renderButton.innerHTML = "";
		this.renderButton.appendChild(buttonElement);
	}

	render() {
		const calendarElementRef = this.renderCalendar.querySelector(".calendar");
		const activeClassName = "active";

		if (calendarElementRef) {
			document.querySelectorAll(".picker-button").forEach((elem) => {
				elem.classList.remove(activeClassName);
			});

			this.hideCalendar();

			return;
		}
		const componentButton = this.renderButton.querySelector(".day-picker-toggle");

		const saveButton = addComponent({
			type: "span",
			props: {
				textContent: "Confirm",
				classList: ["confirm-button", "disabled"],
				onClick: (e) => {
					e.stopPropagation();
					e.preventDefault();

					if (!this.date) return;

					if (this.onDateChangeConfirm) {
						this.onDateChangeConfirm(this.date);
					}

					const formattedDate = this.date.toLocaleDateString("default", { year: "numeric", month: "long", day: "numeric" });
					this.buttonRef.current.textContent = formattedDate;

					componentButton.classList.remove("active");

					this.calendarRef.current.remove();
					this.calendarRef.current = null;
				},
			},
		});

		const calendarElement = addComponent({
			type: "div",
			ref: this.calendarRef,
			props: {
				classList: ["calendar"],
				children: [
					{
						type: "div",
						props: {
							classList: ["current-view"],
							children: [this.renderHeader(), this.renderDayNames(), this.renderDateGrid()],
						},
					},
					{
						type: "div",
						props: {
							classList: ["save-container"],
							children: [saveButton],
						},
					},
				],
			},
		});

		componentButton.classList.add(activeClassName);
		this.renderCalendar.appendChild(calendarElement);
	}

	renderHeader() {
		const today = new Date();
		const currentMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
		const canShowPrevButton = this.showOldDays || currentMonth >= today;

		const resetButton = addComponent({
			type: "div",
			props: {
				classList: ["reset-button"],
				onClick: (e) => {
					e.stopPropagation();

					this.resetCalendar();
				},
				children: [resetIcon],
			},
		});

		const prevButton = addComponent({
			type: "div",
			props: {
				classList: ["prev-button", canShowPrevButton ? "allowed" : "disabled"],
				onClick: (e) => this.changeMonth(e, -1),
				children: [caretUpIcon],
			},
		});

		const nextButton = addComponent({
			type: "div",
			props: {
				classList: ["next-button"],
				onClick: (e) => this.changeMonth(e, 1),
				children: [caretDownIcon],
			},
		});

		const buttonContainer = addComponent({
			type: "div",
			props: {
				classList: ["buttonContainer"],
				children: [resetButton, prevButton, nextButton],
			},
		});

		const monthYearDisplay = addComponent({
			type: "div",
			props: {
				classList: ["month-year"],
				children: [
					addComponent({
						type: "span",
						props: {
							classList: ["month"],
							onClick: () => this.renderMonthView(),
							children: [this.date.toLocaleDateString("default", { month: "long" })],
						},
					}),
					addComponent({
						type: "span",
						props: {
							classList: ["year"],
							onClick: () => this.renderYearView(),
							children: [`${this.date.getFullYear()}`],
						},
					}),
				],
			},
		});

		return addComponent({
			type: "div",
			props: {
				classList: ["calendar-header"],
				children: [monthYearDisplay, buttonContainer],
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
		const weeks = [];
		const date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
		let firstDayOfMonth = date.getDay();
		const daysInMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();

		// Calculate the number of days to include from the previous month
		const daysFromPrevMonth = firstDayOfMonth;
		const prevMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
		const daysInPrevMonth = prevMonth.getDate();

		let dayCounter = -daysFromPrevMonth + 1; // Start counting from the last days of the previous month

		for (let weekIndex = 0; weekIndex < (this.fixedWeeks ? 6 : 5); weekIndex++) {
			const week = [];
			for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
				const dayDate = new Date(this.date.getFullYear(), this.date.getMonth(), dayCounter);
				const isOutside = dayCounter <= 0 || dayCounter > daysInMonth;
				week.push(this.renderDay(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), isOutside));
				dayCounter++;
			}

			if (this.showWeekNumber) {
				const weekNumber = this.getWeekNumber(new Date(this.date.getFullYear(), this.date.getMonth(), dayCounter - 6));
				week.unshift(this.renderWeekNumber(weekNumber));
			}

			weeks.push(this.wrapWeek(week));
		}

		return addComponent({
			type: "div",
			props: {
				classList: ["date-grid"],
				children: weeks,
			},
		});
	}

	renderWeekNumber(weekNumber) {
		return addComponent({
			type: "div",
			props: {
				classList: ["week-number"],
				children: [`${weekNumber}`],
			},
		});
	}

	wrapWeek(weekDays) {
		return addComponent({
			type: "div",
			props: {
				classList: ["date-week"],
				children: weekDays,
			},
		});
	}

	renderDay(year, month, day, isOutside) {
		const date = new Date(year, month, day);
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Normalize today to start of day for comparison

		const isPast = date < today;
		const isCurrentDate = date.getTime() === today.getTime();

		const dayElement = addComponent({
			type: "div",
			props: {
				classList: ["day", isOutside ? "outside" : "", isCurrentDate ? "current-date" : "", isPast ? "disabled" : ""],
				attributes: { "data-date": `${year}-${month + 1}-${day}` },
				onClick: isPast ? undefined : (e) => this.selectDay(e, date),
				children: [`${day}`],
			},
		});

		return dayElement;
	}

	renderMonthView() {
		if (this.isMonthViewOpen) return;

		this.isMonthViewOpen = true;

		const currentMonth = new Date().getMonth();
		const currentYear = new Date().getFullYear();
		const selectedYear = this.date.getFullYear();
		const selectedMonth = this.date.getMonth();

		const monthViewClassName = "month-view";
		const monthViewElement = addComponent({
			type: "div",
			props: {
				classList: [monthViewClassName],
			},
		});

		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		months.forEach((month, index) => {
			// Disable past months based on showOldDays and the current date
			const isDisabled = !this.showOldDays && (selectedYear < currentYear || (selectedYear === currentYear && index < currentMonth));
			const isCurrent = index === currentMonth && this.date.getFullYear() === currentYear;

			const monthElement = addComponent({
				type: "div",
				props: {
					classList: ["month", index === selectedMonth ? "selected" : "", isCurrent ? "current" : "", isDisabled ? "disabled" : ""],
					onClick: (e) => {
						if (isDisabled) return;
						if (!this.showOldDays && index < currentMonth && this.date.getFullYear() === currentYear) return;

						e.stopPropagation();
						e.preventDefault();

						this.isMonthViewOpen = false;

						if (this.calendarRef.current && this.calendarRef.current.classList.contains("monthViewRevealed")) {
							this.calendarRef.current.classList.remove("monthViewRevealed");
						}

						this.changeMonthTo(index);
						monthViewElement.remove(); // Remove month view after selection
					},
					children: [month.substring(0, 3)],
				},
			});

			monthViewElement.appendChild(monthElement);
		});

		this.renderCalendar.querySelector(".calendar").appendChild(monthViewElement);
		this.calendarRef.current.classList.add("monthViewRevealed");
	}

	renderYearView() {
		if (this.isYearViewOpen) return;

		this.isYearViewOpen = true;

		const currentYear = new Date().getFullYear();
		const selectedYear = this.date.getFullYear();

		const yearViewClassName = "year-view";
		const yearViewElement = addComponent({
			type: "div",
			props: {
				classList: [yearViewClassName],
			},
		});

		const startYear = currentYear; // Start from the current year
		const endYear = currentYear + 10;

		for (let year = startYear; year <= endYear; year++) {
			const isCurrent = year === currentYear;
			const yearElement = addComponent({
				type: "div",
				props: {
					classList: ["year", year === selectedYear ? "selected" : "", isCurrent ? "current" : ""],
					onClick: (e) => {
						e.stopPropagation();
						e.preventDefault();

						this.isYearViewOpen = false;

						this.changeYearTo(year);
						yearViewElement.remove(); // Remove the year view after selection
						this.calendarRef.current.classList.remove("yearViewRevealed");
					},
					children: [`${year}`],
				},
			});

			yearViewElement.appendChild(yearElement);
		}

		this.renderCalendar.querySelector(".calendar").appendChild(yearViewElement);
		this.calendarRef.current.classList.add("yearViewRevealed");
	}

	selectDay(e, date) {
		e.preventDefault();
		e.stopPropagation();

		this.date = date;

		const dayElement = e.target;
		const isOutsideDay = dayElement.classList.contains("outside");
		const isSelected = dayElement.classList.contains("selected");
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Handling outside days: only change month if the day is in the future.
		if (isOutsideDay) {
			const clickedDateMonth = date.getMonth();
			const currentViewMonth = this.date.getMonth();
			const currentRealTimeMonth = today.getMonth();
			const clickedDateYear = date.getFullYear();
			const currentRealTimeYear = today.getFullYear();

			// Check if clicked outside day is in a future month and the current view is not ahead of real time
			if (
				clickedDateYear > currentRealTimeYear ||
				(clickedDateYear === currentRealTimeYear && clickedDateMonth > currentRealTimeMonth) ||
				(clickedDateMonth !== currentViewMonth && clickedDateYear >= currentRealTimeYear && clickedDateMonth >= currentRealTimeMonth)
			) {
				// Adjust the calendar to the clicked outside day's month and year
				this.date.setFullYear(date.getFullYear(), date.getMonth());
				this.updateCalendar(); // Re-render the calendar to the new month/year
				return; // Exit the function to avoid further logic meant for current month days
			}
		} else {
			// Only apply selection logic if it's not an outside day
			if (this.previousSelected && this.previousSelected !== dayElement) {
				this.previousSelected.classList.remove("selected");
			}
			if (!isSelected) {
				dayElement.classList.add("selected");
				this.previousSelected = dayElement;
			}
		}

		const confirmButton = this.renderCalendar.querySelector(".confirm-button");
		if (confirmButton && confirmButton.classList.contains("disabled")) {
			confirmButton.classList.remove("disabled");
		}
	}

	updateCalendar() {
		// Clear the calendar and re-render to reflect changes
		if (this.calendarRef.current) {
			this.calendarRef.current.remove(); // Remove the current calendar from the DOM
		}

		// Re-render the calendar element
		this.render();
	}

	changeMonth(e, direction) {
		e.preventDefault();
		e.stopPropagation();

		const newDate = new Date(this.date);
		newDate.setMonth(newDate.getMonth() + direction);
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Normalize today for comparison

		// Check if the new date is before today and if showOldDays is false
		if (direction === -1 && !this.showOldDays && newDate < today) {
			return; // Do nothing if trying to go to a previous month that's before the current month and showOldDays is false
		}

		this.date = newDate;
		this.updateCalendar(); // Update the calendar to reflect the new month
	}

	changeMonthTo(monthIndex) {
		this.date.setMonth(monthIndex);
		this.updateCalendar();
	}

	changeYearTo(year) {
		this.date.setFullYear(year);
		this.updateCalendar();
	}

	resetCalendar() {
		// Reset the date to today's date
		const today = new Date();
		this.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());

		// Re-render the calendar to reflect the reset
		this.updateCalendar();
	}

	hideCalendar() {
		const calendarElementRef = this.renderCalendar.querySelector(".calendar");
		if (!calendarElementRef) return;

		calendarElementRef.remove();
	}
}
