// src/router/index.js o src/router.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
/* { path: '/', component: Home },
 { path: '/about', component: About } */
  { path: '/contador', 
    name: 'contador',
    component: () => import('../components/Contador.vue')
  },
 { path: '/lista-de-tareas',
   name: 'ListaDeTareas', 
   component: () => import('../components/ListaTareas.vue')
  },
  { path: '/main',
   name: 'main', 
   component: () => import('../views/MainView.vue')
   },
   { path: '/taskView',
   name: 'taskView', 
   component: () => import('../views/TaskView.vue')
   },
    { path: '/newTask',
   name: 'newTask', 
   component: () => import('../views/NewTaskView.vue')
   },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
