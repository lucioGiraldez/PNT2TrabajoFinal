<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter()
const titulo = ref('')
const completada = ref('')
const userId = ref('')

const CRUD_API = 'https://crudcrud.com/api/26d60326a22d423090ef86d091bbf000/tareas'

// Agregar tarea a CRUDCRUD
const agregarTarea = async () => {
  if (titulo.value.trim() === '') return
  try {
    await axios.post(CRUD_API, {
      titulo: titulo.value,
      completada: completada.value === "true",
      userId: userId.value
    })
    alert(`✅ Tarea ${titulo.value} agregada con éxito`)
    router.push('/task')
    //await mostrarTareas()
  } catch (error) {
    console.log('Error al agregar tarea', error)
  }
}

</script>

<template>
<H1>AGREGAR LIBRO</H1>
<main>
<form @submit.prevent="agregarTarea">
  <div>
    <label for="titulo">Título</label>
    <input v-model="titulo" type="text" placeholder="Título" required />
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
    <label for="userId">ID del Usuario</label>
    <input v-model="userId" type="text" placeholder="User ID" required />
  </div>

  <button type="submit">Agregar</button>
</form>

</main>
</template>

<style></style>