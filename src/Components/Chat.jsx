import { AiOutlineCamera } from "react-icons/ai";
import { MdPersonAdd } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import Messages from "./Messages";
import Input from "./Input";
import { useContext, useState } from "react";
import { ChatContext } from "../Context/ChatContext";
import { db } from "../firebase"; // Ensure Firebase is initialized
import { updateDoc, doc } from "firebase/firestore"; // Import Firestore methods

const Chat = () => {
  const { data } = useContext(ChatContext); // Current chat data
  const [messages, setMessages] = useState([]); // Initialize messages as an empty array
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to clear chat messages from Firestore and local state
  const handleClearChat = async () => {
    if (data.chatId) {
      const chatRef = doc(db, "chats", data.chatId); // Reference to the chat document
      try {
        // Clear messages in Firestore and update last message
        await updateDoc(chatRef, { 
          messages: [], 
          lastMessage: { text: "No messages", date: new Date() } // Update last message to indicate cleared state
        });
        setMessages([]); // Clear messages locally
      } catch (err) {
        console.error("Error clearing chat:", err);
      }
    }
  };

  return (
    <div className="chat">
      <div className="chatinfo">
        <span>{data.user?.displayName}</span>
        <div className="chaticons">
          <AiOutlineCamera style={{ fontSize: "24px", cursor: "pointer" }} />
          <MdPersonAdd style={{ fontSize: "24px", cursor: "pointer", color: "#3d485f" }} />
          <FiMoreHorizontal 
            style={{ fontSize: "24px", cursor: "pointer" }} 
            onClick={toggleDropdown} 
          />
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="dropdown">
              <ul>
                <li onClick={handleClearChat}>Clear Chat</li>
                <li onClick={() => alert("New Group")}>New Group</li>
                <li onClick={() => alert("View Contact")}>View Contact</li>
                <li onClick={() => alert("Wallpaper")}>Wallpaper</li>
                <li onClick={() => alert("More Options")}>More Options</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <Messages messages={messages} />
      <Input />
    </div>
  );
};

export default Chat;
