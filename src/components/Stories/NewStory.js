import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, where, addDoc, query } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, logout, firestore, storage } from "../../service/firebase";
import { useUserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export default function NewStory() {
  const { user, loggedUser } = useUserContext();
  const storyNameRef = useRef();
  const storyImgRef = useRef();
  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();
    const storyName = storyNameRef.current.value;
    try {
      const sanitizedStoryName = storyName.replace(/[^a-zA-Z0-9 ]/g, '');
      // check if storyname exists already
      const q = query(
        collection(firestore, "stories"),
        where("storyName", "==", sanitizedStoryName),
        where("author", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        const data = {
          storyName: storyName,
          author: user.uid,
          allowedUsers: [user.uid]
        };
        if (storyImgRef.current.files[0]) {
          const imageFile = storyImgRef.current.files[0];
          const allowedTypes = ["image/jpeg", "image/png", "imageFile/jpg"]; // List of allowed image types
          if (!allowedTypes.includes(imageFile.type)) {
            alert("Please upload a valid image (JPEG, JPG, or PNG)");
            return;
          }
          const storageRef = ref(storage, `storyImages/${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          const downloadURL = await getDownloadURL(storageRef);
          data.backgroundImageURL = downloadURL;
        }
  
        // Use addDoc to generate a random document ID and save the data
        const newStoryRef = await addDoc(collection(firestore, "stories"), data);
        console.log("data saved successfully", newStoryRef.id);
        navigate(`/story/${newStoryRef.id}`);
      } else {
        alert("You already have a story with the same name");
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  const createRoom = (e) => {
    e.preventDefault();
    submitForm(e);
    storyNameRef.current.value = "";
  };

  return (
    <div>
      <h2>Create a New Story, {loggedUser.username}!</h2>
      <form onSubmit={createRoom}>
        <label>Story name</label>
        <input type="text" ref={storyNameRef} required />
        <label>Background Image</label>
        <input type="file" ref={storyImgRef} />
        <button type="submit">Create Room</button>
      </form>
      <button>
        <Link to="/">dashboard</Link>
      </button>
    </div>
  );
}
