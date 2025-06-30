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

const volverAlMenu = () => {
  router.push('/task')
}

</script>

<template>
<div class="volver-link" @click="volverAlMenu"><span class="volver-texto">⬅ Volver al Menú</span></div>
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
        Estado:
        <strong :class="tarea.completada ? 'texto-verde' : 'texto-amarillo'">
            {{ tarea.completada ? 'Completada' : 'Pendiente' }}
        </strong>
        </p>
        <p>Descripción: {{ tarea.descripcion || 'No ingresada' }}</p>            
        <button class="button info" @click="verDetalleTarea(tarea.id)">Detalles</button>
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
  background-color: #f7f5f1;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.4s ease;
  font-size: 1.1rem;
  line-height: 1.6;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2d3748;
}

h2, h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.6rem;
  color: #2d3748;
}

h4 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
  color: #1f2937;
}

p {
  margin-bottom: 0.6rem;
  color: #4a5568;
}

strong {
  color: #4f83cc;
}

.divider {
  margin: 2rem 0;
  height: 1px;
  background-color: #d1d5db;
}

.task-list {
  display: grid;
  gap: 1.2rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.task-card {
  background-color: #f7f5f1;
  padding: 1.4rem;
  border-radius: 14px;
  border: 1px solid #dcd8d0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.task-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.task-card p {
  margin: 0.3rem 0;
  color: #4a5568;
}

.estado-label {
  font-weight: 500;
  font-size: 0.95rem;
  color: #2d3748;
}

.estado-text {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.estado-text.completa {
  color: #4cad73;
}

.estado-text.pendiente {
  color: #d1a837;
}

.button.info {
  background-color: #7b61ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.8rem;
  transition: background-color 0.3s ease;
}
.button.info:hover {
  background-color: #684de0;
}

.chart-box {
  max-width: 600px;
  margin: 2rem auto;
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

/* 🌙 Modo oscuro */
body.dark main {
  background-color: #2d3748;
  color: #f9fafb;
}

body.dark h2,
body.dark h3,
body.dark h4 {
  color: #f9fafb;
}

body.dark p {
  color: #e2e8f0;
}

body.dark strong {
  color: #60a5fa;
}

body.dark .task-card {
  background-color: #1f2937;
  border: 1px solid #4a5568;
  color: #f1f5f9;
}

body.dark .task-card p {
  color: #f1f5f9;
}

body.dark .estado-label {
  color: #e2e8f0;
}

body.dark .estado-text.completa {
  color: #4cad73;
}

body.dark .estado-text.pendiente {
  color: #facc15;
}

body.dark .divider {
  background-color: #4a5568;
}

body.dark .button.info {
  background-color: #7b61ff;
  color: white;
}
body.dark .button.info:hover {
  background-color: #684de0;
}

.texto-verde {
  color: #4cad73;
  font-weight: 600;
}

.texto-amarillo {
  color: #d1a837;
  font-weight: 600;
}

body.dark .texto-verde {
  color: #4cad73;
}

body.dark .texto-amarillo {
  color: #facc15;
}

.volver-link {
  max-width: 900px;
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

.volver-texto {
  color: #000000;
  font-weight: bold;
}

body.dark .volver-link {
  color: #ffffff;
}
body.dark .volver-link:hover {
  color: #60a5fa;
}

body.dark .volver-texto {
  color: #ffffff;
}

</style>