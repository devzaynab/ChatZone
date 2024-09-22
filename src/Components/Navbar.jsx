import { useContext, useState } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { AuthContext } from "../Context/AuthContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { FaPlusCircle } from 'react-icons/fa';
import imageCompression from 'browser-image-compression';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);  // Corrected this line
  const [profileImage, setProfileImage] = useState(currentUser?.photoURL);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const compressedFile = await compressImage(selectedFile);
      setFile(compressedFile);
      handleUpload(compressedFile);
    }
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  const handleUpload = (file) => {
    if (!file) return;

    const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload error:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateProfile(auth.currentUser, { photoURL: downloadURL })
            .then(() => {
              console.log("Profile image updated");
              setProfileImage(downloadURL);
              setFile(null);  // Reset file state after upload
              updateUserPhotoURL(currentUser.uid, downloadURL); // Update Firestore
            })
            .catch((error) => {
              console.error("Error updating profile image:", error);
            });
        });
      }
    );
  };

  const updateUserPhotoURL = async (uid, photoURL) => {
    const userDoc = doc(db, "users", uid);
    try {
      await updateDoc(userDoc, { photoURL: photoURL });
      console.log("User photoURL updated successfully");
    } catch (error) {
      console.error("Error updating photoURL:", error);
    }
  };

  return (
    <div className="navbar">
      <span className="logo">ChatZone</span>
      <div className="user">
        <div className="avatar-container">
          <img
            src={
              profileImage || "https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg"
            }
            alt="User avatar"
            className="avatar-image"
            onClick={() => document.getElementById("fileInput").click()}
          />
          <FaPlusCircle className="upload-icon" onClick={() => document.getElementById("fileInput").click()} />
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <span>{currentUser?.displayName || "Guest"}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
