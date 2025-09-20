import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/Loginpage'
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';


function App() {
  return (

    <Router>
      <Routes>
        <Route path="/homepage" element={<HomePage/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
