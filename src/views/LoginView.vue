<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleLogin = () => {
  if (!email.value.trim() || !password.value.trim()) {
    return alert('Ingresá email y contraseña')
  }

  const user = {
    email: email.value,
    password: password.value
  }

  userStore.login(user)
  alert(`Bienvenido ${user.email}`)
  router.push('/')
}
</script>

<template>
  <main class="login-container">
    <h2>Iniciar Sesión</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Contraseña" />
    <button @click="handleLogin">Entrar</button>
  </main>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background-color: var(--card-color, white);
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  background-color: var(--primary-color, #3b82f6);
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: var(--secondary-color, #2563eb);
}
</style>