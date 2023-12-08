import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import BookingView from '../views/BookingView.vue'
// import CustomerView from '../views/CustomerView.vue'
// import HotelView from '../views/HotelView.vue'
import HotelFormView from '../views/hotel/HotelFormView.vue'
import HotelView from '../views/HotelView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/bookings',
      name: 'booking',
      component: () => import('../views/BookingView.vue')
    },
    {
      path: '/hotels',
      name: 'hotels',
      component: () => import('../views/HotelView.vue')
    },
    {
      path: '/create-hotel',
      name: 'create-hotel',
      component: () => import('../views/hotel/HotelFormView.vue')
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/CustomerView.vue')
    }

  ]
})

export default router
