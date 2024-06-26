import { goToPage } from "../../app.js";
import { themeSwitcherComponent } from "../../components/themeSwitcher.js";
import Toast from "../../components/toast.js";

// NOTE: don't forget that when importing modules, there needs to have ".js" at the end

const URL = "http://127.0.0.1:3001";

/**
 * The "account" page of our app.
 * This component is what the user will see to login or create account.
 * @returns {void}
 */

// author: Jason completed 4/22/2024
// edited: Christian (for CSS, toast, backend endpoints, etc...)
export const loadAccessPage = (element) => {
	//html of access page with login form and signup form
	element.innerHTML = `
        <div class="homepage-background">
            <div id="formsContainer">
                <h1>Welcome to <span class="appTitle"><span>Meet</span><span>Up</span></span></h1>
                <div id="loginForm" class="form">
                    <input type="text" id="loginUsername" placeholder="Username" required>
                    <input type="password" id="loginPassword" placeholder="Password" required>
                    <button id="loginButton">Login</button>
                    <p>Not registered yet? <span id="showSignUp">Sign up</span></p>
                </div>
                <div id="signupForm" class="form" style="display: none;">
					<input type="text" id="firstName" placeholder="First Name" required>
					<input type="text" id="lastName" placeholder="Last Name" required>
                    <input type="text" id="signupUsername" placeholder="Username" required>
                    <input type="password" id="signupPassword" placeholder="Password" required>
                    <input type="email" id="signupEmail" placeholder="Email" required>
                    <button id="signupButton">Create Account</button>
                    <p>Already have an account? <span id="showLogin">Log in</span></p>
                </div>
            </div>
            <div id="themeSwitcher">
                <span>Current theme: </span>
                <div class="button"></div>
            </div>
        </div>
    `;

	element.querySelector("#themeSwitcher .button").appendChild(themeSwitcherComponent());

	// Add event listeners for form buttons and links
	const loginElementsByKeyEnter = [document.getElementById("loginUsername"), document.getElementById("loginPassword")];

	loginElementsByKeyEnter.forEach((elem) => {
		elem.addEventListener("keydown", async (event) => {
			if (event.key === "Enter") {
				await login();
			}
		});
	});

	document.getElementById("loginButton").addEventListener("click", async () => {
		await login();
	});

	const signUpElementsByKeyEnter = [
		document.getElementById("firstName"),
		document.getElementById("lastName"),
		document.getElementById("signupUsername"),
		document.getElementById("signupPassword"),
		document.getElementById("signupEmail"),
	];

	signUpElementsByKeyEnter.forEach((elem) => {
		elem.addEventListener("keydown", async (event) => {
			if (event.key === "Enter") {
				await createAccount();
			}
		});
	});

	document.getElementById("signupButton").addEventListener("click", async () => {
		await createAccount();
	});

	document.getElementById("showSignUp").addEventListener("click", () => toggleForms("signup"));
	document.getElementById("showLogin").addEventListener("click", () => toggleForms("login"));
};

//used to switch between forms
function toggleForms(form) {
	const loginForm = document.getElementById("loginForm");
	const signupForm = document.getElementById("signupForm");

	if (form === "signup") {
		loginForm.style.display = "none";
		signupForm.style.display = "flex"; // block
	} else {
		signupForm.style.display = "none";
		loginForm.style.display = "flex"; // block
	}
}

//login logic
const login = async () => {
	const username = document.getElementById("loginUsername").value;
	const password = document.getElementById("loginPassword").value;

	if (!username || !password) {
		console.log("");
		new Toast({
			text: "Please enter both username and password.",
		});

		return;
	}

	// backend communication
	try {
		const response = await fetch(`${URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		});

		if (response.ok) {
			const data = await response.json();

			if (response.status === 200) {
				localStorage.setItem("username", data.user.username);

				console.log("Login successful for user:", username);

				goToPage("/dashboard");
			} else {
				new Toast({
					text: `${data.error}`,
				});
			}
		}
	} catch (error) {
		console.error("Login failed:", error);

		new Toast({
			text: "Login failed. Please try again later.",
		});
	}
};

//create account logic
const createAccount = async () => {
	const username = document.getElementById("signupUsername").value;
	const password = document.getElementById("signupPassword").value;
	const email = document.getElementById("signupEmail").value;
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;

	if (!username || !password || !email || !firstName || !lastName) {
		new Toast({
			text: "Please fill all fields to create an account.",
		});

		return;
	}

	// backend communication
	try {
		const response = await fetch(`${URL}/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password, email, firstName, lastName }),
		});

		if (response.ok) {
			const data = await response.json();
			console.log(data);

			new Toast({
				text: `Account Created for ${username}`,
			});

			goToPage("/access");
		} else if (response.status === 409) {
			new Toast({
				text: "Username already exist. Try again.",
			});
		} else {
			console.error(await response.text());

			new Toast({
				text: "Failed to register",
			});
		}
	} catch (error) {
		new Toast({
			text: "Failed to create an account. Please try again later.",
		});

		console.error(error);
	}
};
