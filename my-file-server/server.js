const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    const filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
    const fileExt = path.extname(filePath);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        // Serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }

            res.setHeader('Content-Type', getContentType(fileExt));
            res.writeHead(200);
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Helper function to get the content type based on the file extension
function getContentType(ext) {
    switch (ext) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        default:
            return 'text/plain';
    }
}
