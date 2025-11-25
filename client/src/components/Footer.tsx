

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-10">

        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-xl font-bold mb-4">BlogIt</h2>
            <p className="text-white/70">
              For the best articles around.
            </p>
          </div>

       
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-500">Navigation</h3>
            <ul className="space-y-2">
              <li><a className="hover:text-red-500 transition">Home</a></li>
              <li><a className="hover:text-red-500 transition">Register</a></li>
              <li><a className="hover:text-red-500 transition">Login</a></li>
            </ul>
          </div>

 
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-500">Support</h3>
            <ul className="space-y-2">
              <li><a className="hover:text-green-500 transition">FAQs</a></li>
              <li><a className="hover:text-green-500 transition">Help Center</a></li>
              <li><a className="hover:text-green-500 transition">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex gap-4">
              <a className="hover:text-red-500 transition">Twitter</a>
              <a className="hover:text-red-500 transition">GitHub</a>
              <a className="hover:text-red-500 transition">LinkedIn</a>
            </div>
          </div>

        </div>

      
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/60 text-sm">
          &copy; {new Date().getFullYear()} BlogIt. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
