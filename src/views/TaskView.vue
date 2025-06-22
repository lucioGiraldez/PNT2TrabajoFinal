<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const DUMMY_API = 'https://dummyjson.com/todos'
const CRUD_API = 'https://crudcrud.com/api/26d60326a22d423090ef86d091bbf000/tareas'

const tareas = ref([])
const nuevaTarea = ref("")

// 1. Cargar desde CRUDCRUD
const mostrarTareas = async () => {
  try {
    const res = await axios.get(CRUD_API)
    tareas.value = res.data
  } catch (error) {
    console.log('Error al cargar tareas desde crudcrud', error)
  }
}

// 2. Si crudcrud está vacío, inicializar con dummyjson
const inicializarConDummy = async () => {
  const resCrud = await axios.get(CRUD_API)
  if (resCrud.data.length === 0) {
    const resDummy = await axios.get(DUMMY_API)
    const tareasDummy = resDummy.data.todos.slice(0, 5) // solo las primeras 5

    for (const tarea of tareasDummy) {
      await axios.post(CRUD_API, {
        titulo: tarea.todo,
        completada: tarea.completed,
        userId: tarea.userId
      })
    }
  }
}

onMounted(async () => {
  await inicializarConDummy()
  await mostrarTareas()
})

// Agregar tarea a CRUDCRUD
const agregarTarea = async () => {
  if (nuevaTarea.value.trim() === '') return
  try {
    await axios.post(CRUD_API, {
      titulo: nuevaTarea.value,
      completada: false,
      userId: Math.floor(Math.random() * 100) + 1
    })
    nuevaTarea.value = ''
    await mostrarTareas()
  } catch (error) {
    console.log('Error al agregar tarea', error)
  }
}

// Eliminar tarea desde CRUDCRUD
const eliminarTarea = async (_id, titulo) => {
  const confirmar = confirm(`¿Eliminar "${titulo}"?`)
  if (confirmar) {
    try {
      await axios.delete(`${CRUD_API}/${_id}`)
      await mostrarTareas()
    } catch (error) {
      console.log('Error al eliminar tarea', error)
    }
  }
}
</script>

<template>
  <main>
    <h2>Gestor de Tareas (base: dummyjson, persistencia: crudcrud)</h2>

    <input v-model="nuevaTarea" placeholder="Escribí una tarea" />
    <button @click="agregarTarea">Agregar</button>

    <table v-if="tareas.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Completada</th>
          <th>UserId</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cadaTarea in tareas" :key="cadaTarea._id">
          <td>{{ cadaTarea._id }}</td>
            <td>{{ cadaTarea.titulo }}</td>
          <td>{{ cadaTarea.completada }}</td>
          <td>{{ cadaTarea.userId }}</td>
          <td>
            <button @click="eliminarTarea(cadaTarea._id, cadaTarea.titulo)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No hay tareas cargadas.</p>
  </main>
</template>

<style>
main {
  padding: 20px;
}
table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
}
th, td {
  padding: 8px;
  border: 1px solid #ccc;
}
input {
  margin-right: 8px;
}
</style>