<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const route = useRoute()
const router = useRouter()

const usuario = ref(null)
const tareasUsuario = ref([])

const tareasTotales = ref(0)
const tareasCompletadas = ref(0)

const formatFecha = (fechaStr) => {
  if (!fechaStr) return 'No disponible'
  const [anio, mes, dia] = fechaStr.slice(0, 10).split('-')
  return `${dia}/${mes}/${anio}`
}

const cargarDatos = async () => {
  try {
    const resUsuario = await axios.get(`https://685c760b769de2bf085ccc90.mockapi.io/taskapi/users/${route.params.id}`)
    usuario.value = resUsuario.data

    const resTareas = await axios.get(`https://685c760b769de2bf085ccc90.mockapi.io/taskapi/tasks`)
    tareasUsuario.value = resTareas.data.filter(t => t.userId == route.params.id)

    tareasTotales.value = tareasUsuario.value.length
    tareasCompletadas.value = tareasUsuario.value.filter(t => t.completada).length
  } catch (err) {
    console.error('Error al cargar datos del usuario:', err)
  }
}

onMounted(cargarDatos)

const verDetalleTarea = (id) => {
  router.push(`/taskDetail/${id}`)
}

const chartData = computed(() => ({
  labels: ['Asignadas', 'Completadas'],
  datasets: [
    {
      label: 'Tareas',
      backgroundColor: ['#3b82f6', '#22c55e'],
      data: [tareasTotales.value, tareasCompletadas.value]
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' }
  }
}
</script>

<template>
  <main v-if="usuario">
    <h2>👨‍🎓 Detalle de Usuario</h2>
    <p><strong>ID:</strong> {{ usuario.id }}</p>
    <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
    <p><strong>Email:</strong> {{ usuario.email }}</p>
    <p><strong>Celular:</strong> {{ usuario.celular || 'No cargado' }}</p>
    <p><strong>Rol:</strong> {{ usuario.rol || 'No asignado' }}</p>
    <p><strong>Descripción:</strong> {{ usuario.descripcion || 'No ingresada' }}</p>
    <p><strong>Fecha de creación usuario:</strong> {{ formatFecha(usuario.creado) }}</p>

    <div class="divider"></div>

    <h3>📝 Tareas asignadas</h3>
    <div v-if="tareasUsuario.length" class="task-list">
      <div v-for="tarea in tareasUsuario" :key="tarea.id" class="task-card">
        <h4>{{ tarea.titulo }}</h4>
        <p>📅 Fecha límite: {{ formatFecha(tarea.deadline) }}</p>
        <p>
          <strong>Estado:</strong>
          <span :class="tarea.completada ? 'badge complete' : 'badge pending'">
            {{ tarea.completada ? 'Completada' : 'Pendiente' }}
          </span>
        </p>
        <p><strong>Descripción:</strong> {{ tarea.descripcion || 'No ingresada' }}</p>
        <button class="button info" @click="verDetalleTarea(tarea.id)">Vista Detallada</button>
      </div>
    </div>
    <p v-else>📭 Este usuario no tiene tareas asignadas.</p>

    <div class="divider"></div>

    <h3>📊 Estadísticas del Usuario</h3>
    <p><strong>Total de tareas:</strong> {{ tareasTotales }}</p>
    <p><strong>Tareas completadas:</strong> {{ tareasCompletadas }}</p>

    <div class="chart-box">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--card-color, white);
  border-radius: 12px;
  box-shadow: var(--shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
  animation: fadeIn 0.4s ease;
  font-size: 1.1rem;
  line-height: 1.6;
}

h2, h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.5rem;
}

h4 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

p {
  margin-bottom: 0.5rem;
}

strong {
  color: var(--primary-color, #3b82f6);
}

.divider {
  margin: 2rem 0;
  height: 1px;
  background-color: #ddd;
}

.task-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.task-card {
  background-color: var(--card-color, #f9fafb);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: var(--shadow, 0 2px 6px rgba(0, 0, 0, 0.08));
}

.button.info {
  background-color: #6366f1;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.8rem;
}

.button.info:hover {
  background-color: #4f46e5;
}

.badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: bold;
  margin-left: 0.5rem;
}

.badge.complete {
  background-color: #22c55e;
  color: white;
}

.badge.pending {
  background-color: #f59e0b;
  color: white;
}

.chart-box {
  max-width: 600px;
  margin: 2rem auto;
}

body.dark main {
  background-color: #1f2937;
  color: #f9fafb;
}

body.dark .task-card {
  background-color: #111827;
}

body.dark .divider {
  background-color: #374151;
}
</style>