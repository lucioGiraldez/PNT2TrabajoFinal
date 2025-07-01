<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
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

    const resUser = await axios.get(`${USER_API}/${tarea.value.userId}`)
    nombreUsuario.value = resUser.data.nombre
  } catch (err) {
    console.error('Error al cargar datos de tarea o usuario:', err)
  }
})

const formatFecha = (fechaStr) => {
  if (!fechaStr) return 'No disponible'
  const fecha = new Date(fechaStr)
  fecha.setMinutes(fecha.getMinutes() + Math.abs(fecha.getTimezoneOffset()))
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const verDetalleUsuario = () => {
  if (idUsuario.value) {
    router.push(`/userDetail/${idUsuario.value}`)
  }
}

const volverAlMenu = () => {
  router.push(`/task`)
}

const editarTarea = () => {
  router.push(`/editTask/${tarea.value.id}`)
}

const eliminarTarea = async () => {
  const confirmacion = confirm(`¿Eliminar la tarea "${tarea.value.titulo}"?`)
  if (!confirmacion) return

  try {
    await axios.delete(`${TASK_API}/${tarea.value.id}`)
    router.push('/task')
  } catch (err) {
    console.error('Error al eliminar tarea', err)
    alert('Hubo un error al eliminar la tarea.')
  }
}

</script>

<template>
  <div class="top-bar">
    <button class="volver-btn" @click="volverAlMenu">
      ⬅ Volver al Menú 🏠
    </button>
    <div class="titulo-box">
      <h2>📝 Detalle de Tarea</h2>
    </div>
  </div>

  <main v-if="tarea">
    <p><strong>ID Tarea:</strong> {{ tarea.id }}</p>
    <p><strong>Título:</strong> {{ tarea.titulo }}</p>
    <p><strong>Descripción:</strong> {{ tarea.descripcion || 'No ingresada' }}</p>
    <p><strong>ID Usuario asignado:</strong> {{ idUsuario }}</p>
    <p>
      <strong>Nombre Usuario asignado:</strong>
      <span class="usuario-link" @click="verDetalleUsuario">{{ nombreUsuario }}</span>
    </p>
    <p><strong>Completada:</strong> {{ tarea.completada ? 'Sí' : 'No' }}</p>
    <p><strong>Fecha límite:</strong> {{ formatFecha(tarea.deadline) || 'No asignada' }}</p>
    <p><strong>Fecha de creación tarea:</strong> {{ formatFecha(tarea.creada) }}</p>
  </main>

  <div class="acciones">
  <button class="btn editar" @click="editarTarea">✏️ Editar Tarea</button>
  <button class="btn eliminar" @click="eliminarTarea">🗑️ Eliminar Tarea</button>
  </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: start;
  max-width: 900px;
  margin: 2rem auto 0;
  padding: 0 1rem;
  gap: 1.5rem;
  flex-wrap: wrap;
}

/* Botón volver moderno */
.volver-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
  margin-left: 0;
}
.volver-btn:hover {
  background-color: #2563eb;
}

/* Contenedor del título más estrecho y centrado */
.titulo-box {
  flex-grow: 1;
  max-width: 500px;
  margin: 0 auto;
  background-color: #e0e7ff;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: 2px solid #3b82f6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.titulo-box h2 {
  margin: 0;
  font-size: 1.6rem;
  color: #1e40af;
  font-weight: bold;
}

/* Contenido principal */
main {
  max-width: 700px;
  margin: 1rem auto 2rem;
  padding: 2rem;
  background-color: #f7f5f1;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.4s ease;
  font-size: 1.1rem;
  line-height: 1.6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2d3748;
}

p {
  margin-bottom: 0.8rem;
  color: #4a5568;
}

strong {
  color: #4f83cc;
}

.usuario-link {
  color: #0ea5e9;
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}
.usuario-link:hover {
  color: #38bdf8;
}

/* Modo oscuro */
body.dark main {
  background-color: #2d3748;
  color: #f9fafb;
  border: 1px solid #4a5568;
}
body.dark p {
  color: #e2e8f0;
}
body.dark strong {
  color: #60a5fa;
}
body.dark .usuario-link {
  color: #38bdf8;
}
body.dark .usuario-link:hover {
  color: #7dd3fc;
}
body.dark .volver-btn {
  background-color: #60a5fa;
}
body.dark .volver-btn:hover {
  background-color: #3b82f6;
}
body.dark .titulo-box {
  background-color: #1e293b;
  border-color: #60a5fa;
}
body.dark .titulo-box h2 {
  color: #93c5fd;
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

.acciones {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.6rem 1.4rem;
  font-size: 1rem;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
}

.btn.editar {
  background-color: #22c55e;
  color: white;
}

.btn.editar:hover {
  background-color: #16a34a;
}

.btn.eliminar {
  background-color: #ef4444;
  color: white;
}

.btn.eliminar:hover {
  background-color: #dc2626;
}

/* Modo oscuro */
body.dark .btn.editar {
  background-color: #4ade80;
}
body.dark .btn.editar:hover {
  background-color: #22c55e;
}

body.dark .btn.eliminar {
  background-color: #f87171;
}
body.dark .btn.eliminar:hover {
  background-color: #ef4444;
}

</style>
