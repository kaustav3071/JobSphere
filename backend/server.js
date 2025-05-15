import app from './app.js';
import http from 'http';
const PORT = process.env.PORT


const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
}
);
