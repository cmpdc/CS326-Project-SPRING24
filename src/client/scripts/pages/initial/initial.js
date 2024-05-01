import { goToPage } from "../../../app.js";
import { addComponent } from "../../utils.js";
import { headerComponent } from "../dashboard/header.js";

export const loadInitialPage = (element) => {
	element.innerHTML = ""; // Clear the content

	//creating a wrapper container that will act as a parent to the form
	const wrapper = addComponent({
		type: "div",
		props: {
			classList: [
				"centered-container", // This class will set the relative positioning
				"landing-page", // added
			],
		},
	});

	const imagesPaths = ["../../../images/istockphoto-513550806-612x612.jpg", "../../../images/homepagePhoto.jpg"];

	const slideshowInterval = 10000; // this is in milliseconds, so 10 seconds
	let currentImageIndex = 0;
	const updateBackgroundImage = () => {
		wrapper.style.backgroundImage = `url('${imagesPaths[currentImageIndex]}')`;
		wrapper.style.backgroundSize = "cover";
		wrapper.style.backgroundPosition = "center";
		currentImageIndex = (currentImageIndex + 1) % imagesPaths.length; // Cycle through the array
	};

	updateBackgroundImage();
	setInterval(updateBackgroundImage, slideshowInterval);

	// Sign Up button inside the header
	const signUpLoginButton = addComponent({
		type: "button",
		props: {
			classList: ["button", "sign-up-button"], // Added a more specific class
			textContent: "Login/Sign Up",
			onClick: () => {
				goToPage("/access");
			},
		},
	});

	// Create the header
	const header = headerComponent({
		rightSideContent: [signUpLoginButton],
	});

	// Main form container
	const formContainer = addComponent({
		type: "form",
		props: {
			classList: ["event-form"],
			attributes: {
				method: "post", // Assuming you're sending data to a server
			},
			children: [
				{
					type: "input",
					props: {
						classList: ["form-field"],
						attributes: {
							type: "text",
							name: "eventName",
							placeholder: "Event Name",
							required: true,
						},
					},
				},
				{
					type: "input",
					props: {
						classList: ["form-field"],
						attributes: {
							type: "text",
							name: "location",
							placeholder: "Location",
							required: true,
						},
					},
				},
				{
					type: "input",
					props: {
						classList: ["form-field"],
						attributes: {
							type: "text",
							name: "people",
							placeholder: "People (comma-separated)",
						},
					},
				},
				{
					type: "input",
					props: {
						classList: ["form-field"],
						attributes: {
							type: "date",
							name: "date",
							required: true,
						},
					},
				},
				{
					type: "button",
					props: {
						classList: ["button", "create-event-button"],
						textContent: "Create Event",
						attributes: {
							type: "submit",
						},
					},
				},
			],
		},
	});

	wrapper.appendChild(header);
	wrapper.appendChild(formContainer);

	element.appendChild(wrapper);

	formContainer.addEventListener("submit", async function (event) {
		event.preventDefault();
		const formData = new FormData(formContainer);

		// Extract data from the form fields
		const eventData = {
			name: formData.get("eventName"),
			location: formData.get("location"),
			people: formData.get("people").split(","), // Assuming a comma-separated list of people
			date: formData.get("date"),
		};

		console.log(eventData);

		// try {
		// 	// Create a new document in the database with the event data
		// 	const response = await db.create(eventData);

		// 	if (response) {
		// 		const newResponse = await db.read(response.id);
		// 		console.log("Read document:", newResponse);

		// 		// After storing, navigate to another page
		// 		goToPage("/access");
		// 	}
		// } catch (error) {
		// 	console.error("Failed to store event data:", error);
		// }
	});
};
