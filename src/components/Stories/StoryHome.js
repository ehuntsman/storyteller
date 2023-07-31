import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { query, doc, getDoc, collection, getDocs, where, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../../service/firebase";
import { useUserContext } from "../../context/UserContext";

export default function StoryHome() {
  const [story, setStory] = useState({});
  const [allowedUsernames, setAllowedUsernames] = useState([]);
  const { user, loggedUser } = useUserContext();
  const { id } = useParams();
  const dataRef = useRef()

  useEffect(() => {
    const getStory = async () => {
      try {
        const storyDocRef = doc(firestore, "stories", id)
        const storyDocSnapshot = await getDoc(storyDocRef);
        if (storyDocSnapshot.exists()) {
          const data = storyDocSnapshot.data();
          setStory(data);
          getAllAllowedUsers(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getStory();
  }, [id]);

  const getAllAllowedUsers = async (data) => {
    // need to make a call to check because username may have changed since they last created it
    try {
      let users = [loggedUser.username];
      await Promise.all(
        data.allowedUsers?.map(async (userId) => {
          const encodedUID = btoa(userId);
          console.log("this is the userid", userId, "and the encoded", encodedUID);
          const userRef = doc(firestore, "users", encodedUID);
          const userDocSnapshot = await getDoc(userRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            console.log("this is the username", userData.username);
            if(!users.includes(userData.username)){
              users = [...users, userData.username]
            }
          }
        })
      );
      setAllowedUsernames(users)
    } catch (err) {
      console.log(err)
    }
  }

  // this isn't working
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("saving user triggered")
    const userEmail = dataRef.current.value;

    // Look up the user by email and get their UID
    const userQuery = query(collection(firestore, "users"), where("email", "==", userEmail));
    const userQuerySnapshot = await getDocs(userQuery);
    console.log("this is the user?", userQuerySnapshot)
    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userUid = userDoc.data().uid;
      console.log("this is id", userUid, "and the username???", userDoc.data().username)

      // Add the user's UID to the "allowedUsers" array for the current story
      const storyDocRef = doc(firestore, "stories", id);
      await updateDoc(storyDocRef, {
        allowedUsers: arrayUnion(userUid),
      });

      // Update the local state to reflect the changes
      setAllowedUsernames(oldArray => [...oldArray, userDoc.data().username]);
      // Clear the form
      dataRef.current.value = "";
    } else {
      console.log("User not found");
    }
  };

  return (
    <div>
      {story.storyName} home for {loggedUser.username}
      <p>Add users to your story to collaborate by putting in their email</p>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={dataRef} />
        <button type="submit">Add user</button>
      </form>
      <p>Allowed Users:</p>
      <ul>
        {allowedUsernames.map((allowedUser) => {
          if(allowedUser) {
            return <li key={allowedUser}>{allowedUser}</li>;
          }
        })}
      </ul>
    </div>
  );
}


// to do:
// allow allowedUsers to be anyone
// set admins (who can change backgrounds)
// or maybe set a public/private setting. and if it's public, then allowed users can change background and be admins?)
// only the author can kick/add allowed users
// can we change owner?
// switch database and hosting and storage to private????