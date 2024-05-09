import { goToPage } from "../../app.js";
import { closeIcon, logoIcon, searchIcon, userIcon } from "../../icons.js";
import { addComponent, createRef, insertModal } from "../../utils.js";
import { accountSettingsPopup } from "./accountSettings.js";

export const headerComponent = ({ rightSideContent }) => {
	const searchComponentRef = createRef();
	const searchIconRef = createRef();
	const searchInputRef = createRef();
	const userAccountComponentRef = createRef();

	const handleLogoClick = (e) => {
		e.stopPropagation();
		e.preventDefault();

		goToPage("/dashboard");
	};

	const handleSearchInput = async (e) => {
		e.preventDefault();
		e.stopPropagation();

		const handleRemoveSearch = (ev) => {
			ev.target.value = "";
			addSearchIcon();
		};

		const addSearchIcon = () => {
			searchIconRef.current.innerHTML = searchIcon;
			searchComponentRef.current.classList.add("withoutResults");
		};

		const handleSearchResultsRemoval = (ev) => {
			ev.preventDefault();
			ev.stopPropagation();

			const elem = document.querySelector(".searchResults");
			if (elem && elem.contains(ev.target)) return;

			searchComponentRef.current.classList.add("withoutResults");

			document.removeEventListener("click", handleSearchResultsRemoval);
		};

		const showResults = () => {
			const searchInputRect = searchComponentRef.current.getBoundingClientRect();

			const searchResultsElem = addComponent({
				type: "div",
				props: {
					classList: ["searchResults"],
					style: `width: ${searchInputRect.width}px; top: ${searchInputRect.height + searchInputRect.y}px; left: ${searchInputRect.x}px;`,
					children: [
						{
							type: "div",
							props: {
								classList: ["searchResultsInner"],
								children: [
									{
										type: "span",
										props: {
											classList: ["searchingPlaceholder"],
											textContent: "Searching",
										},
									},
								],
							},
						},
					],
				},
			});

			insertModal(searchResultsElem);

			document.addEventListener("click", handleSearchResultsRemoval);
		};

		const value = e.target.value;

		if (value === "") {
			addSearchIcon();
			document.querySelector(".searchResults").remove();
		} else {
			searchIconRef.current.innerHTML = closeIcon;

			if (searchComponentRef.current.classList.contains("withoutResults")) {
				searchComponentRef.current.classList.remove("withoutResults");
			}

			showResults();
			const searchResultInnerElem = document.querySelector(".searchResults .searchResultsInner"); // we need to use document here

			try {
				const response = await fetch(`http://127.0.0.1:3001/events-search?q=${encodeURIComponent(value)}`);

				if (!response.ok) return;

				const eventResults = await response.json();

				searchResultInnerElem.innerHTML = "";

				if (eventResults.length > 0) {
					eventResults.forEach((eventResult) => {
						const elem = addComponent({
							type: "div",
							props: {
								classList: ["searchResultItem"],
								children: [
									{
										type: "div",
										props: {
											classList: ["itemRow"],
											children: [
												{
													type: "span",
													props: {
														textContent: `Title:`,
													},
												},
												{
													type: "span",
													props: {
														textContent: `${eventResult.title}`,
													},
												},
											],
										},
									},
									{
										type: "div",
										props: {
											classList: ["itemRow"],
											children: [
												{
													type: "span",
													props: {
														textContent: `Description:`,
													},
												},
												{
													type: "span",
													props: {
														textContent: `${eventResult.description}`,
													},
												},
											],
										},
									},
								],
								onClick: (clickEvent) => {
									clickEvent.stopPropagation();
									clickEvent.preventDefault();

									const eventId = encodeURIComponent(eventResult.eventId);
									goToPage(`/dashboard/event/${eventId}`);
								},
							},
						});

						searchResultInnerElem.appendChild(elem);
					});
				} else {
					searchResultInnerElem.appendChild(
						addComponent({
							type: "span",
							props: {
								classList: ["resultMessage"],
								textContent: "No event found.",
							},
						}),
					);
				}
			} catch (error) {
				console.error("Search error:", error);

				if (searchResultInnerElem) {
					searchResultInnerElem.innerHTML = "";
					searchResultInnerElem.appendChild({
						type: "span",
						props: {
							classList: ["resultMessage"],
							textContent: "Error loading search results.",
						},
					});
				}
			}

			searchIconRef.current.addEventListener("click", () => {
				handleRemoveSearch(e);
			});
		}
	};

	const logoComponent = addComponent({
		type: "div",
		props: {
			classList: ["logoContainer"],
			children: [
				{
					type: "div",
					props: {
						classList: ["icon"],
						children: [logoIcon],
						onClick: (e) => {
							handleLogoClick(e);
						},
					},
				},
				{
					type: "h2",
					props: {
						classList: ["app-name"],
						children: [
							{
								type: "span",
								props: {
									classList: ["primary"],
									textContent: "Meet",
								},
							},
							{
								type: "span",
								props: {
									classList: ["secondary"],
									textContent: "Up",
								},
							},
						],
						onClick: (e) => {
							handleLogoClick(e);
						},
					},
				},
			],
			onClick: (e) => {
				goToPage("/dashboard");
			},
		},
	});

	const searchComponent = addComponent({
		type: "div",
		ref: searchComponentRef,
		props: {
			classList: ["searchComponent", "withoutResults"],
			children: [
				{
					type: "span",
					ref: searchIconRef,
					props: {
						classList: ["search-icon", "icon"],
						children: [searchIcon],
					},
				},
				{
					type: "input",
					ref: searchInputRef,
					props: {
						id: "searchInput",
						placeholder: "Search",
						oninput: async (e) => {
							await handleSearchInput(e);
						},
					},
				},
			],
		},
	});

	const handleUserAccountClickOutside = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (userAccountComponentRef.current && userAccountComponentRef.current.contains(e.target)) return;
		if (document.querySelector(`.${accountSettingsPopup().classList[0]}`)?.parentElement?.contains(e.target)) return;

		if (userAccountComponentRef.current.classList.contains("open")) {
			userAccountComponentRef.current.classList.remove("open");
		}

		document.removeEventListener("click", handleUserAccountClickOutside);
	};

	const userAccountComponent = addComponent({
		type: "div",
		ref: userAccountComponentRef,
		props: {
			classList: ["user-account"],
			children: [
				{
					type: "span",
					props: {
						classList: ["user-icon", "icon"],
						children: [userIcon],
					},
				},
			],
			onClick: (event) => {
				event.stopPropagation();
				event.preventDefault();

				userAccountComponent.classList.add("open");

				insertModal(accountSettingsPopup());

				const searchResults = document.querySelector(".searchResults");
				const searchInput = document.querySelector(".searchComponent");

				if (searchResults) searchResults.remove();
				if (searchInput) searchInput.classList.add("withoutResults");

				document.addEventListener("click", handleUserAccountClickOutside);
			},
		},
	});

	const elem = addComponent({
		type: "header",
		props: {
			classList: ["app-header"],
			children: [
				logoComponent,
				{
					type: "div",
					props: {
						classList: ["rightSide"],
						children: !rightSideContent ? [searchComponent, userAccountComponent] : rightSideContent,
					},
				},
			],
		},
	});

	return elem;
};
