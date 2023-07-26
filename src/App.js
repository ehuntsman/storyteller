import React, { useEffect, useState } from 'react';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Register from './components/Login/Register';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';

function App() {  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
