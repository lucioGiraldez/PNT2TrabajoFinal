<template>
    <h2>Lista de Tareas</h2>
    <input type="text" v-model="nuevaTarea" @keyup.enter="agregarTarea">
    <ul>
        <li v-for="(cadaTarea, index) in tareas" :key="index"> 
            <!-- El :key se encarga de asignarle un id único bajo la variable index a cadaTarea -->
                {{ cadaTarea }}
                <button @click="borrarTarea(index)">Borrar Tarea</button>
        </li>
    </ul> 
</template>

<script setup>
import { ref } from 'vue';
const tareas = ref([]) //Será un Array de tareas
const nuevaTarea = ref('')
const agregarTarea = () => {
    tareas.value.push(nuevaTarea.value)
    nuevaTarea.value = ''
}

const borrarTarea = (index) => {
    tareas.value.splice(index, 1)
}
</script>

<style></style>