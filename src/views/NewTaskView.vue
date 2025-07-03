<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import emailjs from '@emailjs/browser'

const router = useRouter()

const titulo = ref('')
const descripcion = ref('')
const completada = ref('')
const userId = ref('')
const deadline = ref('')
const usuarios = ref([])

const USERS_API = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/users'
const TASKS_API = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/tasks'

const obtenerUsuarios = async () => {
  try {
    const res = await axios.get(USERS_API)
    usuarios.value = res.data
  } catch (err) {
    console.error('Error al cargar usuarios', err)
  }
}

const agregarTarea = async () => {
  if (
    titulo.value.trim() === '' ||
    userId.value.trim() === '' ||
    descripcion.value.trim() === '' ||
    completada.value === ''
  ) return alert('⚠️ Completá todos los campos')

  try {
    const usuario = usuarios.value.find(u => u.id === userId.value)
    await axios.post(TASKS_API, {
      
      titulo: titulo.value, // aunque el schema dice Number, pasamos string
      descripcion: descripcion.value,
      completada: completada.value === 'true',
      userId: userId.value,
      deadline: deadline.value,
      creada: new Date().toISOString() // ✔️ Fecha actual en formato ISO UTC
    })

    const tareaParaEmail = {
      titulo: titulo.value,
      descripcion: descripcion.value,
      deadline: deadline.value
    }

    await enviarEmail(usuario, tareaParaEmail)

    alert(`✅ Tarea "${titulo.value}" agregada con éxito`)
    router.push('/task')
  } catch (error) {
    console.error('Error al agregar tarea', error)
  }
}

const formatFecha = (fechaStr) => {
  if (!fechaStr) return 'No disponible'
  const [anio, mes, dia] = fechaStr.slice(0, 10).split('-')
  return `${dia}/${mes}/${anio}`
}

const enviarEmail = async (usuario, tarea) => {
  const templateParams = {
    to_name: usuario.nombre,
    to_email: usuario.email,
    task_title: tarea.titulo,
    task_description: tarea.descripcion || 'No ingresada',
    task_deadline: formatFecha(tarea.deadline)
  }

  try {
    await emailjs.send(
      'service_pfdfnbk',        // tu service ID
      'template_d8v31ze',       // tu template ID
      templateParams,
      'E2DVeZ92a-5Pv2KmO'       // tu public key
    )
    alert('📧 ¡Email enviado correctamente al usuario!')
  } catch (err) {
    alert('❌ Error al enviar el email. Revisá la consola para más detalles.')
    console.error('❌ Error al enviar email:', err)
  }
}




onMounted(obtenerUsuarios)
</script>

<template>
  <h1>Agregar Tarea</h1>
  <main>
    <form @submit.prevent="agregarTarea">
      <div>
        <label>Título</label>
        <input v-model="titulo" type="text" placeholder="Título" required />
      </div>

      <div>
        <label>Descripción</label>
        <textarea v-model="descripcion" placeholder="Descripción de la tarea" required />
      </div>

      <div>
        <label>Completada</label>
        <select v-model="completada" required>
          <option value="">Seleccionar...</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      <div>
        <label>Asignar a Usuario</label>
        <select v-model="userId" required>
          <option value="">Seleccionar usuario...</option>
          <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
            {{ usuario.nombre }} ({{ usuario.email }})
          </option>
        </select>
      </div>

      <div>
        <label>Fecha límite</label>
        <input
          v-model="deadline"
          type="date"
          required
          onkeydown="return false"
        />
      </div>

      <button type="submit">Agregar</button>
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

/* Modo oscuro */
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