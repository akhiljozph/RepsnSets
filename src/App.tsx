import { Navigate, Route, Routes } from 'react-router-dom'

function Dashboard() {
  return null
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}
