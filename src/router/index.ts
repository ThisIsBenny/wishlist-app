import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import CreateWishlistView from '@/views/CreateWishlistView.vue'
import AddWishlistItemView from '@/views/AddWishlistItemView.vue'
import DetailView from '@/views/DetailView.vue'
import { useAuth } from '@/composables'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/create-wishlist',
      name: 'create-wishlist',
      component: CreateWishlistView,
      meta: { requiresAuth: true },
    },
    {
      path: '/add-wishlist-item',
      name: 'add-wishlist--item',
      component: AddWishlistItemView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:slug',
      name: 'detail',
      component: DetailView,
      meta: { requiresAuth: false },
    },
    {
      name: 'notFound',
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { requiresAuth: false },
    },
  ],
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value && to.meta.requiresAuth === true) {
    return { name: 'login' }
  }
})

export default router
