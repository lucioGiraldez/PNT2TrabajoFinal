<script setup>
import { ref, onMounted, watch } from 'vue'

const darkMode = ref(false)

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  document.body.classList.toggle('dark', darkMode.value)
}

onMounted(() => {
  if (localStorage.getItem('dark') === 'true') {
    darkMode.value = true
    document.body.classList.add('dark')
  }
})

watch(darkMode, (value) => {
  localStorage.setItem('dark', value)
})
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1 class="app-title">📋 Administrador de Tareas</h1>
      <button class="toggle-button" @click="toggleDarkMode">
        {{ darkMode ? '☀️ Claro' : '🌙 Oscuro' }}
      </button>
    </header>

    <nav class="navbar">
      <RouterLink to="/task" class="nav-button">Ver Tareas</RouterLink>       
      <RouterLink to="/newTask" class="nav-button">Agregar Tarea</RouterLink>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>

  

  <section class="dashboard">
    <div class="stat-card">
      <h3>Total de tareas</h3>
      <p>12</p>
    </div>
    <div class="stat-card">
      <h3>Completadas</h3>
      <p>8</p>
    </div>
    <div class="stat-card">
      <h3>Pendientes</h3>
      <p>4</p>
    </div>
  </section>
</template>

<style>
.app-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.app-title {
  font-size: 2rem;
  font-weight: bold;
}

.toggle-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  font-weight: bold;
}

.toggle-button:hover {
  background-color: var(--secondary-color);
}

.navbar {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.nav-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  font-weight: bold;
  transition: var(--transition);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.nav-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.router-link-exact-active.nav-button {
  background-color: #22c55e; /* verde activo */
  color: #fff;
}

/* Modo oscuro */
body.dark {
  background-color: #111827;
  color: #f9fafb;
}

body.dark .toggle-button {
  background-color: #374151;
}

body.dark .toggle-button:hover {
  background-color: #4b5563;
}

body.dark .nav-button {
  background-color: #374151;
  color: #f9fafb;
}

body.dark .nav-button:hover {
  background-color: #4b5563;
}

.dashboard {
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 150px;
  background-color: var(--card-color, white);
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
}

body.dark .stat-card {
  background-color: #1f2937;
}

.main-content {
  animation: fadeIn 0.6s ease-in-out;
}

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
