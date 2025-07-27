import { Link, useNavigate } from 'react-router-dom'
import { User, Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../lib/config'

const navigationLinks = [
  { name: 'Store', href: '/store' },
  { name: 'Create Shop', href: '/create-shop' },
  { name: 'Education', href: '/education' },
  { name: 'Feed', href: '/feed' },
  { name: 'Marketplace', href: '/marketplace' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [myShops, setMyShops] = useState([]);
  const [showMyShops, setShowMyShops] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setIsLoggedIn(!!data.user);
        setUser(data.user || null);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setShowProfileMenu((prev) => !prev)
    } else {
      navigate('/login')
    }
  }

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/logout`, { method: 'GET', credentials: 'include' })
    setIsLoggedIn(false)
    setShowProfileMenu(false)
    navigate('/login')
  }

  const handleMyShopsClick = async () => {
    if (!showMyShops) {
      const res = await fetch(`${API_BASE_URL}/api/shop/my-shops`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setMyShops(data.shops || []);
      }
    }
    setShowMyShops((prev) => !prev);
  };

  return (
    <motion.nav 
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background/80 backdrop-blur-xl border-b border-border/50 fixed top-0 left-0 right-0 z-50 shadow-lg shadow-primary/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
              MY Online 
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.href}
                  className="relative px-4 py-2 text-foreground hover:text-primary font-medium transition-all duration-300 group"
                >
                  <span className="relative z-10">{link.name}</span>
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    layoutId="navbar-highlight"
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right side - Profile & Mobile Menu */}
          <div className="flex items-center space-x-4 relative">
            {isLoggedIn && (
              <motion.button
                onClick={handleMyShopsClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-all duration-300 group"
              >
                <span className="font-semibold">My Shops</span>
              </motion.button>
            )}
            {isLoggedIn && showMyShops && (
              <div className="absolute right-0 top-12 bg-white text-black rounded shadow-lg py-2 w-56 z-50 max-h-96 overflow-y-auto">
                {myShops.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">No shops found</div>
                ) : (
                  myShops.map((shop) => (
                    <Link
                      key={shop._id}
                      to={`/shop/${shop._id}`}
                      className="block px-4 py-2 hover:bg-gray-100 text-ellipsis overflow-hidden whitespace-nowrap"
                      onClick={() => setShowMyShops(false)}
                    >
                      {shop.shopName}
                    </Link>
                  ))
                )}
              </div>
            )}
            {/* Profile button and menu */}
            <motion.button
              onClick={handleProfileClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-all duration-300 group"
            >
              <User className="h-5 w-5" />
              <motion.div
                className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
                whileHover={{ scale: 1.2 }}
              />
            </motion.button>
            {isLoggedIn && showProfileMenu && (
              <div className="absolute right-0 top-12 bg-white text-black rounded shadow-lg py-2 w-32 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 text-foreground hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden border-t border-border/50"
        >
          <div className="py-4 space-y-2">
            {navigationLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 font-medium"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
