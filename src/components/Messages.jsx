import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore"; 
import React, { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../context/UserContext";
import { db } from "../firebase";
import Message from "./Message"; 
import { AuthContext } from "../context/AuthContext"; 

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(UserContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []);
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  const getRecipientPreferredLanguage = async (recipientId) => {
    try {
      const userDocRef = doc(db, "users", recipientId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data().preferredLanguage;
      } else {
        console.error("No such user document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };
  console.log("messages",messages)
  console.log("data",data)
  const updateChatWithTranslation = useCallback(async (translatedText) => {
    try {
      const chatRef = doc(db, "chats", data.chatId);
      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.senderId === currentUser.uid) {
        const updatedMessage = {
          ...lastMessage,
          text: lastMessage.text, 
          translatedText: translatedText, 
          date: new Date(), 
          isTranslated: true,
        };

        const updatedMessages = [...messages];
        updatedMessages[updatedMessages.length - 1] = updatedMessage; 
        
        await updateDoc(chatRef, { messages: updatedMessages });
      } else {
        const newMessage = {
          text: lastMessage.text, 
          translatedText, 
          senderId: currentUser.uid,
          date: new Date(),
          isTranslated: true,
        };

        await updateDoc(chatRef, { messages: [...messages, newMessage] });
      }
    } catch (error) {
      console.error("Error updating chat document:", error);
    }
  }, [data.chatId, currentUser.uid, messages]);

  const sendTranslationRequest = useCallback(async (text, preferredLanguage) => {
    try {
      const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, preferredLanguage }),
      });

      const data = await response.json();
      if (response.ok) {
        await updateChatWithTranslation(data.output); 
      } else {
        console.error("Translation error:", data.error);
      }
    } catch (error) {
      console.error("Error sending translation request:", error);
    }
  }, [updateChatWithTranslation]);

  useEffect(() => {
    const handleLastMessage = async () => {
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];

        if (lastMessage.isTranslated || lastMessage.senderId !== currentUser.uid) return;

        const recipientId = data.user.uid;
        const language = await getRecipientPreferredLanguage(recipientId);

        if (language && lastMessage.text) {
          await sendTranslationRequest(lastMessage.text, language);
        }
      }
    };

    handleLastMessage();
  }, [messages, currentUser, data.user.uid, sendTranslationRequest]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
