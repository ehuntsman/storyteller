import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { query, collection, getDocs, where, addDoc, doc, setDoc } from "firebase/firestore";
import { auth, db, logout, firestore } from "../../service/firebase";
import { useUserContext } from "../../context/UserContext";

function Home() {
  const [stories, setStories] = useState([]);
  const [myStories, setMyStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loggedUser } = useUserContext();
  const navigate = useNavigate();
  const dataRef = useRef()

  const handleSubmit = async (testdata) => {
    try {
      const q = query(collection(firestore, "users"), where("uid", "==", loggedUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(firestore, "users", userDoc.id);
        await setDoc(userRef, { username: testdata }, { merge: true });
        console.log("Username updated successfully");
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const getStories = async () => {
    try {
      const q = query(collection(firestore, "stories"), where("allowedUsers", "array-contains", user.uid));
      const querySnapshot = await getDocs(q);
      const storiesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          storyName: data.storyName,
          author: data.author,
          backgroundImageURL: data.backgroundImageURL,
        };
      });
      setStories(storiesData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if(user){
      getStories();
    }
  }, [user]);

  const submithandler = (e) => {
    e.preventDefault()
    handleSubmit(dataRef.current.value)
    dataRef.current.value = ""
  }

  if (loading || !loggedUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="dashboard">
       <div className="dashboard__container">
        Logged in as
         <div>{loggedUser?.username}</div>
         <div>{loggedUser?.email}</div>
         <p>{loggedUser?.role}</p>
         <div>username: {loggedUser?.username}</div>
         <div className="App">
          <form onSubmit={submithandler}>
            <input type= "text" ref={dataRef} />
            <button type = "submit">Change Username</button>
          </form>
          </div>
          <Link to="/story/new">
            click here to make a new story
          </Link>
          <h3>My stories</h3>
          {stories.length > 0 ?
          <ul>
            {stories.map((story) => {
              return (
                <li key={story.storyName}>
                  <Link key={story.id} to={`/story/${story.id}`}>{story.storyName} {story.author === user?.uid && "created by me"}</Link>
                </li>
              )
            })}
          </ul>
          : <p>You have no stories yet</p>}
       </div>
     </div>
  );
}

export default Home;