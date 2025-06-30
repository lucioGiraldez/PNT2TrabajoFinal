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

const verDetalleUsuario = () => {
  if (idUsuario.value) {
    router.push(`/userDetail/${idUsuario.value}`)
  }
}

const volverAlMenu = () => {
  router.push(`/task`)
}
</script>

<template>
  <!-- Palabra Volver al menú -->
    <div class="volver-link" @click="volverAlMenu"><span class="volver-texto">⬅ Volver al Menú</span></div>

  <main v-if="tarea">
    <h2>📝 Detalle de Tarea</h2>

    <p><strong>ID Tarea:</strong> {{ tarea.id }}</p>
    <p><strong>Título:</strong> {{ tarea.titulo }}</p>
    <p><strong>Descripción:</strong> {{ tarea.descripcion || 'No ingresada' }}</p>
    <p><strong>ID Usuario asignado:</strong> {{ idUsuario }}</p>
    <p>
      <strong>Nombre Usuario asignado: </strong>
      <span class="usuario-link" @click="verDetalleUsuario">{{ nombreUsuario }}</span>
    </p>
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
  background-color: #f7f5f1;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.4s ease;
  font-size: 1.1rem;
  line-height: 1.6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2d3748;
}

main h2 {
  margin-top: 0;
  padding-top: 0.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  text-align: left;
}

p {
  margin-bottom: 0.8rem;
  color: #4a5568;
}

strong {
  color: #4f83cc;
}

.volver-link {
  max-width: 700px;
  margin: 1rem auto 0;
  padding: 0 2rem;
  text-align: left;
  cursor: pointer;
  font-weight: bold;
  color: #000000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.volver-link:hover {
  text-decoration: underline;
}

/* ✅ usuario-link destacado, evocativo de navegación */
.usuario-link {
  color: #0ea5e9; /* Celeste vibrante */
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}
.usuario-link:hover {
  color: #38bdf8;
}

/* Animación */
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

/* 🌙 Modo oscuro */
body.dark {
  background-color: #1a202c;
  color: #f9fafb;
}

body.dark main {
  background-color: #2d3748;
  border: 1px solid #4a5568;
  color: #f9fafb;
}

body.dark p {
  color: #e2e8f0;
}

body.dark strong {
  color: #60a5fa;
}

body.dark .volver-link {
  color: #ffffff;
}
body.dark .volver-link:hover {
  color: #60a5fa;
}

body.dark .usuario-link {
  color: #38bdf8;
}
body.dark .usuario-link:hover {
  color: #7dd3fc;
}

.volver-texto {
  color: #000000;
  font-weight: bold;
}

body.dark .volver-texto {
  color: #ffffff;
}

body.dark main h2 {
  color: #f9fafb;
  text-decoration-color: #ffffff;
}

</style>