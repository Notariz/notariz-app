import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import { App } from './App';
import Dashboard from './components/Dashboard';
import { About } from './components/About';

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />}/>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<About />} /> 
        </Route>
      </Routes>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('app')
);
