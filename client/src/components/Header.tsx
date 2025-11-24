import { Link } from "react-router-dom"
import { Button } from "./ui/button"

function Header() {
  return (
    <header className="w-full bg-black text-white shadow-md h-24 flex fixed top-0 left-0 z-10 ">
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold">BlogIt</h1>
        <nav className="flex gap-6">
            <Link to="/" className="hover:text-red-500 transition text-xl">Home</Link>
            <Link to="/register" className="hover:text-red-500 transition text-xl">Register</Link>
            <Link to="/login" className="hover:text-red-500 transition text-xl">Login</Link>
        </nav>
        <Button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white">Logout</Button>
      </div>
    </header>
  )
}

export default Header