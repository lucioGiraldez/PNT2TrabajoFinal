<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const MOCKAPI = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/tasks'

const router = useRouter()
const route = useRoute()
const titulo = ref('')
const descripcion = ref('')
const completada = ref('')
const userId = ref('')
const deadline = ref('')

const taskId = route.params.id

const taskToEdit = ref({
  titulo: '',
  descripcion: '',
  completada: '',
  userId: '',
  deadline: ''
})

const cargarTareaAEditar = async () => {
  try {
    const response = await axios.get(`${MOCKAPI}/${taskId}`)
    taskToEdit.value = response.data

    titulo.value = taskToEdit.value.titulo
    descripcion.value = taskToEdit.value.descripcion
    completada.value = taskToEdit.value.completada
    userId.value = taskToEdit.value.userId
    deadline.value = new Date(taskToEdit.value.deadline).toISOString().split('T')[0]

    console.log('Tarea Cargada: ', taskToEdit)
  } catch (error) {
    console.error('Error al cargar la tarea para editar')
  }
}

const editarTarea = async () => {
  const confirmar = confirm(`¿Guardar cambios de "${titulo.value}"?`)
  if (confirmar) {
    try {
      const tareaActualizada = {
        titulo: titulo.value,
        descripcion: descripcion.value,
        completada: completada.value === 'true',
        userId: taskToEdit.value.userId,
        deadline: deadline.value
      }

      await axios.put(`${MOCKAPI}/${taskToEdit.value.id}`, tareaActualizada)
      alert(`✅ Tarea "${titulo.value}" editada con éxito`)
      router.push('/task')
    } catch (error) {
      console.log('Error al editar tarea', error)
    }
  }
}

onMounted(cargarTareaAEditar)
</script>

<template>
  <h1>Editar Tarea</h1>
  <main>
    <form @submit.prevent="editarTarea">
      <div>
        <label for="titulo">Título</label>
        <input v-model="titulo" type="text" placeholder="Título" required />
      </div>

      <div>
        <label for="descripcion">Descripción</label>
        <textarea v-model="descripcion" placeholder="Descripción de la tarea" required></textarea>
      </div>

      <div>
        <label for="completada">Completada</label>
        <select v-model="completada" required>
          <option value="">Seleccionar...</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      <div>
        <label for="deadline">Fecha límite</label>
        <input
          v-model="deadline"
          type="date"
          required
          onkeydown="return false"
        />
      </div>

      <button type="submit">Guardar tarea editada</button>
    </form>
  </main>
</template>

<style scoped>
main {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--card-color, white);
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 6px rgba(0, 0, 0, 0.1));
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: bold;
}

form > div {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input,
select,
textarea {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.2s ease;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #22c55e;
}

button[type="submit"] {
  background-color: var(--primary-color, #3b82f6);
  color: white;
  font-weight: bold;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

button[type="submit"]:hover {
  background-color: var(--secondary-color, #2563eb);
}


body.dark button[type="submit"] {
  background-color: #3b82f6;
  color: white;
}

body.dark button[type="submit"]:hover {
  background-color: #2563eb;
}

body.dark main {
  background-color: #1f2937;
  color: #f9fafb;
}

body.dark input,
body.dark select,
body.dark textarea {
  background-color: #374151;
  color: #f9fafb;
  border: 1px solid #4b5563;
}

body.dark button[type="submit"] {
  background-color: #374151;
}

body.dark button[type="submit"]:hover {
  background-color: #4b5563;
}
</style>