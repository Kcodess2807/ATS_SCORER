import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import AnalyzerPage from './pages/AnalyzerPage'
import ProfileDashboard from './pages/ProfileDashboard'

function App() {
  return (
    // BrowserRouter enables client-side routing
    // It watches the URL and renders the right component without a full page reload
    <BrowserRouter>

      {/*
        Navbar is OUTSIDE <Routes> so it appears on every page.
        Components outside <Routes> are always rendered.
      */}
      <Navbar />

      {/*
        Routes is like a switch statement for URLs.
        React Router looks at the current URL and renders
        the first <Route> whose path matches.
      */}
      <Routes>
        {/* path="/" → show the LandingPage component */}
        <Route path="/" element={<LandingPage />} />

        {/* path="/analyze" → show the AnalyzerPage component */}
        <Route path="/analyze" element={<AnalyzerPage />} />

        {/* path="/profile" → show the ProfileDashboard component */}
        <Route path="/profile" element={<ProfileDashboard />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
