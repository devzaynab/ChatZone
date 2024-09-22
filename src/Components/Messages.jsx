import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../Context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Message from "./Message"; 
import { Timestamp } from "firebase/firestore"; 

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data.chatId) return;

    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        const docData = doc.data();
        const chatMessages = docData.messages?.map((message) => {
          // Convert Firestore Timestamp to JS Date if the message has a date field
          if (message.date instanceof Timestamp) {
            return {
              ...message,
              date: message.date.toDate(), // Convert Timestamp to Date
            };
          }
          return message;
        }) || [];
        setMessages(chatMessages);
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.length > 0 ? (
        messages.map((m) => <Message key={m.id} message={m} />)
      ) : (
        <p className="chatdisplay">No messages to display</p>
      )}
    </div>
  );
};

export default Messages;
