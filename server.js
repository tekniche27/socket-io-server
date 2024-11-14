const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const port = process.env.PORT || 3001;  // If process.env.PORT is undefined, then it defaults to 3001
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
      },

  // optional, useful for custom headers
  handlePreflightRequest: (req, res) => {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST",
      "Access-Control-Allow-Headers": "my-custom-header",
      "Access-Control-Allow-Credentials": true
    });
    res.end();
  }
});

const cors = require('cors')

app.use(cors())

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('join-room', (id) => {
    socket.broadcast.emit('user-connected', id)
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  })
});

const srv = server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/chat', require('peer').ExpressPeerServer(srv, {
	debug: true
}))