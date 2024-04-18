export const geocode = async (query) => {
	if (!query) return;

	const key = "25f2a5ca76074cfd92ec918ff01a9880";
	const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${key}`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		if (data.results && data.results.length > 0) {
			return data.results;
		} else {
			return { message: "No results found" };
		}
	} catch (error) {
		return { error: "Geocoding error", details: error };
	}
};
