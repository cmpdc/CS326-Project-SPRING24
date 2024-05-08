import Database from "./database.js";

const db = new Database("events");

class Events {
	constructor() {}

	static async create(eventData) {
		return db.create(eventData);
	}

	static async get(eventId) {
		return db.read(eventId);
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
			const existingDoc = await db.read(eventId);
			if (!existingDoc) {
				throw new Error("Document not found");
			}

			const updatedDoc = {
				...existingDoc,
				...eventData,
				_rev: existingDoc._rev,
			};

			return await db.update(eventId, updatedDoc);
		} catch (error) {
			console.error("Error updating event:", error);
			throw new Error(error.message);
		}
	}

	static async delete(eventId) {
		return db.delete(eventId);
	}
}

export default Events;
