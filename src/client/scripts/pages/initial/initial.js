import { goToPage } from "../../../app.js";
import { logoIcon, userIcon } from "../../icons.js";
import { addComponent } from "../../utils.js";

export const loadInitialPage = (element) => {
    element.innerHTML = ''; // Clear the content
    
	//creating a wrapper container that will act as a parent to the form
    const wrapper = addComponent({
        type: "div",
        props: {
            classList: ["centered-container"], // This class will set the relative positioning
        }
    });

    wrapper.style.backgroundImage = "url('../../../images/istockphoto-513550806-612x612.jpg')";
    wrapper.style.backgroundSize = "cover";
    wrapper.style.backgroundPosition = "center";

	// Create the header
	const header = addComponent({
		type: "header",
		props: {
			classList: ["app-header", "inital-header"],
            style: { // Apply the flex styles directly here
                display: 'flex',
                justifyContent: 'center', 
                alignItems: 'center'
            }
		},
	});

	// Logo placeholder inside the header
	// Assuming logoIcon is a string containing the SVG element

	const logoPlaceholder = addComponent({
		type: "div",
		props: {
			classList: ["logoContainer"],
			innerHTML: `<div class="icon">${logoIcon}</div>`,
		},
	});

    const meetupText = addComponent({
        type: "h1",
        props: {
            classList: ["meetup-header-text"],
            textContent: "MeetUp" // The text you want to display
        }
    });


    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';


	// Sign Up button inside the header
	const signUpButton = addComponent({
		type: "button",
		props: {
			classList: ["button", "sign-up-button"], // Added a more specific class
			textContent: "Sign Up",
			onClick: () => goToPage("/access"),
		},
	});

	const userPlaceholder = addComponent({
		type: "div",
		props: {
			classList: ["userContainer", "landingUser"],
			innerHTML: `<div class="icon">${userIcon}</div>`,
		},
	});

	header.appendChild(logoPlaceholder);
    header.appendChild(meetupText);
	header.appendChild(signUpButton);
	header.appendChild(userPlaceholder);
    

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
                            required: true
                        }
                    }
                },
                {
                    type: "input",
                    props: {
                        classList: ["form-field"],
                        attributes: {
                            type: "text",
                            name: "location",
                            placeholder: "Location",
                            required: true
                        }
                    }
                },
                {
                    type: "input",
                    props: {
                        classList: ["form-field"],
                        attributes: {
                            type: "text",
                            name: "people",
                            placeholder: "People (comma-separated)",
                        }
                    }
                },
                {
                    type: "input",
                    props: {
                        classList: ["form-field"],
                        attributes: {
                            type: "date",
                            name: "date",
                            required: true
                        }
                    }
                },
                {
                    type: "button",
                    props: {
                        classList: ["button", "create-event-button"],
                        textContent: "Create Event",
                        attributes: {
                            type: "submit"
                        }
                    }
                }
            ]
        }
    });
    
    wrapper.appendChild(header);
    wrapper.appendChild(formContainer);

    element.appendChild(wrapper);
    
    formContainer.addEventListener('submit', function(event) {

        event.preventDefault();
        const formData = new FormData(formContainer);
    
        // Extract data from the form fields
        const eventData = {
            name: formData.get('eventName'),
            location: formData.get('location'),
            people: formData.get('people').split(','), // Assuming a comma-separated list of people
            date: formData.get('date')
        };
    
        // Handle the event data, e.g., send it to a server or store it locally
        console.log(eventData); // For demonstration purposes
        // You would typically send this data to a server here

		goToPage("/access");
	});
};
