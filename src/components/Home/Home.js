import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { auth, db, logout, firestore } from "../../service/firebase"
import "./Home.scss"


export default function Home() {
    const [user, loading, error] = useAuthState(auth);
    const cloud = "https://firebasestorage.googleapis.com/v0/b/storyteller-34bc2.appspot.com/o/siteimages%2Fcloud.png?alt=media&token=9599f07e-0a84-436e-92cc-bf66625ace73"

  return (
    <div className="home-page">
        <div className="clouds-wrapper">
            <div className="cloud first">
                <img src={cloud} className="cloud1" alt="cloud" />
                <img src={cloud} className="cloud2" alt="cloud" />
            </div>
        </div>
        <div className="home-container">
            <div className="home-links">
                {user ? 
                    <Link to="/dashboard">
                        <button>
                            To my Dashboard
                        </button>
                    </Link>
                :
                    <Link to="/login">
                        <button>
                            Login
                        </button>
                    </Link>
                }
            </div>
        </div>
    </div>
  )
}
