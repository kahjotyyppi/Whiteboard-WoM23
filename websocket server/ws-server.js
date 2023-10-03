const WebSocket = require('ws');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const wss = new WebSocket.Server({ port: PORT });

const boardClients = {};

wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.slice(1));
    const token = urlParams.get('token');
    const boardId = urlParams.get('boardId');

    if (token === process.env.WS_TOKEN) {
        if (!boardClients[boardId]) {
            boardClients[boardId] = new Set();
        }

        boardClients[boardId].add(ws);
        console.log(`Client connected to board ${boardId}:`, req.headers['sec-websocket-key']);

        ws.on('message', (rawMessage) => {
            const message = JSON.parse(rawMessage.toString());
            console.log(`Received message for board ${boardId}:`, message);

            if (message.type === "updatePosition") {
                boardClients[boardId].forEach(clients => {

                    // Skicka inte till vår egen klient (ws)
                    if (clients === ws) return
        
                    clients.send(JSON.stringify({
                        type: 'updatePosition',
                        noteId: message.noteId,
                        x: message.x,
                        y: message.y,
                    }));
                });
            };

            if (message.type === "updateContent") {
                boardClients[boardId].forEach(clients => {

                    if (clients === ws) return
        
                    clients.send(JSON.stringify({
                        type: 'updateContent',
                        noteId: message.noteId,
                        content: message.content
                    }));
                });
            };

            if (message.type === "updateColor") {
                boardClients[boardId].forEach(clients => {

                    if (clients === ws) return
        
                    clients.send(JSON.stringify({
                        type: 'updateColor',
                        noteId: message.noteId,
                        color: message.color
                    }));
                })
            };

            if (message.type === "deleteNote") {
                boardClients[boardId].forEach(clients => {

                    if (clients === ws) return
        
                    clients.send(JSON.stringify({
                        type: 'deleteNote',
                        noteId: message.noteId,
                    }));
                })
            };

            if (message.type === "createNote") {
                boardClients[boardId].forEach(clients => {

                    if (clients === ws) return
        
                    clients.send(JSON.stringify({
                        type: 'createNote',
                        noteId: message.noteId,
                        content: message.content,
                        color: message.color,
                        x: message.x,
                        y: message.y,
                    }));
                })
            };
        });

        ws.on('close', () => {
            // Remove the connection from the Set when it closes
            boardClients[boardId].delete(ws);
            console.log(`Client disconnected from board ${boardId}:`, req.headers['sec-websocket-key']);
        });
    } else {
        // Invalid token, close the connection
        ws.send(JSON.stringify({
            type: 'error',
            msg: 'ERROR: Invalid token.'
        }));
        ws.close();
    }
});

console.log('WebSocket server started.');
