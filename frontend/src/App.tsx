import MainInterface from './components/MainInterface'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminLogin from './components/AdminLogin'
import ServiceLog from './components/Servicelog'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainInterface/>} />
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/service-log" element={<ServiceLog/>}/>
      </Routes>
    </Router>
  )
}

export default App