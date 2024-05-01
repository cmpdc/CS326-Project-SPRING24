import bcrypt from "bcrypt";
import Database from "./database.js";

const db = new Database("users");

class Users {
	/**
	 * Hashes the password using bcrypt.
	 * @param {string} password - The password to hash.
	 * @returns {Promise<string>} - The hashed password.
	 */
	static #hashPassword = async (password) => {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	};

	/**
	 * Creates a new user in the database.
	 * @param {Object} userData - The user data to store.
	 * @returns {Promise<Object>} - The creation response from the database.
	 */
	static async create(userData) {
		userData.password = await Users.#hashPassword(userData.password);

		return db.create({
			...userData,
			type: "user",
		});
	}

	/**
	 * Finds a user by username.
	 * @param {string} username - The username to search for.
	 * @returns {Promise<Object|null>} - The user document if found, otherwise null.
	 */
	static async find(username) {
		try {
			const allUsers = await db.db.allDocs({ include_docs: true });
			const userDoc = allUsers.rows.find((doc) => doc.doc.username === username && doc.doc.type === "user");

			return userDoc ? userDoc.doc : null;
		} catch (error) {
			console.error("Error finding user by username:", error);

			return null;
		}
	}

	/**
	 * Updates a user in the database.
	 * @param {string} username - The username of the user to update.
	 * @param {Object} updateData - The data to update.
	 * @returns {Promise<Object> | null} - The update response from the database.
	 */
	static async update(username, updateData) {
		try {
			const userDoc = await Users.find(username);
			if (!userDoc) {
				throw new Error("User not found");
			}

			if (updateData.password) {
				updateData.password = await Users.#hashPassword(updateData.password);
			}

			const updatedDoc = {
				...userDoc,
				...updateData,
				_id: userDoc._id, // Ensure the _id is carried over
				_rev: userDoc._rev, // Ensure the _rev is correct
			};

			return await db.db.put(updatedDoc); // Use put to update an existing document
		} catch (error) {
			console.error("Error updating user:", error);
			return null;
		}
	}

	/**
	 * Deletes a user from the database.
	 * @param {string} userId - The ID of the user to delete.
	 * @returns {Promise<Object>} - The deletion response from the database.
	 */
	static delete(userId) {
		return db.delete(userId);
	}
}

export default Users;
