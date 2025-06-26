<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const nombre = ref('')
const email = ref('')
const router = useRouter()

const MOCKAPI = 'https://685c760b769de2bf085ccc90.mockapi.io/taskapi/users'

const agregarUsuario = async () => {
  if (nombre.value.trim() === '' || email.value.trim() === '') return

  try {
    await axios.post(MOCKAPI, {
      nombre: nombre.value,
      email: email.value
    })
    alert(`✅ Usuario agregado con éxito`)
    router.push('/users')
  } catch (error) {
    console.error('Error al agregar usuario', error)
  }
}
</script>

<template>
  <h1>Agregar Usuario</h1>
  <main>
    <form @submit.prevent="agregarUsuario">
      <div>
        <label for="nombre">Nombre</label>
        <input v-model="nombre" type="text" placeholder="Nombre" required />
      </div>

      <div>
        <label for="email">Email</label>
        <input v-model="email" type="email" placeholder="Email" required />
      </div>
      <button type="submit">Agregar Usuario</button>
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

input {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.2s ease;
}

input:focus {
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

body.dark main {
  background-color: #1f2937;
  color: #f9fafb;
}

body.dark input {
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
