const express = require("express");
const uniqid = require("uniqid");
const app = express();
const socketIO = require("socket.io");
const server = app.listen(3001);

const io = socketIO(server, {
    cors: { origin: ["http://localhost:3000"] },
});

const messages = [
    { id: uniqid(), author: "server", text: "welcome to WildChat" },
];

io.on("connect", (socket) => {
    console.log("user connected");

    socket.on("chatMessage", (messageTextAndAuthor) => {
        const newMessage = { id: uniqid(), ...messageTextAndAuthor };
        console.log("new message from a client:", newMessage);
        messages.push(newMessage);
        io.emit("chatMessage", newMessage); // send message to all clients
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

    socket.emit("initMessageList", messages); // send the initial message list to the client
});
