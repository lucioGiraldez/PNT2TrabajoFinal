<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const DUMMY_API = 'https://dummyjson.com/todos'
const CRUD_API = 'https://crudcrud.com/api/26d60326a22d423090ef86d091bbf000/tareas'

const tareas = ref([])
const nuevaTarea = ref("")
const cargando = ref(false)
const error = ref("")

const mostrarTareas = async () => {
  cargando.value = true
  try {
    const res = await axios.get(CRUD_API)
    tareas.value = res.data
  } catch (err) {
    error.value = 'Error al cargar tareas.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

const inicializarConDummy = async () => {
  try {
    const resCrud = await axios.get(CRUD_API)
    if (resCrud.data.length === 0) {
      const resDummy = await axios.get(DUMMY_API)
      const tareasDummy = resDummy.data.todos.slice(0, 5)

      for (const tarea of tareasDummy) {
        await axios.post(CRUD_API, {
          titulo: tarea.todo,
          completada: tarea.completed,
          userId: tarea.userId
        })
      }
    }
  } catch (err) {
    console.error("Error al inicializar con dummy", err)
  }
}

onMounted(async () => {
  await inicializarConDummy()
  await mostrarTareas()
})

const agregarTarea = async () => {
  if (nuevaTarea.value.trim() === '') return
  try {
    await axios.post(CRUD_API, {
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

const eliminarTarea = async (_id, titulo) => {
  if (!confirm(`¿Eliminar "${titulo}"?`)) return
  try {
    await axios.delete(`${CRUD_API}/${_id}`)
    await mostrarTareas()
  } catch (err) {
    console.error('Error al eliminar tarea', err)
  }
}

const editarTarea = (_id) => {
  router.push(`/editTask/${_id}`)
}

const toggleCompletada = async (tarea) => {
  try {
    await axios.put(`${CRUD_API}/${tarea._id}`, {
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
    <h2>📋 Gestor de Tareas</h2>

    <div class="add-task">
      <input v-model="nuevaTarea" placeholder="Escribí una tarea" />
      <button class="button" @click="agregarTarea">Agregar</button>
    </div>

    <div v-if="cargando">⏳ Cargando tareas...</div>
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else-if="tareas.length" class="task-list">
      <div v-for="t in tareas" :key="t._id" class="task-card">
        <h3>{{ t.titulo }}</h3>
        <div class="completada">
          <label>
            <input type="checkbox" :checked="t.completada" @change="toggleCompletada(t)" />
            {{ t.completada ? 'Completada' : 'Pendiente' }}
          </label>
        </div>
        <p>👤 Usuario: {{ t.userId }}</p>
        <div class="actions">
          <button class="button danger" @click="eliminarTarea(t._id, t.titulo)">Eliminar</button>
          <button class="button secondary" @click="editarTarea(t._id)">Editar</button>
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
}

.completada input[type="checkbox"] {
  margin-right: 0.5rem;
  transform: scale(1.2);
  cursor: pointer;
}

body.dark .completada input[type="checkbox"] {
  accent-color: #22c55e;
}

</style>
