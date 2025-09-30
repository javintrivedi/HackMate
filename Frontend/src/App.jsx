import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingScreen from './Pages/LandingScreen'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import GetStarted from './Pages/GetStarted'
import WelcomeScreen from './Pages/WelcomeScreen'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Default route - LandingScreen loads when user visits "/" */}
          <Route path="/" element={<LandingScreen />} />
          
          {/* Add your other routes here */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path='/welcome' element={<WelcomeScreen/>}/>
          {/* Optional: Catch-all route for 404s */}
          <Route path="*" element={<LandingScreen />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App