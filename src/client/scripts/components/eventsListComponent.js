import { addComponent } from "../utils";

export const eventListComponent = () => {
	const events = addComponent({
		type: "div",
		props: {
			classList: ["event-item"],
		},
	});

	return events;
};
