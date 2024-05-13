import { editEventComponent } from "./components/editEventComponent.js";
import Toast from "./components/toast.js";

export const deleteEvent = async (eventId) => {
	try {
		const response = await fetch(`http://127.0.0.1:3001/events/${eventId}`, {
			method: "DELETE",
		});

		if (response.ok) {
			new Toast({
				text: "Event deleted successfully",
			});
		} else {
			new Toast({
				text: "Failed to delete event",
			});
		}
	} catch (error) {
		new Toast({
			text: "Error deleting event",
		});

		console.error(error);
	}
};

export const editEvent = (data) => {
	editEventComponent(data);
};
