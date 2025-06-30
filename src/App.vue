<script setup>
import { ref, onMounted, watch, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import DashboardStats from './components/DashboardStats.vue'
import GraficoTareas from './components/GraficoTareas.vue'
import { useUserStore } from '@/stores/user'

const store = useUserStore()
const isLoggedIn = computed(() => store.isLoggedIn)
const MOCKAPI = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/tasks'
const darkMode = ref(false)
const total = ref(0)
const completadas = ref(0)
const pendientes = ref(0)
const route = useRoute()
const router = useRouter()
const dashboardRef = ref()
provide('dashboardRef', dashboardRef)

const cargarEstadisticas = async () => {
  try {
    const res = await axios.get(MOCKAPI)
    const tareas = res.data
    total.value = tareas.length
    completadas.value = tareas.filter(t => t.completada).length
    pendientes.value = tareas.filter(t => !t.completada).length
  } catch (err) {
    console.error('Error al cargar estadísticas', err)
  }
}

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  document.body.classList.toggle('dark', darkMode.value)
}

const logout = () => {
  store.logout()
  router.push('/login')
}

onMounted(() => {
  if (localStorage.getItem('dark') === 'true') {
    darkMode.value = true
    document.body.classList.add('dark')
  }
  cargarEstadisticas()
})

watch(darkMode, (value) => {
  localStorage.setItem('dark', value)
})
</script>

<template>
  <div v-if="isLoggedIn">
    <!-- ✅ BARRA DE USUARIO SEPARADA -->
    <div class="user-bar">
      <span class="login-alert">🔐 Logueado como: <strong>{{ store.user.email }}</strong></span>
      <div class="top-buttons">
        <button class="toggle-button" @click="toggleDarkMode">{{ darkMode ? '☀️ Claro' : '🌙 Oscuro' }}</button>
        <button class="toggle-button danger" @click="logout">🔓 Cerrar sesión</button>
      </div>
    </div>

    <!-- ✅ HEADER: LOGO Y NAVBAR SOBRIO -->
    <header class="header-bar">
      <div class="header-inner">
        <div class="header-top">
          <div class="logo-container">
            <img src="/logo.png" alt="Logo" class="logo-title" />
          </div>

          <nav class="navbar">
            <RouterLink to="/" class="nav-button" :class="{ active: route.path === '/' }">Inicio</RouterLink>
            <RouterLink to="/task" class="nav-button" :class="{ active: route.path === '/task' }">Ver Tareas</RouterLink>
            <RouterLink to="/users" class="nav-button" :class="{ active: route.path === '/users' }">Ver Usuarios</RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <div class="app-container">
      <main class="main-content">
        <RouterView />
      </main>

      <div v-if="route.path === '/'">
        <h2>📊 Estadísticas Generales</h2>
        <DashboardStats />
        <GraficoTareas />
      </div>
    </div>
  </div>

  <div v-else>
    <RouterView />
  </div>
</template>


<style>
body {
  background-color: #f4f4f2;
  color: #1f2937;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header-bar {
  width: 100%;
  background-color: transparent;
  padding: 1.5rem 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-inner {
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06); /* ✅ Borde suave */
  padding: 1.2rem 1.5rem;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

body.dark .header-inner {
  background-color: #1e2733;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08); /* ✅ Borde sutil en modo oscuro */
}

.header-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.logo-title {
  width: 240px;
  object-fit: contain;
}

/* === NAVBAR === */
.navbar {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.nav-button {
  background-color: #4f83cc;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.nav-button:hover {
  background-color: #3d6db5;
  transform: translateY(-1px);
}

.nav-button.active {
  background-color: #22c55e;
  color: white;
}

/* === BARRA DE USUARIO SEPARADA === */
.user-bar {
  width: 100%;
  padding: 0.8rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  flex-wrap: wrap;
}

.login-alert {
  font-size: 0.85rem;
  color: #4b5563;
}

.top-buttons {
  display: flex;
  gap: 0.5rem;
}

.toggle-button {
  background-color: #4f83cc;
  color: white;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85rem;
  transition: background-color 0.3s ease;
}

.toggle-button:hover {
  background-color: #3d6db5;
}

.toggle-button.danger {
  background-color: #e16060;
}

.toggle-button.danger:hover {
  background-color: #c84c4c;
}

/* === CONTENIDO === */
.app-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.main-content {
  animation: fadeIn 0.6s ease-in-out;
}

h2 {
  margin-top: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

/* === MODO OSCURO === */
body.dark {
  background-color: #111827;
  color: #f9fafb;
}

body.dark .header-inner {
  background-color: #1e293b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

body.dark .login-alert {
  color: #ffffff;
}

body.dark .nav-button {
  background-color: #374151;
  color: #f9fafb;
}

body.dark .nav-button:hover {
  background-color: #4b5563;
}

body.dark .nav-button.active {
  background-color: #22c55e;
  color: white;
}

body.dark .toggle-button {
  background-color: #334155;
  color: #f1f5f9;
}

body.dark .toggle-button:hover {
  background-color: #475569;
}

body.dark .toggle-button.danger {
  background-color: #f87171;
}

body.dark .toggle-button.danger:hover {
  background-color: #ef4444;
}

body.dark h2 {
  color: #ffffff;
}

/* === ANIMACIÓN === */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>