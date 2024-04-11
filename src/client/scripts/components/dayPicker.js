import { addComponent, createRef } from "../../utils.js";

const caretUpIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"></path></svg>`;

const caretDownIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"></path></svg>`;

export class DayPicker {
	constructor({ fixedWeeks, showWeekNumber, mode, min, max, date, renderCalendar, renderButton, showOldDays = false }) {
		this.fixedWeeks = fixedWeeks;
		this.showWeekNumber = showWeekNumber;
		this.mode = mode;
		this.min = min;
		this.max = max;
		this.date = date || new Date();
		this.renderCalendar = renderCalendar;
		this.renderButton = renderButton;
		this.showOldDays = showOldDays;

		this.isMonthViewOpen = false;
		this.isYearViewOpen = false;

		this.selectedDates = [];
		this.rangeStart = null;
		this.rangeEnd = null;

		this.calendarRef = createRef();
		this.buttonRef = createRef();
		this.initialRender();
	}

	get selectedCalendarDates() {
		// Depending on your use case, format the dates as needed
		return this.selectedDates.map((date) => date.toISOString().split("T")[0]);
	}

	getWeekNumber(d) {
		d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
		d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
		const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

		return weekNo;
	}

	initialRender() {
		const formattedDate = this.date.toLocaleDateString("default", { year: "numeric", month: "long", day: "numeric" });
		const buttonElement = addComponent({
			type: "div",
			ref: this.buttonRef,
			props: {
				classList: ["day-picker-toggle"],
				onClick: () => this.toggleCalendar(),
				children: [formattedDate],
			},
		});

		this.renderButton.innerHTML = "";
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
						{
							type: "div",
							props: {
								classList: ["current-view"],
								children: [this.renderHeader(), this.renderDayNames(), this.renderDateGrid()],
							},
						},
					],
				},
			});

			this.renderCalendar.appendChild(calendarElement);
			this.calendarRef.current.style.display = "block";
		} else {
			this.calendarRef.current.style.display = this.calendarRef.current.style.display === "none" ? "block" : "none";
		}
	}

	renderHeader() {
		const today = new Date();
		const currentMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
		const canShowPrevButton = this.showOldDays || currentMonth >= today;

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
				children: [prevButton, nextButton],
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

		// Check if this day is the current date
		const isCurrentDate = date.getTime() === today.getTime();

		// Check if this day is selected
		const isSelectedDate = this.isSelectedDate(date);

		const dayElement = addComponent({
			type: "div",
			props: {
				classList: ["day", isOutside ? "outside" : "", isCurrentDate ? "current-date" : "", isSelectedDate ? "selected-date" : ""],
				attributes: { "data-date": `${year}-${month + 1}-${day}` },
				onClick: (e) => this.selectDay(e, date),
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

			const monthElement = addComponent({
				type: "div",
				props: {
					classList: ["month", isDisabled ? "disabled" : ""],
					onClick: (e) => {
						if (isDisabled) return; // Prevent action if the month is disabled

						e.stopPropagation();
						e.preventDefault();

						this.isMonthViewOpen = false;

						this.changeMonthTo(index);
						monthViewElement.remove(); // Remove month view after selection
						this.calendarRef.current.classList.remove("monthViewRevealed");
					},
					children: [month],
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
			const yearElement = addComponent({
				type: "div",
				props: {
					classList: ["year"],
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

	isSelectedDate(date) {
		const dateString = date.toISOString().split("T")[0];
		switch (this.mode) {
			case "single":
				return this.date.toISOString().split("T")[0] === dateString;
			case "multiple":
				return this.selectedDates.some((d) => d.toISOString().split("T")[0] === dateString);
			case "range":
				if (this.rangeStart && this.rangeEnd) {
					const start = this.rangeStart.getTime();
					const end = this.rangeEnd.getTime();
					return date.getTime() >= start && date.getTime() <= end;
				} else if (this.rangeStart) {
					// Only start is selected
					return this.rangeStart.toISOString().split("T")[0] === dateString;
				}
				break;
		}
		return false;
	}

	selectDay(e, date) {
		e.preventDefault();
		e.stopPropagation();

		const dayElement = e.target;
		const isOutsideDay = dayElement.classList.contains("outside");
		const isSelected = dayElement.classList.contains("selected-date");
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
		}

		switch (this.mode) {
			case "single":
				if (!isOutsideDay) {
					// Only apply selection logic if it's not an outside day
					if (this.previousSelected && this.previousSelected !== dayElement) {
						this.previousSelected.classList.remove("selected-date");
					}
					if (!isSelected) {
						dayElement.classList.add("selected-date");
						this.previousSelected = dayElement;
					}
				}
				break;
			case "multiple":
				if (!isOutsideDay) {
					// Only handle multiple selection if it's not an outside day
					this.handleMultipleSelection(date, isSelected, dayElement);
				}
				break;
			case "range":
				if (!isOutsideDay) {
					// Only handle range selection if it's not an outside day
					this.handleRangeSelection(date, isSelected, dayElement);
				}
				break;
		}
	}

	handleMultipleSelection(date, isSelected, dayElement) {
		const dateString = date.toISOString().split("T")[0];
		if (!isSelected) {
			if (this.selectedDates.length < this.max) {
				this.selectedDates.push(date);
				dayElement.classList.add("selected-date");
			}
		} else {
			const index = this.selectedDates.findIndex((d) => d.toISOString().split("T")[0] === dateString);
			if (index !== -1) {
				this.selectedDates.splice(index, 1);
				dayElement.classList.remove("selected-date");
			}
		}
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
		// Clear the calendar and re-render to reflect changes
		if (this.calendarRef.current) {
			this.calendarRef.current.remove(); // Remove the current calendar from the DOM
		}
		this.calendarRef.current = null; // Reset the reference to allow reinitialization
		this.toggleCalendar(); // Reinitialize and display the calendar with the updated date
		this.highlightSelectedDates(); // New method to apply classes after calendar is rendered
	}

	highlightSelectedDates() {
		const days = this.calendarRef.current.querySelectorAll(".day");
		days.forEach((day) => {
			const date = new Date(day.getAttribute("data-date"));
			if (this.isSelectedDate(date)) {
				day.classList.add("selected-date");
			} else {
				day.classList.remove("selected-date");
			}
		});
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
}
