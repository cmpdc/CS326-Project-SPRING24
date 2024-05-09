import { v4 as uuidv4 } from "uuid";
import Database from "./database.js";

const db = new Database("events");
//TODO: Jason adds database functions for
class Events {
	constructor() {}

	static async generateNumericID() {
		const uuid = uuidv4();

		let numericID = BigInt("0x" + uuid.replace(/-/g, ""));
		numericID = numericID % BigInt("10000000000000000000");

		return numericID.toString();
	}

	static async create(eventData) {
		const allEvents = await Events.getAll(); // Retrieve all events once
		let uniqueID = await Events.generateNumericID();

		// Find if the generated uniqueID already exists
		let existingEvent = allEvents.find((event) => event.eventId === uniqueID);

		// If the ID already exists, generate new ones until a unique ID is found
		while (existingEvent) {
			uniqueID = await Events.generateNumericID();
			existingEvent = allEvents.find((event) => event.eventId === uniqueID);
		}

		eventData.eventId = uniqueID;
		return db.create(eventData);
	}

	static async get(eventId) {
		const allDocs = await db.db.allDocs({ include_docs: true });
		const event = allDocs.rows.find((row) => row.doc.eventId === eventId);
		return event ? event.doc : null;
	}

	static async getAll() {
		try {
			const allDocs = await db.db.allDocs({ include_docs: true });
			return allDocs.rows.map((row) => row.doc);
		} catch (error) {
			console.error("Error retrieving all events:", error);
			throw new Error(error.message);
		}
	}

	static async update(eventId, eventData) {
		try {
			const existingEvent = await Events.get(eventId);
			if (!existingEvent) {
				throw new Error("Event not found");
			}

			const updatedDoc = {
				...existingEvent,
				...eventData,
			};

			return db.update(eventId, updatedDoc);
		} catch (error) {
			console.error("Error updating event:", error);
			throw new Error(error.message);
		}
	}

	static async delete(eventId) {
		try {
			const event = await Events.get(eventId);

			if (event) {
				return db.delete(eventId);
			} else {
				throw new Error("Event not found");
			}
		} catch (error) {
			throw new Error("Error deleting an event.");
		}
	}

	static async search(query) {
		const allEvents = await Events.getAll();
		return allEvents.filter((event) => {
			return event.title.toLowerCase().includes(query.toLowerCase()) || event.description.toLowerCase().includes(query.toLowerCase());
		});
	}
}

export default Events;
