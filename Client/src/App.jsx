import './App.css'
import Landing from './components/pages/Landing'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './utils/RequireAuth'
import SideMenu from './components/sideMenuBar/SideMenu'
import AuthSystem from './components/pages/onBoarding/auth/AuthSystem'
import ProfileScreen from './components/pages/profile/ProfileScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<AuthSystem />} />
        <Route path="/signup" element={<AuthSystem />} />
        <Route path="/sidemenu" element={<RequireAuth><SideMenu/></RequireAuth>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
