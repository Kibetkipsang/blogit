import { Link } from "react-router-dom";
import { Facebook, Twitter, Github, Linkedin, Mail, Heart } from "lucide-react";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-green-400 font-bold text-3xl group-hover:text-green-300 transition-colors">₿</span>
              <span className="text-xl font-bold group-hover:text-green-400 transition-colors">BlogIt</span>
            </Link>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4">
              Your premier destination for insightful articles, tutorials, and stories from around the world.
            </p>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>by Kibet Dennis</span>
            </div>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/blogs" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base block py-1"
                >
                  All Blogs
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base block py-1"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base block py-1"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/create-blog" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base block py-1"
                >
                  Create Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base block py-1"
                >
                  FAQs
                </a>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base block py-1"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact"
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base block py-1"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/policy" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base block py-1"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm sm:text-base block py-1"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">
              Connect With Us
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-4">
              Follow us on social media for updates and community discussions.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              <a 
                href="https://twitter.com" target="_blank"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a 
                href="https://github.com/kibetkipsang" target="_blank"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a 
                href="https://linkedin.com" target="_blank"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
              <a 
                href="https://facebook.com"  target="_blank"
                className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </a>
            </div>

            {/* Email Contact */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Mail className="h-4 w-4" />
              <a 
                href="mailto:hello@blogit.com" 
                className="hover:text-green-400 transition-colors"
              >
                hello@blogit.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 sm:mt-10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="text-gray-500 text-sm sm:text-base">
              &copy; {currentYear} BlogIt. All rights reserved.
            </div>
            <div className="flex gap-6 text-gray-500 text-sm">
              <Link to="/policy" className="hover:text-green-400 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-green-400 transition-colors">
                Terms
              </Link>
              <Link to="/login" className="hover:text-green-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}