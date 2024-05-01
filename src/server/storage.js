import PouchDB from "pouchdb";

/**
 * Class representing a storage handler for managing database operations with PouchDB.
 */
export class Storage {
	/**
	 * Create an instance of the Storage class.
	 * @param {string} dbName - The name of the database to connect to.
	 */
	constructor(dbName) {
		this.db = new PouchDB(dbName);
	}

	/**
	 * Checks if a document exists in the database by its ID.
	 * @param {string} id - The ID of the document to check.
	 * @returns {Promise<boolean>} - A promise that resolves with `true` if the document exists, otherwise `false`.
	 * @throws {Error} - Throws an error if there is a problem accessing the database other than a 404 error.
	 */
	async has(id) {
		try {
			await this.db.get(id);

			return true;
		} catch (error) {
			if (error.status === 404) {
				return false;
			}

			console.error("Error checking document existence:", error);
			throw error;
		}
	}

	/**
	 * Creates a new document in the database.
	 * @param {Object} doc - The document to create.
	 * @returns {Promise<Object>} - A promise that resolves with the creation response from the database.
	 * @throws {Error} - Throws an error if the document cannot be created.
	 */
	async create(doc) {
		try {
			const response = await this.db.post(doc);
			console.log("Document created:", response);

			return response;
		} catch (error) {
			console.error("Error creating document:", error);

			throw error;
		}
	}

	/**
	 * Reads a document from the database by its ID.
	 * @param {string} id - The ID of the document to retrieve.
	 * @returns {Promise<Object>} - A promise that resolves with the document if found.
	 * @throws {Error} - Throws an error if the document cannot be retrieved.
	 */
	async read(id) {
		try {
			const document = await this.db.get(id);
			console.log("Document read:", document);

			return document;
		} catch (error) {
			console.error("Error reading document:", error);

			throw error;
		}
	}

	/**
	 * Updates an existing document in the database.
	 * @param {Object} doc - The document to update, which must include both `_id` and `_rev` properties.
	 * @returns {Promise<Object>} - A promise that resolves with the update response from the database.
	 * @throws {Error} - Throws an error if the document cannot be updated.
	 */
	async update(doc) {
		try {
			const response = await this.db.put(doc);
			console.log("Document updated:", response);

			return response;
		} catch (error) {
			console.error("Error updating document:", error);

			throw error;
		}
	}

	/**
	 * Deletes a document from the database by its ID.
	 * @param {string} id - The ID of the document to delete.
	 * @returns {Promise<Object>} - A promise that resolves with the deletion response from the database.
	 * @throws {Error} - Throws an error if the document cannot be deleted.
	 */
	async delete(id) {
		try {
			const doc = await this.db.get(id);
			const response = await this.db.remove(doc);
			console.log("Document deleted:", response);

			return response;
		} catch (error) {
			console.error("Error deleting document:", error);

			throw error;
		}
	}
}
