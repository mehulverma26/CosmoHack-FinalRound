import React from 'react';
import Home from './components/Home/Home';
import Navbar from './components/Navbar';
import Assessment from './components/Assessment/Assessment';
import Dashboard from './components/Dashboard/Dashboard';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./App.css";
import "./dark.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/assessment' element={<Assessment />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App;