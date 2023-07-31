import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, addDoc, doc, setDoc } from "firebase/firestore";
import { auth, db, logout, firestore } from "../service/firebase"
import { useUserContext } from '../context/UserContext';

export default function UserTemplate() {
  const [loading, error] = useAuthState(auth);
  const { user, loggedUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user && !loading){
      navigate("/")
    }
  }, [user, loading]);

  const logUserOut = () => {
    logout();
  }

  return (
    <div>
      <h1>Hello, {loggedUser.username}!</h1>
      <ul>
        <li><Link to="/">home</Link></li>
        <li><Link to="/dashboard">dashboard</Link></li>
        <li><button onClick={logUserOut}>logout</button></li>
      </ul>
      <Outlet />
    </div>
  )
}
