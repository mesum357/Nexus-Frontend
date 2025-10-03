import { Link, useNavigate } from 'react-router-dom'
import { User, Menu, X, Wifi, WifiOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../lib/config'
import { checkAuthStatus, isOnline, addNetworkListeners, isPWA } from '../lib/pwa-auth'
import Logo from '@/assets/sdf.png'

const navigationLinks = [
  { name: 'Store', href: '/store' },
  { name: 'Education', href: '/education' },
  { name: 'Hospital', href: '/hospital' },
  { name: 'Feed', href: '/feed' },
  { name: 'Marketplace', href: '/marketplace' },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [myShops, setMyShops] = useState([]);
  const [myInstitutes, setMyInstitutes] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [showShops, setShowShops] = useState(false);
  const [showInstitutes, setShowInstitutes] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [user, setUser] = useState(null);
  const [isOffline, setIsOffline] = useState(!isOnline());
  const [isPWAMode, setIsPWAMode] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    setIsPWAMode(isPWA());
    
    // Enhanced authentication check with PWA support
    const checkAuth = async () => {
      try {
        const authState = await checkAuthStatus();
        setIsLoggedIn(authState.isAuthenticated);
        setUser(authState.user);
        setIsOffline(authState.isOffline);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();

    // Add network status listeners
    const cleanup = addNetworkListeners(
      () => {
        setIsOffline(false);
        checkAuth(); // Re-check auth when coming online
      },
      () => setIsOffline(true)
    );

    return cleanup;
  }, []);

  const handleProfileClick = async () => {
    if (isLoggedIn) {
      const newShowProfileMenu = !showProfileMenu;
      setShowProfileMenu(newShowProfileMenu);
      
      // Load shops, institutes, and marketplace products when opening the profile menu
      if (newShowProfileMenu) {
        try {
          // Load shops
          if (myShops.length === 0) {
            const shopsRes = await fetch(`${API_BASE_URL}/api/shop/my-shops`, { credentials: 'include' });
            if (shopsRes.ok) {
              const shopsData = await shopsRes.json();
              setMyShops(shopsData.shops || []);
            }
          }
          
          // Load institutes
          if (myInstitutes.length === 0) {
            const institutesRes = await fetch(`${API_BASE_URL}/api/institute/my-institutes`, { credentials: 'include' });
            if (institutesRes.ok) {
              const institutesData = await institutesRes.json();
              setMyInstitutes(institutesData.institutes || []);
            }
          }

          // Load marketplace products
          if (myProducts.length === 0) {
            const productsRes = await fetch(`${API_BASE_URL}/api/marketplace/user/my-products`, { credentials: 'include' });
            if (productsRes.ok) {
              const productsData = await productsRes.json();
              setMyProducts(productsData.products || []);
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    } else {
      navigate('/login')
    }
  }

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/logout`, { method: 'GET', credentials: 'include' })
    setIsLoggedIn(false)
    setShowProfileMenu(false)
    setMyShops([])
    setMyInstitutes([])
    setMyProducts([])
    setShowShops(false)
    setShowInstitutes(false)
    setShowProducts(false)
    navigate('/login')
  }

  const handleMyShopsClick = async () => {
    if (myShops.length === 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/shop/my-shops`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setMyShops(data.shops || []);
        }
      } catch (error) {
        console.error('Error loading shops:', error);
      }
    }
    setShowShops(!showShops);
  };

  const handleMyInstitutesClick = async () => {
    if (myInstitutes.length === 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/institute/my-institutes`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setMyInstitutes(data.institutes || []);
        }
      } catch (error) {
        console.error('Error loading institutes:', error);
      }
    }
    setShowInstitutes(!showInstitutes);
  };

  const handleMyProductsClick = async () => {
    if (myProducts.length === 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/marketplace/user/my-products`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setMyProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    }
    setShowProducts(!showProducts);
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
            <Link to="/" className="flex items-center">
              <img 
                src={Logo} 
                alt="E Duniya Logo" 
                className="h-12 w-auto"
              />
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

          {/* Right side - Network Status, Profile & Mobile Menu */}
          <div className="flex items-center space-x-4 relative">
            {/* Network Status Indicator (PWA mode only) */}
            {isPWAMode && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium ${
                  isOffline 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {isOffline ? (
                  <WifiOff className="h-3 w-3" />
                ) : (
                  <Wifi className="h-3 w-3" />
                )}
                <span>{isOffline ? 'Offline' : 'Online'}</span>
              </motion.div>
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
              <div className="absolute right-0 top-12 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 w-80 z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user?.fullName?.[0] || user?.username?.[0] || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {user?.fullName || user?.username || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* My Shops Section */}
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      My Shops
                    </h3>
                    <button
                      onClick={handleMyShopsClick}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      {showShops ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showShops && (
                    <div className="space-y-1">
                      {myShops.length === 0 ? (
                        <div className="text-xs text-gray-500 py-2 px-3 bg-gray-50 rounded-lg">
                          No shops found
                        </div>
                      ) : (
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {myShops.map((shop) => (
                            <Link
                              key={shop._id}
                              to={`/shop/${shop._id}`}
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors duration-150"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="truncate">{shop.shopName}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* My Institutes Section */}
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      My Institutes
                    </h3>
                    <button
                      onClick={handleMyInstitutesClick}
                      className="text-xs text-green-600 hover:text-green-700 font-medium"
                    >
                      {showInstitutes ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showInstitutes && (
                    <div className="space-y-1">
                      {myInstitutes.length === 0 ? (
                        <div className="text-xs text-gray-500 py-2 px-3 bg-gray-50 rounded-lg">
                          No institutes found
                        </div>
                      ) : (
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {myInstitutes.map((institute) => (
                            <Link
                              key={institute._id}
                              to={`/education/institute/${institute._id}`}
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors duration-150"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="truncate">{institute.name}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* My Store Section (Marketplace Listings) */}
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      My Store
                    </h3>
                    <button
                      onClick={handleMyProductsClick}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {showProducts ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showProducts && (
                    <div className="space-y-1">
                      {myProducts.length === 0 ? (
                        <div className="text-xs text-gray-500 py-2 px-3 bg-gray-50 rounded-lg">
                          No marketplace listings found
                        </div>
                      ) : (
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {myProducts.map((product) => (
                            <Link
                              key={product._id}
                              to={`/marketplace/product/${product._id}`}
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors duration-150"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                <span className="truncate">{product.title}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-2"></div>

                {/* Profile Actions */}
                <div className="px-4 py-2 space-y-1">
                  <Link
                    to={user?.username ? `/feed/profile/${user.username}` : '/feed/profile'}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  

                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                  >
                    <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
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
