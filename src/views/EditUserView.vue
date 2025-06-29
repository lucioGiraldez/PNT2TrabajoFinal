<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const idUsuario = route.params.id

const MOCKAPI = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/users'

const nombre = ref('')
const email = ref('')
const celular = ref('')
const rol = ref('')
const descripcion = ref('')

const cargando = ref(false)
const error = ref('')

const rolesDisponibles = [
  'Frontend DEV',
  'Backend DEV',
  'Mobile DEV',
  'QA Engineer',
  'Data Engineer',
  'Security Engineer'
]

const cargarUsuario = async () => {
  cargando.value = true
  try {
    const res = await axios.get(`${MOCKAPI}/${idUsuario}`)
    const data = res.data
    nombre.value = data.nombre || ''
    email.value = data.email || ''
    celular.value = data.celular?.toString() || ''
    rol.value = data.rol || ''
    descripcion.value = data.descripcion || ''
  } catch (err) {
    error.value = 'Error al cargar el usuario.'
    console.error(err)
  } finally {
    cargando.value = false
  }
}

const soloNumeros = (e) => {
  const original = e.target.value
  const filtrado = original.replace(/\D/g, '')
  if (original !== filtrado) {
    alert('⚠️ Solo se permiten números en el campo celular.')
  }
  celular.value = filtrado
}

const guardarCambios = async () => {
  const confirmar = confirm(`¿Guardar cambios de "${nombre.value}"?`)
  if (!confirmar) return

  if (!/^\d+$/.test(celular.value)) {
    alert('⚠️ El campo celular debe contener solo números.')
    return
  }

  try {
    await axios.put(`${MOCKAPI}/${idUsuario}`, {
      nombre: nombre.value,
      email: email.value,
      celular: celular.value,
      rol: rol.value,
      descripcion: descripcion.value
    })
    alert('✅ Usuario actualizado con éxito')
    router.push('/users')
  } catch (err) {
    console.error('Error al actualizar usuario', err)
  }
}

onMounted(() => {
  cargarUsuario()
})
</script>

<template>
  <main class="form-container">
    <h2>Editar Usuario</h2>

    <div v-if="cargando">⏳ Cargando...</div>
    <p v-else-if="error" class="error">{{ error }}</p>

    <form v-else @submit.prevent="guardarCambios">
      <div>
        <label for="nombre">Nombre</label>
        <input v-model="nombre" type="text" placeholder="Nombre" required />
      </div>

      <div>
        <label for="email">Email</label>
        <input v-model="email" type="email" placeholder="Correo electrónico" required />
      </div>

      <div>
        <label for="celular">Celular</label>
        <input
          v-model="celular"
          @input="soloNumeros"
          type="text"
          placeholder="Sólo números"
          required
        />
      </div>

      <div>
        <label for="rol">Rol</label>
        <select v-model="rol" required>
          <option value="">Seleccionar rol...</option>
          <option v-for="opcion in rolesDisponibles" :key="opcion" :value="opcion">
            {{ opcion }}
          </option>
        </select>
      </div>

      <div>
        <label for="descripcion">Descripción</label>
        <textarea
          v-model="descripcion"
          placeholder="Descripción del usuario"
          required
        ></textarea>
      </div>

      <button type="submit">Guardar cambios</button>
    </form>
  </main>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--card-color, white);
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 6px rgba(0, 0, 0, 0.1));
}

h2 {
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

body.dark .form-container {
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

