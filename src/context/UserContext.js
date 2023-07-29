import { createContext, useContext, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, addDoc, doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../service/firebase";

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);
  const [loggedUser, setLoggedUser] = useState({});

  useEffect(() => {
    if (user && !loading) {
      fetchUser();
    }
  }, [user, loading]);

  const fetchUser = async () => {
    try {
      const q = query(collection(firestore, "users"), where("uid", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setLoggedUser(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loggedUser }}>
      {children}
    </UserContext.Provider>
  );
}