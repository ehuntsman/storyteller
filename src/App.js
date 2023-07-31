import React from 'react';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Register from './components/Login/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NewStory from './components/Stories/NewStory';
import StorySettings from './components/Stories/StorySettings';
import UserTemplate from './templates/UserTemplate';
import { UserProvider } from './context/UserContext';
import Home from './components/Home/Home';
import Story from './components/Stories/Story';
import StoryWrapper from './components/Stories/StoryWrapper';

function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<UserTemplate />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/story/new" element={<NewStory />} />
                <Route path="/story/:id" element={<StoryWrapper />}>
                  <Route path="/story/:id" element={<Story />} />
                  <Route path="/story/:id/settings" element={<StorySettings />} />
                </Route>
              </Route>
            </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
