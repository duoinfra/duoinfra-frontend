import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Overview from './pages/Overview'
import Detail from './pages/Detail'
import Create from './pages/Create'
import { getToken } from './api'

function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/overview" element={<PrivateRoute><Overview /></PrivateRoute>} />
      <Route path="/servers/:id" element={<PrivateRoute><Detail /></PrivateRoute>} />
      <Route path="/create" element={<PrivateRoute><Create /></PrivateRoute>} />
    </Routes>
  )
}
