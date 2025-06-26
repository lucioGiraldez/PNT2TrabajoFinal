import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
