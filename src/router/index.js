// src/router/index.js o src/router.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [

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
   { path: '/task',
   name: 'task', 
   component: () => import('../views/TaskView.vue')
   },
   { path: '/newTask',
   name: 'newTask', 
   component: () => import('../views/NewTaskView.vue')
   },
   { path: '/editTask/:id',
   name: 'editTask', 
   component: () => import('../views/EditTaskView.vue')
   },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
