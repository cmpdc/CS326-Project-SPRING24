import { readFile } from "fs";
import * as http from "http";
import path, { join } from "path";

const __dirname = "src/client";

async function basicServer(req, res) {
	// Normalize the request URL to remove trailing slashes for non-root paths
	const sanitizedUrl = req.url.endsWith("/") && req.url.length > 1 ? req.url.slice(0, -1) : req.url;

	let filePath = join(__dirname, sanitizedUrl);

	// Better checking for file requests by looking for known file extensions
	if (!/\.(js|css|json|png|jpg|jpeg|svg)$/.test(filePath)) {
		filePath = join(__dirname, "index.html");
	} else {
		if (!path.extname(filePath)) {
			filePath += ".html";
		}
	}

	const ext = path.extname(filePath).toLowerCase();
	let contentType = "text/html"; // Default content type

	switch (ext) {
		case ".js":
			contentType = "text/javascript";
			break;
		case ".css":
			contentType = "text/css";
			break;
		case ".json":
			contentType = "application/json";
			break;
		case ".png":
			contentType = "image/png";
			break;
		case ".jpg":
		case ".jpeg":
			contentType = "image/jpeg";
			break;
		default:
			// Default to HTML for SPA paths or unrecognized file extensions
			contentType = "text/html";
			filePath = join(__dirname, "index.html");
			break;
	}

	readFile(filePath, (err, content) => {
		if (err) {
			res.writeHead(404);
			res.end("File not found");
			return;
		}
		// Serve the file with the determined content type
		res.writeHead(200, { "Content-Type": contentType });
		res.end(content, "utf8");
	});
}

http.createServer(basicServer).listen(3000, () => {
	console.log("Server (frontend) started on port 3000");
});
