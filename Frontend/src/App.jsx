import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingScreen from './Pages/LandingScreen'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import GetStarted from './Pages/GetStarted'
import WelcomeScreen from './Pages/WelcomeScreen'
import OnboardingStep1 from './Pages/OnboardingStep1'
import OnboardingStep2 from './Pages/OnboardingStep2'
import OnboardingStep3 from './Pages/OnboardingStep3'
import ConfirmDetails from './Pages/ConfirmDetails'
import Discover from "./Pages/Discover";

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
          <Route path='/details' element={<OnboardingStep1/>}/>
          <Route path='/your-info' element={<OnboardingStep2/>}/>
          <Route path='/skills' element={<OnboardingStep3/>}/>
          <Route path='/confirmDetails' element={<ConfirmDetails/>}/>
          <Route path="/discover" element={<Discover />} />
          {/* Optional: Catch-all route for 404s */}
          <Route path="*" element={<LandingScreen />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App