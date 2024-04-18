import { addComponent } from "../../../utils.js";

export const sharedTab = () => {
	const elem = addComponent({
		type: "div",
		props: {
			classList: ["sharedTab", "contentTab"],
			children: [
				{
					type: "h1",
					props: {
						textContent: "Shared",
					},
				},
			],
		},
	});

	return elem;
};
