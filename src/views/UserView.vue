<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const MOCKAPI_USERS = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/users'
const MOCKAPI_TASKS = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/tasks'

const usuarios = ref([])
const tareas = ref([])
const cargando = ref(false)
const error = ref("")

const mostrarUsuariosYTareas = async () => {
  cargando.value = true
  try {
    const [resUsuarios, resTareas] = await Promise.all([
      axios.get(MOCKAPI_USERS),
      axios.get(MOCKAPI_TASKS)
    ])
    usuarios.value = resUsuarios.data.map(usuario => {
      const tareasDelUsuario = resTareas.data.filter(t => t.userId == usuario.id)
      const completadas = tareasDelUsuario.filter(t => t.completada).length
      return {
        ...usuario,
        cantTareas: tareasDelUsuario.length,
        cantCompletadas: completadas
      }
    })
  } catch (err) {
    error.value = 'Error al cargar usuarios y tareas.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

onMounted(async () => {
  await mostrarUsuariosYTareas()
})

const irANuevaVistaUsuario = () => {
  router.push('/newUser')
}

const eliminarUsuario = async (id, nombre) => {
  if (!confirm(`❌¿Eliminar a "${nombre}"?`)) return
  try {
    await axios.delete(`${MOCKAPI_USERS}/${id}`)
    await mostrarUsuariosYTareas()
  } catch (err) {
    console.error('Error al eliminar usuario', err)
  }
}

const editarUsuario = (id) => {
  router.push(`/editUser/${id}`)
}
</script>

<template>
  <main class="task-container">
    <h2>Usuarios registrados</h2>
    <button class="button modern" @click="irANuevaVistaUsuario">➕ Agregar Usuario</button>

    <div v-if="cargando">⏳ Cargando Usuarios...</div>
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else-if="usuarios.length" class="task-list">
      <div v-for="u in usuarios" :key="u.id" class="task-card">
        <h3>👤 {{ u.nombre }}</h3>
        <p>ID: {{ u.id }}</p>
        <p>📧 Email: {{ u.email }}</p>
        <p>📋 Tareas: {{ u.cantTareas }}</p>
        <p>✅ Completadas: {{ u.cantCompletadas }}</p>
        <div class="actions">
          <button class="button danger" @click="eliminarUsuario(u.id, u.nombre)">Eliminar</button>
          <button class="button secondary" @click="editarUsuario(u.id)">Editar</button>
        </div>
      </div>
    </div>

    <p v-else>📝 No hay usuarios cargados.</p>
  </main>
</template>

<style>
.task-container {
  padding: 2rem;
}

h2 {
  margin-bottom: 1.5rem;
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

.button.modern {
  background-color: #3b82f6;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

body.dark .task-card {
  background-color: #1f2937;
  color: #f9fafb;
}
</style>
