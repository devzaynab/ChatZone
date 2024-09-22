import { useContext, useState } from "react";
import { collection, query, where, getDocs, setDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../Context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErr(true); // If no user is found, set error
        setUser(null); // Clear any previous user
      } else {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
          setErr(false); 
        });
      }
    } catch (err) {
      setErr(true);
      console.error("An error occurred while performing the operation:", err);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async (selectedUser) => {
    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // If the chat doesn't exist, create a new one
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
      }

      // Update user chats for current user
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: selectedUser.uid,
          displayName: selectedUser.displayName,
          photoURL: selectedUser.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      // Update user chats for selected user
      await updateDoc(doc(db, "userChats", selectedUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchform">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found</span>}
      {user && (
        <div className="userchat" onClick={() => handleSelect(user)}>
          <img src={user.photoURL} alt="User avatar" />
          <div className="userchatinfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
