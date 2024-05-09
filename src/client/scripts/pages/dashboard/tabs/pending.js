import { addComponent } from "../../../utils.js";
//Jason Huang
export const pendingTab = () => {
	const elem = addComponent({
		type: "div",
		props: {
			classList: ["pendingTab", "contentTab"],
			children: [
				{
					type: "h1",
					props: {
						textContent: "Invitations",
					},
				},
			],
		},
	});

	return elem;
};
