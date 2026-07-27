import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./AdminLiveChat.css";

const socket = io("https://ods-network-backend.onrender.com");

function AdminLiveChat() {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

useEffect(() => {

  // Admin joins common admin room
  socket.emit("join_admin");


  // Load existing chats from MongoDB
  const fetchActiveChats = async () => {

    try {

      const response = await fetch(
        "https://ods-network-backend.onrender.com/api/admin/chats"
      );

      const data = await response.json();

      if (data.success) {

        setActiveChats(data.chats || []);

      }

    } catch (error) {

      console.error(
        "Active Chats Error:",
        error
      );

    }

  };


  fetchActiveChats();


  // Receive new real-time messages
  const handleReceiveMessage = (data) => {

    // console.log(
    //   "ADMIN RECEIVED:",
    //   data
    // );


    // Client sends a new message
    if (data.sender === "client") {

      setActiveChats((prev) => {

        const exists = prev.find(
          (chat) =>
            chat.clientId === data.clientId
        );


        if (exists) {

          return prev.map((chat) =>
            chat.clientId === data.clientId
              ? {
                  ...chat,
                  lastMessage:
                    data.message,
                  lastMessageTime:
                    data.createdAt,
                }
              : chat
          );

        }


        return [
          {
            clientId:
              data.clientId,

            room:
              data.room,

            lastMessage:
              data.message,

            lastMessageTime:
              data.createdAt,

          },

          ...prev,

        ];

      });

    }


    // Add new message to selected chat
    if (
      selectedClient &&
      selectedClient.clientId ===
        data.clientId
    ) {

      setMessages((prev) => [

        ...prev,

        data,

      ]);

    }

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


}, [selectedClient]);
const openChat = async (chat) => {
  setSelectedClient(chat);

  // Join selected client's room
  socket.emit("join_room", chat.room);

  // Fetch chat history from MongoDB
  try {
    const response = await fetch(
      `https://ods-network-backend.onrender.com/api/chat/${chat.clientId}`
    );

    const data = await response.json();

    if (data.success) {
      setMessages(data.messages || []);
    } else {
      setMessages([]);
    }

  } catch (error) {
    console.error(
      "Admin Chat History Error:",
      error
    );

    setMessages([]);
  }
}; 
const sendMessage = () => {

  if (
    !message.trim() ||
    !selectedClient
  ) {
    return;
  }


  const messageData = {

    room:
      selectedClient.room,

    clientId:
      selectedClient.clientId,

    sender:
      "admin",

    message:
      message.trim(),

  };


  // console.log(
  //   "ADMIN SENDING:",
  //   messageData
  // );


  socket.emit(
    "send_message",
    messageData
  );


  setMessage("");

}; return (
    <div className="admin-live-chat">

      {/* Active Chats */}
      <div className="active-chats">

        <h2>
          Active Chats
        </h2>

        {activeChats.length === 0 ? (
          <p className="no-active-chat">
            No active chats yet.
          </p>
        ) : (
          activeChats.map((chat) => (
            <div
              key={chat.clientId}
              className={`chat-item ${
                selectedClient?.clientId ===
                chat.clientId
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                openChat(chat)
              }
            >
              <h3>
                Client
              </h3>

              <p>
                {chat.lastMessage}
              </p>
            </div>
          ))
        )}

      </div>


      {/* Chat Window */}
      <div className="chat-window">

        {selectedClient ? (
          <>
            <div className="chat-window-header">

              <h2>
                Live Support
              </h2>

              <span>
                Client Support
              </span>

            </div>


            <div className="admin-chat-messages">

              {messages.length === 0 ? (
                <p className="empty-chat">
                  No messages yet.
                </p>
              ) : (
                messages.map(
                  (item, index) => (
                    <div
                      key={index}
                      className={`chat-message ${
                        item.sender === "admin"
                          ? "admin-message"
                          : "client-message"
                      }`}
                    >
                      <p>
                        {item.message}
                      </p>
                    </div>
                  )
                )
              )}

            </div>


            <div className="admin-chat-input">

              <input
                type="text"
                placeholder="Type your reply..."
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
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
          </>
        ) : (
          <div className="no-chat-selected">

            <h2>
              Select a client chat
            </h2>

            <p>
              Choose an active chat to reply
              to the client.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminLiveChat;