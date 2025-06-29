import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/task',
    name: 'task',
    component: () => import('../views/TaskView.vue')
  },
  {
    path: '/newTask',
    name: 'newTask',
    component: () => import('../views/NewTaskView.vue')
  },
  {
    path: '/editTask/:id',
    name: 'editTask',
    component: () => import('../views/EditTaskView.vue')
  },
  {
    path: '/users',
    name: 'userView',
    component: () => import('../views/UserView.vue')
  },
  {
    path: '/newUser',
    name: 'userAdministration',
    component: () => import('../views/NewUserView.vue')
  },
  {
    path: '/editUser/:id',
    name: 'editUser',
    component: () => import('../views/EditUserView.vue')
  },
  {
  path: '/taskDetail/:id',
  name: 'taskDetail',
  component: () => import('../views/TaskDetailView.vue')
},
{
  path: '/userDetail/:id',
  name: 'userDetail',
  component: () => import('../views/UserDetailView.vue')
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useUserStore()
  if (!store.isLoggedIn && to.path !== '/login') {
    return next('/login')
  }
  if (store.isLoggedIn && to.path === '/login') {
    return next('/')
  }
  next()
})

export default router
