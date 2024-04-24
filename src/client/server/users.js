import bcrypt from "bcrypt";
import { createDocument, deleteDocument, updateDocument } from "./database.js";

const saltRounds = 10;

export const createUser = (userData) => {
	return createDocument({
		...userData,
		type: "user",
	});
};

export const findUserByUsername = async (username) => {
	const allUsers = await db.allDocs({ include_docs: true });

	const userDoc = allUsers.rows.find((doc) => {
		return doc.doc.type === "user" && doc.doc.username === username;
	});

	return userDoc ? userDoc.doc : null;
};

export const updateUser = async (userId, updateData) => {
	try {
		// If the updateData includes a password
		// we hash it before saving
		if (updateData.password) {
			const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
			updateData.password = hashedPassword;
		}

		return await updateDocument(userId, updateData);
	} catch (error) {
		console.error("Error updating user:", error);
	}
};

export const deleteUser = (userId) => {
	return deleteDocument(userId);
};
