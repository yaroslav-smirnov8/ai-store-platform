import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Removed Telegram dependencies - now pure web app
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CommunityPage from './pages/CommunityPage';
import BotPage from './pages/BotPage';
import FreeLessonsPage from './pages/FreeLessonsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import './App.css';

function App() {
  // Pure web app - no initialization needed

  return (
    <Router>
      <div className="App min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/bot" element={<BotPage />} />
          <Route path="/free-lessons" element={<FreeLessonsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
