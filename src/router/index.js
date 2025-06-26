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
  { path: '/users',
   name: 'userView', 
   component: () => import('../views/UserView.vue')
   },   
  { path: '/newUser',
   name: 'userAdministration', 
   component: () => import('../views/NewUserView.vue')
   },
   { path: '/editUser/:id',
   name: 'editUser', 
   component: () => import('../views/EditUserView.vue')
   }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
