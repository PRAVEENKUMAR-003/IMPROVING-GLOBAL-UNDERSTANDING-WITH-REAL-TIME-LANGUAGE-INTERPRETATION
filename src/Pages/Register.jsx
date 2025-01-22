import React, { useState } from "react";
import Add from "../img/addAvatar.jpg"; // Placeholder avatar image
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "ta", label: "Tamil" },
  { value: "hi", label: "Hindi" },
  { value: "ml", label: "Malayalam" },
  { value: "zh", label: "Chinese" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "el", label: "Greek" }, 
  { value: "hu", label: "Hungarian" },
  { value: "gd", label: "Scottish" },
  { value: "nl", label: "Dutch" },
];

const Register = () => {
  const [err, setErr] = useState("");
  const [language, setLanguage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Access fields by name for better readability and reliability
    const displayName = e.target.elements.displayName?.value;
    const email = e.target.elements.email?.value;
    const password = e.target.elements.password?.value;
    const file = e.target.elements.file?.files[0];
    
    // Check if all fields are filled and a file is selected
    if (!displayName || !email || !password || !file) {
      setErr("Please fill in all fields and select an avatar.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, `avatars/${res.user.uid}/${displayName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          setErr("Error uploading avatar.");
          console.error("Upload error:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
            preferredLanguage: language,
          });

          await setDoc(doc(db, "userChats", res.user.uid), {});

          navigate("/");
        }
      );
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErr("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        setErr("Invalid email format.");
      } else if (error.code === "auth/weak-password") {
        setErr("Password should be at least 6 characters.");
      } else {
        setErr("An unexpected error occurred. Please try again.");
      }
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="formContainer">
      <div className="TiTle">
        <h1>"Spice up your social life! Sign up to chat, flirt, and make new connections today." ➣➣➣</h1>
      </div>
      <div className="formWrapper">
        <span className="logo">Opal⍌⍌hisper</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Display Name" name="displayName" />
          <input type="email" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <select name="language" onChange={(e) => setLanguage(e.target.value)} value={language}>
            <option value="">Select Preferred Language</option>
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
          <input style={{ display: "none" }} type="file" id="file" name="file" />
          <label htmlFor="file">
            <img src={Add} alt="Avatar" />
            <span>Add an avatar</span>
          </label>
          <button type="submit">Sign up</button>
          {err && <span>{err}</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
