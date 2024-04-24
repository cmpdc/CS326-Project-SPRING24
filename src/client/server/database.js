import PouchDB from "pouchdb";

const db = new PouchDB("app");

export const createDocument = async (doc) => {
	try {
		const response = await db.put({
			...doc,
			_id: new Date().toISOString(), // Using timestamp as unique id
		});

		return response;
	} catch (error) {
		console.error("Error creating document:", error);
	}
};

export const getDocument = async (docId) => {
	try {
		const doc = await db.get(docId);

		return doc;
	} catch (error) {
		console.error("Error retrieving document:", error);
	}
};

export const updateDocument = async (docId, newData) => {
	try {
		const doc = await db.get(docId);
		const response = await db.put({
			...doc,
			...newData,
		});

		return response;
	} catch (error) {
		console.error("Error updating document:", error);
	}
};

export const deleteDocument = async (docId) => {
	try {
		const doc = await db.get(docId);
		const response = await db.remove(doc);

		return response;
	} catch (error) {
		console.error("Error deleting document:", error);
	}
};
