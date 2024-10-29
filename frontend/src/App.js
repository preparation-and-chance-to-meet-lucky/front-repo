import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Owner from './components/OwnerPage/Owner';
import OwnerPlaylist from './components/OwnerPage/OwnerPlaylist';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Owner />} />
        <Route path="/OwnerPlaylist" element={<OwnerPlaylist />} />
      </Routes>
    </Router>
  );
};

export default App;
