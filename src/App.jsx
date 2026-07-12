import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Overview from './pages/Overview'
import Detail from './pages/Detail'
import Create from './pages/Create'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/servers/:id" element={<Detail />} />
      <Route path="/create" element={<Create />} />
    </Routes>
  )
}
