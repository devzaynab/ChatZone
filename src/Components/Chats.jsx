import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";
import { format, isAfter, subHours } from "date-fns";

const Chats = () => {
  const [chats, setChats] = useState({});
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data() || {}); // Default to empty object if no chats
      });

      return () => {
        unsub();
      };
    };

    if (currentUser?.uid) {
      getChats();
    }
  }, [currentUser.uid]);

  const handleSelect = async (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
    dispatch({ type: "CLEAR_MESSAGES" }); // Clear messages when a new chat is selected

    const chatId =
      currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

    const chatDocRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatDocRef);

    if (!chatDoc.exists()) {
      console.error("Chat document does not exist.");
      // Optionally handle the creation of the chat document if needed
    }
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => {
          const lastMessageDate = chat[1].date ? chat[1].date.toDate() : null;
          let formattedDate = "";

          if (lastMessageDate) {
            const now = new Date();
            if (isAfter(now, subHours(lastMessageDate, 24))) {
              formattedDate = format(lastMessageDate, "HH:mm a"); // Display time if within 24 hours
            } else {
              formattedDate = format(lastMessageDate, "MMMM dd, yyyy"); // Display date if older than 24 hours
            }
          }

          return (
            <div
              className="userchat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <img src={chat[1].userInfo.photoURL} alt="user avatar" />
              <div className="userchatinfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text || ""}</p> {/* Empty text if no message */}
                {formattedDate && <small>{formattedDate}</small>} {/* Conditionally render date */}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;
