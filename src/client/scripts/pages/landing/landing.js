import { goToPage } from "../../../app.js";

// NOTE: don't forget that when importing modules, there needs to have ".js" at the end

/**
 * The "homepage" of our app.
 * This component is what will be seen if a user uses our app without an account.
 * @returns {void}
 */

//author: Jason completed 4/22/2024
export const loadLandingPage = (element) => {
	//html of landing page with login form and signup form
	element.innerHTML = `
        <div class="homepage-background">
            <div id="formsContainer">
                <h1>Welcome to MeetUp</h1>
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
        </div>
    `;

	// Add event listeners for form buttons and links
	document.getElementById("loginButton").addEventListener("click", login);
	document.getElementById("signupButton").addEventListener("click", createAccount);
	document.getElementById("showSignUp").addEventListener("click", () => toggleForms("signup"));
	document.getElementById("showLogin").addEventListener("click", () => toggleForms("login"));
};

//used to switch between forms
function toggleForms(form) {
	const loginForm = document.getElementById("loginForm");
	const signupForm = document.getElementById("signupForm");
	if (form === "signup") {
		loginForm.style.display = "none";
		signupForm.style.display = "block";
	} else {
		signupForm.style.display = "none";
		loginForm.style.display = "block";
	}
}

//login logic
function login() {
	const username = document.getElementById("loginUsername").value;
	const password = document.getElementById("loginPassword").value;
	if (username && password) {
		//backend communication here
		console.log("Login successful for user:", username);
		goToPage("/dashboard");
	} else {
		alert("Please enter both username and password.");
	}
}

//create account logic
function createAccount() {
	const username = document.getElementById("signupUsername").value;
	const password = document.getElementById("signupPassword").value;
	const email = document.getElementById("signupEmail").value;
	const firstName = document.getElementById("firstName").value;
	const lastName = document.getElementById("lastName").value;

	if (username && password && email && firstName && lastName) {
		console.log("Account created for:", username);
		//backend communication here
		goToPage("/dashboard");
	} else {
		alert("Please fill all fields to create an account.");
	}
}
