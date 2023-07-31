import { createContext, useContext, useState, useEffect } from "react";
import { Outlet, useParams } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDoc, where, addDoc, doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../../service/firebase";

const StoryContext = createContext();

export function useStoryContext() {
    return useContext(StoryContext);
}

export default function StoryWrapper({ children }) {
    const [story, setStory] = useState({})
    const { id } = useParams();

  useEffect(() => {
    const getStory = async () => {
      try {
        const storyDocRef = doc(firestore, "stories", id)
        const storyDocSnapshot = await getDoc(storyDocRef);
        if (storyDocSnapshot.exists()) {
          const data = storyDocSnapshot.data();
          setStory(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getStory();
  }, [id]);

  return (
    <StoryContext.Provider value={{ story }}>
      <Outlet />
    </StoryContext.Provider>
  );
}