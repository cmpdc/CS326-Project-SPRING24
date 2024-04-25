class Database {
	constructor(key) {
		this.db = new PouchDB(key);
	}

	async create(doc) {
		try {
			const response = await this.db.post(doc);

			return response;
		} catch (error) {
			console.error("Error creating document:", error);
			throw new Error(error.message);
		}
	}

	async read(id) {
		try {
			const doc = await this.db.get(id);

			return doc;
		} catch (error) {
			console.error("Error reading document:", error);
		}
	}

	async documentExists(docTitle, docDate) {
		try {
			const result = await this.db.find({
				selector: {
					title: docTitle,
					"dateTime.from": docDate,
				},
			});
			return result.docs.length > 0;
		} catch (error) {
			console.error("Error finding document:", error);
			return false;
		}
	}

	async update(id, newData) {
		try {
			const doc = await this.db.get(id);

			const response = await this.db.put({
				...doc,
				...newData,
			});

			return response;
		} catch (error) {
			console.error("Error updating document:", error);
		}
	}

	async delete(docId) {
		try {
			const doc = await this.db.get(docId);
			const response = await this.db.remove(doc);

			return response;
		} catch (error) {
			console.error("Error deleting document:", error);
		}
	}
}

export default Database;
