import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Grades from './pages/Grades';
import Transcript from './pages/Transcript';

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <rect width="140" height="140" rx="20" fill="#ffffff"/>
      <rect x="28" y="28" width="48" height="11" rx="3" fill="#0a0a0a"/>
      <rect x="28" y="28" width="11" height="84" rx="3" fill="#0a0a0a"/>
      <rect x="28" y="52" width="48" height="11" rx="3" fill="#0a0a0a"/>
      <path d="M65 63 L88 112" stroke="#0a0a0a" stroke-width="11" stroke-linecap="round" fill="none"/>
      <rect x="82" y="90" width="34" height="34" rx="6" fill="#0a0a0a" opacity="0.15"/>
      <rect x="87" y="95" width="24" height="24" rx="4" fill="none" stroke="#0a0a0a" stroke-width="1.5" opacity="0.5"/>
    </svg>
  );
}

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo />
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
              Result<span style={{ opacity: 0.35 }}>Pro</span>
            </div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>
              School Result System
            </div>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">▦</span> Dashboard
        </NavLink>
        <NavLink to="/students" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">◉</span> Students
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">◈</span> Courses
        </NavLink>
        <NavLink to="/grades" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">◎</span> Assign Grades
        </NavLink>
        <NavLink to="/transcript" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <span className="nav-icon">▤</span> Transcripts
        </NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/transcript" element={<Transcript />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}