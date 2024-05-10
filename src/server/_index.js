import bcrypt from "bcrypt";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Events from "./events.js";
import Users from "./users.js";
//TODO: Jason study this code

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;
const app = express();

app.use(
	cors({
		origin: "http://127.0.0.1:3000",
		optionsSuccessStatus: 200,
	}),
);

app.use(
	express.json({
		limit: "10mb",
	}),
);

app.use(
	express.urlencoded({
		extended: true,
		limit: "10mb",
	}),
);

// Testing
app.get("/test", (req, res) => {
	res.send("API is working");
});

// Users Routes
app.route("/users").post(async (req, res) => {
	try {
		const user = await Users.create(req.body);

		res.status(201).send(user);
	} catch (error) {
		res.status(400).send({ error: "Failed to create user" });
	}
});

app.route("/users/:username")
	.get(async (req, res) => {
		try {
			const user = await Users.find(req.params.username);

			user ? res.status(200).send(user) : res.status(404).send({ error: "User not found" });
		} catch (error) {
			res.status(500).send({ error: "Failed to retrieve user" });
		}
	})
	.put(async (req, res) => {
		try {
			const updatedUser = await Users.update(req.params.username, req.body);
			if (!updatedUser) {
				return res.status(404).send({ error: "User not found or update failed" });
			}
			res.status(200).send(updatedUser);
		} catch (error) {
			res.status(500).send({ error: "Failed to update user" });
		}
	})
	.delete(async (req, res) => {
		try {
			await Users.delete(req.params.username);

			res.status(204).send();
		} catch (error) {
			res.status(500).send({ error: "Failed to delete user" });
		}
	});

app.post("/register", async (req, res) => {
	try {
		const existingUser = await Users.find(req.body.username);

		if (existingUser) {
			return res.status(409).send({ error: "User already exists" });
		}

		req.body.joinedDate = new Date();

		const user = await Users.create(req.body);

		res.status(201).send({ message: "User created successfully", user });
	} catch (error) {
		res.status(500).send({ error: "Failed to create user" });
	}
});

app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await Users.find(username);

		if (!user) {
			return res.status(404).send({ error: "User not found" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).send({ error: "Invalid credentials" });
		}

		const userData = {
			id: user.id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
		};

		res.send({ message: "Login successful", user: userData });
	} catch (error) {
		res.status(500).send({ error: "Login failed" });
	}
});

// Event Routes
app.route("/events")
	.post(async (req, res) => {
		try {
			const event = await Events.create(req.body);

			res.status(201).send(event);
		} catch (error) {
			const message = "Failed to create event";
			console.error(message, error);

			res.status(500).send({
				error: message,
				details: error.message,
			});
		}
	})
	.get(async (req, res) => {
		try {
			const events = await Events.getAll();
			res.status(200).send(events);
		} catch (error) {
			const message = "Failed to retrieve events";
			console.error(message, error);

			res.status(500).send({
				error: message,
				details: error.message,
			});
		}
	});

app.route("/events/:id")
	.get(async (req, res) => {
		try {
			const event = await Events.get(req.params.id);
			event ? res.status(200).send(event) : res.status(404).send({ error: "Event not found" });
		} catch (error) {
			const message = "Failed to retrieve events";
			console.error(message, error);

			res.status(500).send({
				error: message,
				details: error.message,
			});
		}
	})
	.put(async (req, res) => {
		try {
			const updatedEvent = await Events.update(req.params.id, req.body);

			res.status(200).send(updatedEvent);
		} catch (error) {
			const message = "Failed to update event";
			console.error(message, error);

			res.status(400).send({
				error: message,
				details: error.message,
			});
		}
	})
	.delete(async (req, res) => {
		try {
			await Events.delete(req.params.id);
			res.status(204).send();
		} catch (error) {
			const message = "Failed to delete event";
			console.error(message, error);

			res.status(500).send({
				error: message,
				details: error.message,
			});
		}
	});

app.route("/events-search").get(async (req, res) => {
	try {
		const query = req.query.q; // Use a query string parameter for the search term
		if (!query) {
			res.status(400).send({ error: "No search query provided" });
			return;
		}

		const events = await Events.search(query);
		res.status(200).send(events);
	} catch (error) {
		const message = "Failed to search events";
		console.error(message, error);
		res.status(500).send({
			error: message,
			details: error.message,
		});
	}
});

// Serve static files
// Note that we are serving our frontend SPA style
// - so this is needed to segregate frontend and backend.
app.use(express.static(path.join(__dirname, "..", "client")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server (backend) is running on port ${PORT}`);
});
