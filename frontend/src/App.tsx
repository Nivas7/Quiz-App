import { BrowserRouter, Route, Routes } from "react-router-dom"
import Admin from './components/Admin'
import User from './components/User'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
