import { addComponent } from "../../utils.js";

export const accountSettingsPopup = () => {
	const popupElem = addComponent({
		type: "div",
		props: {
			classList: ["account-popup"],
			children: [
				{
					type: "div",
					props: {
						classList: ["account-popup-inner"],
					},
				},
			],
		},
	});

	return popupElem;
};
