import { addComponent, createRef } from "../utils.js";

const currentTheme = () => {
	const selectedTheme = localStorage.getItem("theme");

	if (!selectedTheme) {
		return "Light Theme";
	}

	return selectedTheme === "light" ? "Light Theme" : "Dark Theme";
};

export const themeSwitcherComponent = () => {
	const themeSwitcherElemRef = createRef();

	const elem = addComponent({
		type: "span",
		ref: themeSwitcherElemRef,
		props: {
			textContent: currentTheme(),
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();

				const isLightTheme = themeSwitcherElemRef.current.textContent === "Light Theme";
				themeSwitcherElemRef.current.textContent = isLightTheme ? "Dark Theme" : "Light Theme";
				localStorage.setItem("theme", isLightTheme ? "dark" : "light");

				if (isLightTheme) {
					document.body.classList.remove("light-theme");
					document.body.classList.add("dark-theme");
				} else {
					document.body.classList.remove("dark-theme");
					document.body.classList.add("light-theme");
				}
			},
		},
	});

	return elem;
};
