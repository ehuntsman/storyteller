import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where, addDoc, doc, setDoc } from "firebase/firestore";
import { auth, db, logout, firestore } from "../../service/firebase";

function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [loggedUser, setLoggedUser] = useState({})
  const navigate = useNavigate();
  const dataRef = useRef()

  const fetchUser = async () => {
    try {
      const q = query(collection(firestore, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setLoggedUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (testdata) => {
    try {
      const q = query(collection(firestore, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(firestore, "users", userDoc.id); // Get the document reference
        await setDoc(userRef, { username: testdata }, { merge: true });
        console.log("Username updated successfully");
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUser();
  }, [user, loading]);

  const submithandler = (e) => {
    e.preventDefault()
    handleSubmit(dataRef.current.value)
    dataRef.current.value = ""
  }
 

  return (
    <div className="dashboard">
       <div className="dashboard__container">
        Logged in as
         <div>{loggedUser?.username}</div>
         <div>{user?.email}</div>
         <p>{loggedUser?.role}</p>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
         <div>username: {loggedUser?.username}</div>
         <div className="App">
          <form onSubmit={submithandler}>
            <input type= "text" ref={dataRef} />
            <button type = "submit">Change Username</button>
          </form>
          </div>
          <button>click here to make a new room</button>
       </div>
     </div>
  );
}

export default Home;