import { AiOutlinePaperClip } from "react-icons/ai";
import { MdImage } from "react-icons/md";
import { ChatContext } from "../Context/ChatContext";
import { AuthContext } from "../Context/AuthContext";
import { useContext, useState } from "react";
import { arrayUnion, Timestamp, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { v4 as uuid } from 'uuid';
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { db, storage } from "../firebase";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.error("Image upload error:", error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('Image uploaded successfully, download URL:', downloadUrl);

          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadUrl,
            }),
          });

          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [`${data.chatId}.lastMessage`]: {
              text
            },
            [`${data.chatId}.date`]: serverTimestamp()
          });

          await updateDoc(doc(db, "userChats", data.user.uid), {
            [`${data.chatId}.lastMessage`]: {
              text
            },
            [`${data.chatId}.date`]: serverTimestamp()
          });

          setText("");
          setImg(null);
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [`${data.chatId}.lastMessage`]: {
          text
        },
        [`${data.chatId}.date`]: serverTimestamp()
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [`${data.chatId}.lastMessage`]: {
          text
        },
        [`${data.chatId}.date`]: serverTimestamp()
      });

      setText("");
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <AiOutlinePaperClip
          style={{ fontSize: "24px", cursor: "pointer", color: "lightgray" }}
        />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <MdImage
            style={{ fontSize: "24px", cursor: "pointer", color: "lightgray" }}
          />
        </label>
        <button 
          onClick={handleSend} 
          disabled={!text && !img} 
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
