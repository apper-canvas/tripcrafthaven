import { Outlet, NavLink, useParams, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { tripService } from '@/services'

const Layout = () => {
  const [currentTrip, setCurrentTrip] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { tripId } = useParams()
  const location = useLocation()

  useEffect(() => {
    const loadCurrentTrip = async () => {
      if (tripId) {
        try {
          const trip = await tripService.getById(tripId)
          setCurrentTrip(trip)
        } catch (error) {
          setCurrentTrip(null)
        }
      } else {
        setCurrentTrip(null)
      }
    }
    loadCurrentTrip()
  }, [tripId])

  const navigationItems = [
    { id: 'trips', label: 'My Trips', path: '/trips', icon: 'MapPin' }
  ]

  const tripNavigationItems = currentTrip ? [
    { id: 'timeline', label: 'Timeline', path: `/trip/${tripId}/timeline`, icon: 'Calendar' },
    { id: 'packing', label: 'Packing', path: `/trip/${tripId}/packing`, icon: 'Package' },
    { id: 'overview', label: 'Overview', path: `/trip/${tripId}/overview`, icon: 'BarChart3' }
  ] : []

  const isActive = (path) => {
    if (path === '/trips' && location.pathname === '/trips') return true
    if (path.includes('/trip/') && location.pathname.includes(path.split('/:')[0])) {
      return location.pathname.includes(path.split('/').pop())
    }
    return false
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 lg:w-80 bg-surface-50 border-r border-surface-200 z-40">
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-surface-200">
            <div className="w-10 h-10 rounded-xl gradient-travel flex items-center justify-center">
              <ApperIcon name="Plane" className="w-6 h-6 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-display font-bold text-gray-900">TripCraft</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 hover:bg-white hover:text-primary hover:shadow-md'
                    }`
                  }
                >
                  <ApperIcon 
                    name={item.icon} 
                    className="mr-3 h-5 w-5 flex-shrink-0" 
                  />
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Current Trip Section */}
            {currentTrip && (
              <div className="pt-6">
                <div className="px-4 mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Current Trip
                  </h3>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-surface-200">
                    <h4 className="font-display font-semibold text-gray-900 mb-1">
                      {currentTrip.name}
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                      {currentTrip.destination}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {tripNavigationItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) =>
                        `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-secondary text-white shadow-lg'
                            : 'text-gray-600 hover:bg-white hover:text-secondary hover:shadow-md'
                        }`
                      }
                    >
                      <ApperIcon 
                        name={item.icon} 
                        className="mr-3 h-5 w-5 flex-shrink-0" 
                      />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-surface-200 px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg gradient-travel flex items-center justify-center">
            <ApperIcon name="Plane" className="w-5 h-5 text-white" />
          </div>
          <h1 className="ml-2 text-lg font-display font-bold text-gray-900">TripCraft</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
        >
          <ApperIcon name="Menu" className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-surface-50 z-50 shadow-xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center px-6 py-6 border-b border-surface-200">
                  <div className="w-10 h-10 rounded-xl gradient-travel flex items-center justify-center">
                    <ApperIcon name="Plane" className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="ml-3 text-xl font-display font-bold text-gray-900">TripCraft</h1>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="ml-auto p-2 rounded-lg hover:bg-surface-200 transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  <div className="space-y-1">
                    {navigationItems.map((item) => (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-primary text-white shadow-lg'
                              : 'text-gray-600 hover:bg-white hover:text-primary hover:shadow-md'
                          }`
                        }
                      >
                        <ApperIcon 
                          name={item.icon} 
                          className="mr-3 h-5 w-5 flex-shrink-0" 
                        />
                        {item.label}
                      </NavLink>
                    ))}
                  </div>

                  {currentTrip && (
                    <div className="pt-6">
                      <div className="px-4 mb-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Current Trip
                        </h3>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-surface-200">
                          <h4 className="font-display font-semibold text-gray-900 mb-1">
                            {currentTrip.name}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                            {currentTrip.destination}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {tripNavigationItems.map((item) => (
                          <NavLink
                            key={item.id}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                isActive
                                  ? 'bg-secondary text-white shadow-lg'
                                  : 'text-gray-600 hover:bg-white hover:text-secondary hover:shadow-md'
                              }`
                            }
                          >
                            <ApperIcon 
                              name={item.icon} 
                              className="mr-3 h-5 w-5 flex-shrink-0" 
                            />
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="lg:hidden h-16"></div>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout