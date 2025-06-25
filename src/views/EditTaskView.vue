<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const DUMMY_API = 'https://dummyjson.com/todos'
const CRUD_API = 'https://crudcrud.com/api/b891e4abe02d47febcdd172dfda64e6c/tareas'

//Esto es para poder llamar al id del parametro /editTask/:id
const router = useRouter() 
const route = useRoute()

// Variables reactivas
const titulo = ref('')
const completada = ref('')
const userId = ref('')

const taskId = route.params.id

const taskToEdit = ref({
    titulo:"",
    completada:"",
    userId:""
})

const cargarTareaAEditar = async () => {
    

    try {
        const response = await axios.get(`${CRUD_API}/${taskId}`)
        taskToEdit.value = response.data
        
        // Asignás a los campos del formulario
        titulo.value = taskToEdit.value.titulo
        completada.value = taskToEdit.value.completada
        userId.value = taskToEdit.value.userId

        console.log("Tarea Cargada: ", taskToEdit);
        
    } catch (error) {
        console.log("Error al cargar la tarea para editar");
        
    }
}

const editarTarea = async () => {
    const confirmar = confirm(`¿Guardar cambios de "${titulo.value}"?`)
  if (confirmar) {
    try {
      await axios.put(`${CRUD_API}/${taskToEdit.value._id}`, taskToEdit.value)
      alert(`✅ Tarea "${titulo.value}" editada con éxito`)
      router.push('/task')
      //await mostrarTareas()
    } catch (error) {
      console.log('Error al editar tarea', error)
    }
  }
}

onMounted(()=>{
    cargarTareaAEditar()
})

</script>

<template>
<H1>EDITAR LIBRO</H1>
<main>
<form @submit.prevent="editarTarea">
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

  <button type="submit">Guardar tarea editada</button>
</form>

</main>
</template>

<style></style>