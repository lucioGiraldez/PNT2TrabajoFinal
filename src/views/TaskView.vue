<script setup>
import axios from 'axios'
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const MOCKAPI = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/tasks'

const tareas = ref([])
const nuevaTarea = ref("")
const cargando = ref(false)
const error = ref("")


const mostrarTareas = async () => {
  cargando.value = true
  try {
    const res = await axios.get(MOCKAPI)
    tareas.value = res.data
  } catch (err) {
    error.value = 'Error al cargar tareas.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

onMounted(async () => {
  await mostrarTareas()
})

const agregarTarea = async () => {
  if (nuevaTarea.value.trim() === '') return
  try {
    await axios.post(MOCKAPI, {
      titulo: nuevaTarea.value,
      completada: false,
      userId: Math.floor(Math.random() * 100) + 1
    })
    nuevaTarea.value = ''
    await mostrarTareas()
  } catch (err) {
    console.error('Error al agregar tarea', err)
  }
}

const eliminarTarea = async (id, titulo) => {
  if (!confirm(`❌¿Eliminar "${titulo}"?`)) return
  try {
    await axios.delete(`${MOCKAPI}/${id}`)
    await mostrarTareas()
  } catch (err) {
    console.error('Error al eliminar tarea', err)
  }
}

const editarTarea = (id) => {
  router.push(`/editTask/${id}`)
}

const toggleCompletada = async (tarea) => {
  try {
    await axios.put(`${MOCKAPI}/${tarea.id}`, {
      titulo: tarea.titulo,
      completada: !tarea.completada,
      userId: tarea.userId
    })
    await mostrarTareas()
  } catch (err) {
    console.error('Error al actualizar tarea', err)
  }
}
</script>

<template>
  <main class="task-container">
    <h2>Tu lista de tareas:</h2>
    <div v-if="cargando">⏳ Cargando tareas...</div>
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else-if="tareas.length" class="task-list">
      <div v-for="cadaTarea in tareas" :key="cadaTarea.id" class="task-card">
        <h3>{{ cadaTarea.titulo }}</h3>
<div class="completada">
  <span class="estado-label">Estado:</span>
  <button
    class="estado-btn"
    :class="cadaTarea.completada ? 'completa' : 'pendiente'"
    @click="toggleCompletada(cadaTarea)"
  >
    {{ cadaTarea.completada ? 'Completada' : 'Pendiente' }}
  </button>
</div>
        <p>👤 Usuario: {{ cadaTarea.userId }}</p>
        <div class="actions">
          <button class="button danger" @click="eliminarTarea(cadaTarea.id, cadaTarea.titulo)">Eliminar</button>
          <button class="button secondary" @click="editarTarea(cadaTarea.id)">Editar</button>
        </div>
      </div>
    </div>

    <p v-else>📝 No hay tareas cargadas.</p>
  </main>
</template>

<style>
.task-container {
  padding: 2rem;
}

h2 {
  margin-bottom: 1.5rem;
}

.add-task {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

input {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.button:hover {
  background-color: var(--secondary-color);
}

.button.secondary {
  background-color: #22c55e;
}

.button.danger {
  background-color: #ef4444;
}

.task-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.task-card {
  background-color: var(--card-color, white);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: var(--shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.2s ease;
}

.task-card:hover {
  transform: translateY(-4px);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.error {
  color: red;
  font-weight: bold;
}

/* Dark mode compatible */
body.dark .task-card {
  background-color: #1f2937;
  color: #f9fafb;
}

body.dark input {
  background-color: #374151;
  color: white;
  border-color: #555;
}
.completada {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.estado-label {
  font-weight: 500;
  font-size: 0.95rem;
  color: #374151;
}

.estado-btn {
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: white;
  font-size: 0.9rem;
}

.estado-btn.completa {
  background-color: #22c55e;
}

.estado-btn.pendiente {
  background-color: #9ca3af;
}

/* Modo oscuro */
body.dark .estado-label {
  color: #d1d5db;
}

body.dark .estado-btn.completa {
  background-color: #16a34a;
}

body.dark .estado-btn.pendiente {
  background-color: #6b7280;
}

body.dark .completada input[type="checkbox"] {
  accent-color: #22c55e;
}

</style>
