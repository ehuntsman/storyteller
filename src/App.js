import React from 'react';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Register from './components/Login/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NewStory from './components/Stories/NewStory';
import StoryHome from './components/Stories/StoryHome';
import UserTemplate from './templates/UserTemplate';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<UserTemplate />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/story/new" element={<NewStory />} />
              <Route path="/story/:id" element={<StoryHome />} />
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
