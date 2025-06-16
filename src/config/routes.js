import MyTrips from '@/components/pages/MyTrips'
import Timeline from '@/components/pages/Timeline'
import Calendar from '@/components/pages/Calendar'
import Packing from '@/components/pages/Packing'
import Overview from '@/components/pages/Overview'
export const routes = {
  trips: {
    id: 'trips',
    label: 'My Trips',
    path: '/trips',
    icon: 'MapPin',
    component: MyTrips
  },
  timeline: {
    id: 'timeline',
    label: 'Timeline',
    path: '/trip/:tripId/timeline',
    icon: 'Calendar',
    component: Timeline,
    requiresTrip: true
},
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/trip/:tripId/calendar',
    icon: 'CalendarDays',
    component: Calendar,
    requiresTrip: true
  },
  packing: {
    id: 'packing',
    label: 'Packing',
    path: '/trip/:tripId/packing',
    icon: 'Package',
    component: Packing,
    requiresTrip: true
  },
  overview: {
    id: 'overview',
    label: 'Overview',
    path: '/trip/:tripId/overview',
    icon: 'BarChart3',
    component: Overview,
    requiresTrip: true
  }
}

export const routeArray = Object.values(routes)
export default routes