import { useState } from 'react'
import './App.css'
import SignUp from './components/pages/onBoarding/auth/SignUp'
import SignIn from './components/pages/onBoarding/auth/SignIn'
import Landing from './components/pages/Landing'
import AuctionDashboard from './components/pages/dashboard/AuctionDashboard'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './utils/RequireAuth'

/*function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<RequireAuth><AuctionDashboard/></RequireAuth>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}*/

function App() {
  return (

    <AuctionDashboard/>
        
  )
}

export default App
