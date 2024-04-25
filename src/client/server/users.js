import Database from "./database.js";

const db = new Database("users");

export const createUser = (userData) => {
	return createDocument({
		...userData,
		type: "user",
	});
};

export const findUserByUsername = async (username) => {
	try {
		const allUsers = await db.db.allDocs({ include_docs: true });
		const userDoc = allUsers.rows.find((doc) => {
			return doc.doc.type === "user" && doc.doc.username === username;
		});

		return userDoc ? userDoc.doc : null;
	} catch (error) {
		console.error("Error finding user by username:", error);
	}
};

export const updateUser = async (userId, updateData) => {
	try {
		// If the updateData includes a password
		// we hash it before saving
		if (updateData.password) {
		}

		return await db.update(userId, updateData);
	} catch (error) {
		console.error("Error updating user:", error);
	}
};

export const deleteUser = (userId) => {
	return db.delete(userId);
};
