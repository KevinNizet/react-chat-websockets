import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3001";

function App() {
  const [messageList, setMessageList] = useState([]);
  const [nickName, setNickName] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);

    socket.on("chatMessage", (message) => {
      setMessageList((messages) => [...messages, message]);
    });

    socket.on("initMessageList", (messages) => {
      setMessageList(messages);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("chatMessage", {
      author: nickName,
      text: newMessageText,
    });
    setNewMessageText("");
  };

  return (
    <div className="App">
      <h2>Messages</h2>
      {messageList.map((message, index) => {
        return (
          <div key={index}>
            {message.author} : {message.text}
          </div>
        );
      })}

      <form onSubmit={handleSubmit}>
        <h2>New Message</h2>
        <input
          type="text"
          name="author"
          placeholder="nickname"
          value={nickName}
          required
          onChange={(e) => setNickName(e.target.value)}
        />
        <input
          type="text"
          name="messageContent"
          placeholder="message"
          value={newMessageText}
          required
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <input type="submit" value="send" />
      </form>
    </div>
  );
}

export default App;
