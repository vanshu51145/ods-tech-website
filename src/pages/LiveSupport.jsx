import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./LiveSupport.css";

const socket = io("https://ods-network-backend.onrender.com");

function LiveSupport() {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const client = JSON.parse(
        localStorage.getItem("client")
    );

    const clientId = client?._id;


useEffect(() => {
  if (!clientId) return;

  // Join client room
  socket.emit("join_room", clientId);

  // Fetch old chat history
  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `https://ods-network-backend.onrender.com/api/chat/${clientId}`
      );

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Chat History Error:", error);
    }
  };

  fetchChatHistory();

  // Receive new messages
  const handleReceiveMessage = (data) => {
    console.log("NEW SOCKET MESSAGE:", data);

    setMessages((prev) => [
      ...prev,
      data,
    ]);
  };

  socket.on(
    "receive_message",
    handleReceiveMessage
  );

  return () => {
    socket.off(
      "receive_message",
      handleReceiveMessage
    );
  };

}, [clientId]);

const sendMessage = () => {
  if (!message.trim() || !clientId) return;

  const messageData = {
    room: clientId,
    clientId: clientId,
    sender: "client",
    message: message.trim(),
  };

  console.log("SENDING MESSAGE:", messageData);

  socket.emit(
    "send_message",
    messageData
  );

  setMessage("");
};

    return (

        <div className="live-support">

            <div className="chat-header">

                <h2>
                    Live Support
                </h2>

                <span>
                    ● Online
                </span>

            </div>


            <div className="chat-messages">

                {messages.length === 0 ? (

                    <p className="empty-chat">
                        Start a conversation with our support team.
                    </p>

                ) : (

                    messages.map((item, index) => (

                        <div
                            key={index}
                            className={`message ${item.sender === "client"
                                    ? "client-message"
                                    : "admin-message"
                                }`}
                        >

                            <p>
                                {item.message}
                            </p>

                        </div>

                    ))

                )}

            </div>


            <div className="chat-input">

                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {
                            sendMessage();
                        }

                    }}
                />

                <button
                    onClick={sendMessage}
                >
                    Send
                </button>

            </div>

        </div>

    );

}

export default LiveSupport;