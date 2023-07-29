import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, addDoc, doc, setDoc } from "firebase/firestore";
import { auth, db, logout, firestore } from "../service/firebase"

export default function UserTemplate() {
  const [user, loading, error] = useAuthState(auth);
  const [loggedUser, setLoggedUser] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [user, loading]);

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

  return (
    <div>
      <h1>Hello, {loggedUser.username}!</h1>
      <ul>
        <li><Link to="/dashboard">dashboard</Link></li>
        <li><button onClick={logout}>logout</button></li>
      </ul>
      <Outlet />
    </div>
  )
}
