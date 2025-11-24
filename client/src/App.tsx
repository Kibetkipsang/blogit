
import './App.css'
import Home from './components/Home'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'



function App() {


  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </>
  )
}

export default App
