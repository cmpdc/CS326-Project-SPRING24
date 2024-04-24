import { goToPage } from "../../../app.js";
import { logoIcon, userIcon } from "../../icons.js";
import { addComponent } from "../../utils.js";

export const loadInitialPage = (element) => {
    element.innerHTML = ''; // Clear the content
    element.classList.add("event-form-container");

    // Create the header
    const header = addComponent({
        type: "header",
        props: {
            classList: ["app-header"]
        }
    });

    // Logo placeholder inside the header
    // Assuming logoIcon is a string containing the SVG element

    const logoPlaceholder = addComponent({
        type: "div",
        props: {
            classList: ["logoContainer"],
            innerHTML: `<div class="icon">${logoIcon}</div>`
        }
    });


    // Sign Up button inside the header
    const signUpButton = addComponent({
        type: "button",
        props: {
            classList: ["button", "sign-up-button"], // Added a more specific class
            textContent: "Sign Up",
            onClick: () => goToPage('/signup')
        }
    });

    const userPlaceholder = addComponent({
        type: "div",
        props: {
            classList: ["userContainer", "landingUser"],
            innerHTML: `<div class="icon">${userIcon}</div>`
        }
    });

    header.appendChild(logoPlaceholder);
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
    
    // Add all components to the main element
    element.appendChild(header);
    element.appendChild(formContainer);
    
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

        goToPage('/signup');
    });
};

