<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const tarea = ref(null)
const nombreUsuario = ref('')
const idUsuario = ref('')

const TASK_API = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/tasks'
const USER_API = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/users'

onMounted(async () => {
  try {
    const res = await axios.get(`${TASK_API}/${route.params.id}`)
    tarea.value = res.data

    idUsuario.value = tarea.value.userId

    // Buscar nombre del usuario asignado
    const resUser = await axios.get(`${USER_API}/${tarea.value.userId}`)
    nombreUsuario.value = resUser.data.nombre
  } catch (err) {
    console.error('Error al cargar datos de tarea o usuario:', err)
  }
})

const formatFecha = (fechaStr) => {
  if (!fechaStr) return 'No disponible'
  const fecha = new Date(fechaStr)
  fecha.setMinutes(fecha.getMinutes() + Math.abs(fecha.getTimezoneOffset())) // corrige desfase horario
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<template>
  <main v-if="tarea">
    <h2>📝 Detalle de Tarea</h2>
    <p><strong>ID Tarea:</strong> {{ tarea.id }}</p>
    <p><strong>Título:</strong> {{ tarea.titulo }}</p>
    <p><strong>Descripción:</strong> {{ tarea.descripcion || 'No ingresada' }}</p>
    <p><strong>ID Usuario asignado:</strong> {{ idUsuario }}</p>
    <p><strong>Nombre Usuario asignado:</strong> {{ nombreUsuario }}</p>
    <p><strong>Completada:</strong> {{ tarea.completada ? 'Sí' : 'No' }}</p>
    <p><strong>Fecha límite:</strong> {{ formatFecha(tarea.deadline) || 'No asignada' }}</p>
    <p><strong>Fecha de creación tarea:</strong> {{ formatFecha(tarea.creada) }}</p>
  </main>
</template>

<style scoped>
main {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--card-color, white);
  border-radius: 12px;
  box-shadow: var(--shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
  animation: fadeIn 0.4s ease;
  font-size: 1.1rem;
  line-height: 1.6;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

p {
  margin-bottom: 0.8rem;
}

strong {
  color: var(--primary-color, #3b82f6);
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

body.dark main {
  background-color: #1f2937;
  color: #f9fafb;
}

body.dark strong {
  color: #60a5fa;
}
</style>