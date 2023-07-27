import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  doc,
  where,
  addDoc,
  setDoc
} from "firebase/firestore";
import { getDatabase, ref, set, onValue } from "firebase/database";
import envConfig from '../env-config';

const envVars = envConfig();
// Use your environment variables as needed, e.g.:
// const apiKey = envVars.API_KEY;

const firebaseConfig = {
	apiKey: envVars.apiKey,
	authDomain: envVars.authDomain,
	projectId: envVars.projectId,
	storageBucket: envVars.storageBucket,
	messagingSenderId: envVars.messagingSenderId,
	appId: envVars.appId,
	measurementId: envVars.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      const encodedUID = btoa(user.uid);
      //if needed to uncode later, you can use atob()
      const userRef = doc(firestore, "users", encodedUID);
      let data = {
        username: user.displayName,
        email: user.email,
        authProvider: "google",
        role: 3,
        uid: user.uid
      }
      try {
        await setDoc(userRef, data);
        console.log("data saved successfully")
      } catch(err) {
          console.log(err)
      }
      
    }
  } catch (err) {
    console.error(err);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  firestore
};

